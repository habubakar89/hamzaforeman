import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { NightSkyOverlay } from '../NightSkyOverlay';

describe('NightSkyOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.className = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    document.body.className = '';
  });

  it('mounts portal when visible is true', () => {
    render(<NightSkyOverlay visible={true} />);
    
    const portal = document.querySelector('[data-portal-overlay="night-sky"]');
    expect(portal).toBeTruthy();
  });

  it('adds night-sky-active class to body when mounted', () => {
    render(<NightSkyOverlay visible={true} />);
    
    expect(document.body.classList.contains('night-sky-active')).toBe(true);
  });

  it('removes overlay and body class after duration on desktop', async () => {
    const onAutoDismiss = vi.fn();
    render(<NightSkyOverlay visible={true} onAutoDismiss={onAutoDismiss} />);
    
    expect(document.body.classList.contains('night-sky-active')).toBe(true);
    
    // Advance past desktop duration (3800ms)
    vi.advanceTimersByTime(3800);
    
    await waitFor(() => {
      expect(document.body.classList.contains('night-sky-active')).toBe(false);
      expect(onAutoDismiss).toHaveBeenCalled();
    });
  });

  it('calls onAutoDismiss when failsafe timer fires', async () => {
    const onAutoDismiss = vi.fn();
    render(<NightSkyOverlay visible={true} onAutoDismiss={onAutoDismiss} />);
    
    // Advance past failsafe (5000ms)
    vi.advanceTimersByTime(5000);
    
    await waitFor(() => {
      expect(onAutoDismiss).toHaveBeenCalled();
      expect(document.body.classList.contains('night-sky-active')).toBe(false);
    });
  });

  it('removes overlay on Escape key', async () => {
    const onAutoDismiss = vi.fn();
    render(<NightSkyOverlay visible={true} onAutoDismiss={onAutoDismiss} />);
    
    // Wait for mount
    await waitFor(() => {
      expect(document.querySelector('[data-portal-overlay="night-sky"]')).toBeTruthy();
    });
    
    // Simulate Escape key
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(escapeEvent);
    
    await waitFor(() => {
      expect(onAutoDismiss).toHaveBeenCalled();
      expect(document.body.classList.contains('night-sky-active')).toBe(false);
    });
  });

  it('removes overlay on scroll', async () => {
    const onAutoDismiss = vi.fn();
    render(<NightSkyOverlay visible={true} onAutoDismiss={onAutoDismiss} />);
    
    await waitFor(() => {
      expect(document.querySelector('[data-portal-overlay="night-sky"]')).toBeTruthy();
    });
    
    // Simulate scroll
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
    
    await waitFor(() => {
      expect(onAutoDismiss).toHaveBeenCalled();
      expect(document.body.classList.contains('night-sky-active')).toBe(false);
    });
  });

  it('removes overlay on visibility hidden', async () => {
    const onAutoDismiss = vi.fn();
    render(<NightSkyOverlay visible={true} onAutoDismiss={onAutoDismiss} />);
    
    await waitFor(() => {
      expect(document.querySelector('[data-portal-overlay="night-sky"]')).toBeTruthy();
    });
    
    // Mock document.hidden
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => true,
    });
    
    const visibilityEvent = new Event('visibilitychange');
    document.dispatchEvent(visibilityEvent);
    
    await waitFor(() => {
      expect(onAutoDismiss).toHaveBeenCalled();
      expect(document.body.classList.contains('night-sky-active')).toBe(false);
    });
  });

  it('unmounts when visible changes to false', async () => {
    const { rerender } = render(<NightSkyOverlay visible={true} />);
    
    expect(document.body.classList.contains('night-sky-active')).toBe(true);
    
    rerender(<NightSkyOverlay visible={false} />);
    
    await waitFor(() => {
      expect(document.body.classList.contains('night-sky-active')).toBe(false);
      expect(document.querySelector('[data-portal-overlay="night-sky"]')).toBeFalsy();
    });
  });

  it('forces fresh mount when revealKey changes', async () => {
    const { rerender } = render(<NightSkyOverlay visible={true} revealKey={1} />);
    
    expect(document.querySelector('[data-portal-overlay="night-sky"]')).toBeTruthy();
    
    // Change key - should trigger new mount
    rerender(<NightSkyOverlay visible={true} revealKey={2} />);
    
    await waitFor(() => {
      expect(document.querySelector('[data-portal-overlay="night-sky"]')).toBeTruthy();
    });
  });

  it('clears timers on unmount', () => {
    const { unmount } = render(<NightSkyOverlay visible={true} />);
    
    unmount();
    
    expect(document.body.classList.contains('night-sky-active')).toBe(false);
  });
});
