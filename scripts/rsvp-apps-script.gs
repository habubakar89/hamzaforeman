/**
 * RSVP collector for hamzaforeman.com -- a Google Apps Script web app that
 * appends each reply to a Google Sheet and (optionally) emails you.
 *
 * Setup, once (about five minutes, no cost):
 *   1. Create a Google Sheet. Name it anything.
 *   2. Extensions -> Apps Script. Delete the sample code, paste this file.
 *   3. Set NOTIFY below to your email, or leave it empty for no emails.
 *   4. Deploy -> New deployment -> type "Web app".
 *        Execute as: Me.   Who has access: Anyone.
 *      Authorise when asked. Copy the web app URL.
 *   5. Paste that URL into ENDPOINT in index.html (search for "ENDPOINT").
 *
 * Every later code change needs Deploy -> Manage deployments -> edit ->
 * new version, or the old code keeps running at the same URL.
 */

var SHEET = 'RSVPs';
// Must match KEY in index.html. Not a secret (it is readable in the page),
// but a bare copy of the URL without it is refused.
var RSVP_KEY = 'nugeOJQGeFSMx19k';
var MAX_FIELD = 600;        // characters per field; longer is not a human reply
var MAX_PER_MINUTE = 20;    // across all guests; a burst beyond this is a script
var NOTIFY = 'habubakar89@gmail.com';   // one email per reply

var COLUMNS = [
  'received', 'attending', 'name', 'headcount', 'party', 'days',
  'email', 'whatsapp', 'arrive', 'depart', 'from_city',
  'diet', 'diet_note', 'note', 'know_by', 'page', 'ua'
];

function doPost(e) {
  // The page posts as text/plain (a URL-encoded string) so the browser can
  // read the answer; e.parameter is empty then, so parse the body ourselves.
  var p = {};
  if (e && e.postData && e.postData.contents && String(e.postData.type).indexOf('text/plain') === 0) {
    e.postData.contents.split('&').forEach(function (kv) {
      var i = kv.indexOf('=');
      if (i > 0) p[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1).replace(/\+/g, ' '));
    });
  } else {
    p = (e && e.parameter) || {};
  }
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
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLUMNS);
    sh.setFrozenRows(1);
  }
  var row = COLUMNS.map(function (k) {
    return k === 'received' ? new Date() : (p[k] || '');
  });
  sh.appendRow(row);

  if (NOTIFY) {
    var who = p.name || 'Someone';
    var what = p.attending === 'yes' ? 'is coming (' + (p.headcount || '1') + ')'
      : p.attending === 'maybe' ? 'is not sure yet' : 'can\'t make it';
    MailApp.sendEmail({
      to: NOTIFY,
      subject: 'RSVP: ' + who + ' ' + what,
      body: COLUMNS.map(function (k) { return k + ': ' + (p[k] || ''); }).join('\n')
    });
  }
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
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
