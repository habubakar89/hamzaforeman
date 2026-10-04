/**
 * RSVP collector for hamzaforeman.com -- a Google Apps Script web app that
 * appends each reply to a Google Sheet, emails Hamza a readable summary, and
 * (optionally) mirrors the reply into a Notion database.
 *
 * SETUP, once (about five minutes, no cost):
 *   1. Create a Google Sheet. Name it anything.
 *   2. Extensions -> Apps Script. Delete the sample code, paste this file.
 *   3. Deploy -> New deployment -> type "Web app".
 *        Execute as: Me.   Who has access: Anyone.
 *      Authorise when asked. Copy the web app URL.
 *   4. Paste that URL into ENDPOINT in index.html (search for "ENDPOINT").
 *
 * EVERY LATER CODE CHANGE needs Deploy -> Manage deployments -> pencil ->
 * Version: New version -> Deploy, or the URL keeps running the old code.
 *
 * EDITS: a guest who sends again is matched by email or WhatsApp number.
 * In the sheet the earlier row is marked "superseded" and the new one
 * "current" (filter the status column to see only current replies). In
 * Notion the guest's existing card is updated in place, so there is always
 * one card per guest. The email says "RSVP update" when that happened.
 *
 * NOTION (optional, works on the free plan):
 *   1. notion.so/my-integrations -> New integration (internal) -> copy the
 *      secret.
 *   2. In Notion, make a page to hold the RSVPs (e.g. "Wedding RSVPs").
 *      On that page: ... menu -> Connections -> add your integration.
 *   3. Copy the page ID: the 32 hex characters at the end of the page URL.
 *   4. In Apps Script: Project Settings -> Script properties -> add
 *        NOTION_TOKEN        = the secret from step 1
 *        NOTION_PARENT_PAGE  = the page ID from step 3
 *   5. In the editor, pick the function setupNotion and press Run. It creates
 *      the database with the right columns and remembers its ID. Authorise
 *      the "connect to an external service" prompt when it appears.
 *   6. Deploy a new version (see above). From then on every RSVP appears in
 *      both the sheet and Notion.
 */

var SHEET = 'RSVPs';
var NOTIFY = 'habubakar89@gmail.com';   // one email per reply; '' for none

// Must match KEY in index.html. Not a secret (it is readable in the page),
// but a bare copy of the URL without it is refused.
var RSVP_KEY = 'nugeOJQGeFSMx19k';
var MAX_FIELD = 600;        // characters per field; longer is not a human reply
var MAX_PER_MINUTE = 20;    // across all guests; a burst beyond this is a script

var COLUMNS = [
  'received', 'status', 'attending', 'name', 'headcount', 'party', 'days',
  'email', 'whatsapp', 'arrive', 'depart', 'from_city',
  'diet', 'diet_note', 'note', 'know_by', 'page', 'ua'
];

// how two replies are recognised as the same guest
function contactKeys(p) {
  var keys = [];
  var e = String(p.email || '').trim().toLowerCase();
  var w = String(p.whatsapp || '').replace(/[^\d]/g, '');
  if (e) keys.push('e:' + e);
  if (w.length >= 7) keys.push('w:' + w);
  return keys;
}

var ANSWER = { yes: 'Coming', maybe: 'Not sure yet', no: 'Not coming' };

function doPost(e) {
  var p = parseBody(e);

  // the gate: right key, empty honeypot, sane sizes, no flood
  if (p.k !== RSVP_KEY) return refuse('key');
  if (p.website) return refuse('honeypot');
  if (!p.name || !p.attending) return refuse('empty');
  for (var k in p) if (String(p[k]).length > MAX_FIELD) return refuse('size');
  var cache = CacheService.getScriptCache();
  var n = Number(cache.get('rpm') || 0) + 1;
  cache.put('rpm', String(n), 60);
  if (n > MAX_PER_MINUTE) return refuse('flood');

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  var now = new Date();
  var previous = writeRow(sh, p, now);      // the reply this one replaces, if any

  try { notify(p, ss.getUrl(), now, previous); } catch (err) { console.error('email failed: ' + err); }
  try { notion(p, now); } catch (err) { console.error('notion failed: ' + err); }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------------------------
// The sheet. Columns are found by header name, so the sheet can grow a column
// without breaking older rows; a header that is missing gets added on the end.
// ---------------------------------------------------------------------------
function writeRow(sh, p, now) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (sh.getLastRow() === 0) { sh.appendRow(COLUMNS); sh.setFrozenRows(1); }
    var header = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0].map(String);
    COLUMNS.forEach(function (c) {
      if (header.indexOf(c) < 0) { header.push(c); sh.getRange(1, header.length).setValue(c); }
    });
    var col = {}; header.forEach(function (h, i) { col[h] = i; });

    // find earlier current rows from the same guest and mark them superseded
    var keys = contactKeys(p), previous = null;
    var last = sh.getLastRow();
    if (keys.length && last > 1) {
      var rows = sh.getRange(2, 1, last - 1, header.length).getValues();
      for (var r = rows.length - 1; r >= 0; r--) {
        var row = rows[r];
        var status = String(row[col.status] || '');
        if (status === 'superseded') continue;
        var rk = contactKeys({ email: row[col.email], whatsapp: row[col.whatsapp] });
        var same = rk.some(function (k) { return keys.indexOf(k) >= 0; });
        if (!same) continue;
        if (!previous) previous = { name: row[col.name], attending: row[col.attending], headcount: row[col.headcount], days: row[col.days] };
        sh.getRange(r + 2, col.status + 1).setValue('superseded');
      }
    }

    var out = header.map(function (h) {
      if (h === 'received') return now;
      if (h === 'status') return 'current';
      return p[h] || '';
    });
    sh.appendRow(out);
    return previous;
  } finally {
    lock.releaseLock();
  }
}

// The page posts as text/plain (a URL-encoded string) so the browser can
// read the answer; e.parameter is empty then, so parse the body ourselves.
function parseBody(e) {
  var p = {};
  if (e && e.postData && e.postData.contents && String(e.postData.type).indexOf('text/plain') === 0) {
    e.postData.contents.split('&').forEach(function (kv) {
      var i = kv.indexOf('=');
      if (i > 0) p[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1).replace(/\+/g, ' '));
    });
  } else {
    p = (e && e.parameter) || {};
  }
  return p;
}

function refuse(why) {
  // same shape as success so a prober learns nothing; the page shows its fallback
  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, why: why }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Visiting the URL in a browser proves the deployment is alive. */
function doGet() {
  return ContentService.createTextOutput('RSVP endpoint is up.');
}

// ---------------------------------------------------------------------------
// The email: one glance tells you who, what, how many, and how to reach them.
// ---------------------------------------------------------------------------
function notify(p, sheetUrl, when, previous) {
  if (!NOTIFY) return;
  var answer = ANSWER[p.attending] || p.attending;
  var count = p.attending === 'yes' ? ' (' + (p.headcount || '1') + ')' : '';
  var subject = (previous ? 'RSVP update · ' : 'RSVP · ') + p.name + ' · ' + answer + count;
  var was = previous
    ? (ANSWER[previous.attending] || previous.attending) + (previous.attending === 'yes' ? ' (' + (previous.headcount || '1') + ')' : '')
      + (previous.days ? ', days ' + previous.days : '')
    : '';

  var rows = [
    ['Answer', answer + count],
    ['Replaces', was],
    ['With', p.party],
    ['Days', p.days],
    ['Arriving', p.arrive],
    ['Leaving', p.depart],
    ['Flying from', p.from_city],
    ['Food', [p.diet, p.diet_note].filter(Boolean).join(' · ')],
    ['Might know by', p.know_by],
    ['Email', p.email],
    ['WhatsApp', p.whatsapp],
    ['Note', p.note]
  ].filter(function (r) { return r[1]; });

  var wa = p.whatsapp ? 'https://wa.me/' + String(p.whatsapp).replace(/[^\d]/g, '') : '';
  var mail = p.email ? 'mailto:' + p.email + '?subject=' + encodeURIComponent('Your RSVP') : '';

  var html =
    '<div style="margin:0;padding:28px 12px;background:#120C07;font-family:Georgia,\'Times New Roman\',serif;">' +
    '<div style="max-width:560px;margin:0 auto;background:#FAF3E8;border:1px solid #B08442;">' +
    '<div style="padding:26px 30px 18px;border-bottom:1px solid #E0BA79;">' +
    '<div style="font:11px/1 Helvetica,Arial,sans-serif;letter-spacing:.34em;text-transform:uppercase;color:#B08442;">RSVP</div>' +
    '<div style="margin-top:10px;font-size:28px;line-height:1.15;color:#123D32;">' + esc(p.name) + '</div>' +
    '<div style="margin-top:6px;font-style:italic;font-size:17px;color:#4A3A28;">' + esc(answer + count) + (previous ? ' <span style="font-style:normal;font-size:12px;color:#B08442;">updated</span>' : '') + '</div>' +
    '</div>' +
    '<table cellpadding="0" cellspacing="0" style="width:100%;padding:14px 30px 6px;border-collapse:collapse;">' +
    rows.map(function (r) {
      return '<tr>' +
        '<td style="padding:8px 14px 8px 0;vertical-align:top;white-space:nowrap;font:10px/1.8 Helvetica,Arial,sans-serif;letter-spacing:.28em;text-transform:uppercase;color:#B08442;">' + esc(r[0]) + '</td>' +
        '<td style="padding:8px 0;vertical-align:top;font-size:15px;line-height:1.5;color:#241708;">' + esc(r[1]).replace(/\n/g, '<br>') + '</td>' +
        '</tr>';
    }).join('') +
    '</table>' +
    '<div style="padding:16px 30px 26px;">' +
    btn(sheetUrl, 'Open the sheet') + (wa ? btn(wa, 'WhatsApp them') : '') + (mail ? btn(mail, 'Email them') : '') +
    '</div>' +
    '<div style="padding:12px 30px 18px;border-top:1px solid #E0BA79;font:11px/1.6 Helvetica,Arial,sans-serif;color:#6B5842;">' +
    'Received ' + Utilities.formatDate(when, Session.getScriptTimeZone(), 'EEE d MMM, HH:mm') +
    ' · from hamzaforeman.com' + (p.page ? ' ' + esc(p.page) : '') +
    '</div></div></div>';

  var text = rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n') + '\n\nSheet: ' + sheetUrl;

  MailApp.sendEmail({ to: NOTIFY, subject: subject, body: text, htmlBody: html, name: 'hamzaforeman.com' });
}

function btn(href, label) {
  return '<a href="' + href + '" style="display:inline-block;margin:0 10px 10px 0;padding:11px 18px;border:1px solid #123D32;border-radius:999px;' +
    'font:11px/1 Helvetica,Arial,sans-serif;letter-spacing:.24em;text-transform:uppercase;color:#123D32;text-decoration:none;">' + label + '</a>';
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}

// ---------------------------------------------------------------------------
// Notion: a mirror of every reply, so the guest list can live where you plan.
// Does nothing until setupNotion() has run (see the header).
// ---------------------------------------------------------------------------
var NOTION_VERSION = '2022-06-28';

function notionHeaders(token) {
  return { 'Authorization': 'Bearer ' + token, 'Notion-Version': NOTION_VERSION };
}

function notion(p, when) {
  var props = PropertiesService.getScriptProperties();
  var token = (props.getProperty('NOTION_TOKEN') || '').trim();
  var db = (props.getProperty('NOTION_DB') || '').trim();
  if (!token || !db) return;
  ensureNotionKey(token, db, props);

  var keys = contactKeys(p);
  var existing = keys.length ? findNotionPage(token, db, keys) : null;

  var rt = function (s) { return { rich_text: s ? [{ text: { content: String(s).slice(0, 2000) } }] : [] }; };
  var body = {
    parent: { database_id: db },
    properties: {
      'Contact key':   rt(keys.join(' ')),
      'Name':          { title: [{ text: { content: p.name } }] },
      'Answer':        { select: { name: ANSWER[p.attending] || p.attending } },
      'Headcount':     { number: Number(p.headcount || 0) },
      'Days':          { multi_select: (p.days || '').split(',').map(function (d) { return d.trim(); }).filter(Boolean).map(function (d) { return { name: d }; }) },
      'Email':         { email: p.email || null },
      'WhatsApp':      { phone_number: p.whatsapp || null },
      'With':          rt(p.party),
      'Arriving':      rt(p.arrive),
      'Leaving':       rt(p.depart),
      'Flying from':   rt(p.from_city),
      'Food':          rt([p.diet, p.diet_note].filter(Boolean).join(' · ')),
      'Note':          rt(p.note),
      'Might know by': rt(p.know_by),
      'Received':      { date: { start: when.toISOString() } }
    }
  };
  var res;
  if (existing) {
    delete body.parent;
    res = UrlFetchApp.fetch('https://api.notion.com/v1/pages/' + existing, {
      method: 'patch', contentType: 'application/json', headers: notionHeaders(token),
      payload: JSON.stringify(body), muteHttpExceptions: true
    });
  } else {
    res = UrlFetchApp.fetch('https://api.notion.com/v1/pages', {
      method: 'post', contentType: 'application/json', headers: notionHeaders(token),
      payload: JSON.stringify(body), muteHttpExceptions: true
    });
  }
  if (res.getResponseCode() >= 300) throw new Error('Notion ' + res.getResponseCode() + ': ' + res.getContentText().slice(0, 300));
}

/** The guest's existing card, by email or WhatsApp, or null. */
function findNotionPage(token, db, keys) {
  var filter = keys.length === 1
    ? { property: 'Contact key', rich_text: { contains: keys[0] } }
    : { or: keys.map(function (k) { return { property: 'Contact key', rich_text: { contains: k } }; }) };
  var res = UrlFetchApp.fetch('https://api.notion.com/v1/databases/' + db + '/query', {
    method: 'post', contentType: 'application/json', headers: notionHeaders(token),
    payload: JSON.stringify({ filter: filter, page_size: 1 }), muteHttpExceptions: true
  });
  if (res.getResponseCode() >= 300) throw new Error('Notion query ' + res.getResponseCode() + ': ' + res.getContentText().slice(0, 300));
  var results = JSON.parse(res.getContentText()).results || [];
  return results.length ? results[0].id : null;
}

/** Adds the "Contact key" column to a database created before it existed. Runs once. */
function ensureNotionKey(token, db, props) {
  if (props.getProperty('NOTION_KEYED') === db) return;
  var res = UrlFetchApp.fetch('https://api.notion.com/v1/databases/' + db, {
    method: 'patch', contentType: 'application/json', headers: notionHeaders(token),
    payload: JSON.stringify({ properties: { 'Contact key': { rich_text: {} } } }), muteHttpExceptions: true
  });
  if (res.getResponseCode() >= 300) throw new Error('Notion schema ' + res.getResponseCode() + ': ' + res.getContentText().slice(0, 300));
  props.setProperty('NOTION_KEYED', db);
}

/** Run once from the editor after setting NOTION_TOKEN and NOTION_PARENT_PAGE. */
function setupNotion() {
  var props = PropertiesService.getScriptProperties();
  var token = (props.getProperty('NOTION_TOKEN') || '').trim();
  // keep only the 32 hex characters, whatever else got pasted around them
  var parent = ((props.getProperty('NOTION_PARENT_PAGE') || '').match(/[0-9a-f]{32}/i) || [''])[0];
  if (!token || !parent) throw new Error('Set NOTION_TOKEN and NOTION_PARENT_PAGE (the 32-character page ID) in Project Settings -> Script properties first.');
  if (props.getProperty('NOTION_DB')) { Logger.log('Already set up: ' + props.getProperty('NOTION_DB')); return; }

  var body = {
    parent: { type: 'page_id', page_id: parent },
    title: [{ type: 'text', text: { content: 'RSVPs · Eman & Hamza' } }],
    properties: {
      'Name':          { title: {} },
      'Answer':        { select: { options: [
                          { name: 'Coming', color: 'green' },
                          { name: 'Not sure yet', color: 'yellow' },
                          { name: 'Not coming', color: 'gray' } ] } },
      'Headcount':     { number: { format: 'number' } },
      'Days':          { multi_select: { options: [
                          { name: '11', color: 'brown' }, { name: '12', color: 'brown' }, { name: '13', color: 'brown' } ] } },
      'Email':         { email: {} },
      'WhatsApp':      { phone_number: {} },
      'With':          { rich_text: {} },
      'Arriving':      { rich_text: {} },
      'Leaving':       { rich_text: {} },
      'Flying from':   { rich_text: {} },
      'Food':          { rich_text: {} },
      'Note':          { rich_text: {} },
      'Might know by': { rich_text: {} },
      'Contact key':   { rich_text: {} },
      'Received':      { date: {} }
    }
  };
  var res = UrlFetchApp.fetch('https://api.notion.com/v1/databases', {
    method: 'post', contentType: 'application/json', headers: notionHeaders(token),
    payload: JSON.stringify(body), muteHttpExceptions: true
  });
  if (res.getResponseCode() >= 300) throw new Error('Notion ' + res.getResponseCode() + ': ' + res.getContentText());
  var id = JSON.parse(res.getContentText()).id;
  props.setProperty('NOTION_DB', id);
  Logger.log('Notion database created: ' + id);
}
