/*
  fingerprint.js
  States: idle → scanning → revealed. Tap the scanner: pulsing rings +
  a sweeping scan line play for ~1.2s (pure CSS animation, this file only
  toggles classes and a status message), then the event-info card reveals.
  A reset action returns to idle so the interaction can replay.
*/

const SCAN_DURATION_MS = 1200;

export function initFingerprint() {
  const scanner = document.getElementById('fpScanner');
  const card = document.getElementById('fpCard');
  const status = document.getElementById('fpStatus');
  const resetBtn = document.getElementById('fpReset');
  if (!scanner || !card || !status || !resetBtn) return;

  const HINT_IDLE = 'لمس کن برای شروع';
  const HINT_SCANNING = 'در حال شناسایی...';
  const HINT_DONE = 'تأیید شد';

  let busy = false;

  function startScan() {
    if (busy || scanner.classList.contains('is-revealed')) return;
    busy = true;
    scanner.classList.add('is-scanning');
    status.textContent = HINT_SCANNING;

    setTimeout(() => {
      scanner.classList.remove('is-scanning');
      scanner.classList.add('is-revealed');
      card.classList.add('is-shown');
      status.textContent = HINT_DONE;
      resetBtn.classList.add('is-visible');
      busy = false;
    }, SCAN_DURATION_MS);
  }

  function reset() {
    scanner.classList.remove('is-revealed');
    card.classList.remove('is-shown');
    resetBtn.classList.remove('is-visible');
    status.textContent = HINT_IDLE;
  }

  scanner.addEventListener('click', startScan);
  resetBtn.addEventListener('click', reset);
}
