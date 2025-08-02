// --- Time Display (DD-MM-YYYY, DD-Time{HH:MM}) ---
function updateTimeDisplay() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const dateStr = `${day}-${month}-${year}`;
  const timeStr = `${day}-Time{${hours}:${minutes}}`;

  const timeDisplayEls = document.querySelectorAll('.kiva-time-display');
  timeDisplayEls.forEach(el => {
    el.textContent = `${dateStr}, ${timeStr}`;
  });
}

// --- Year Display ---
function updateYearDisplay() {
  const year = new Date().getFullYear();
  const yearEls = document.querySelectorAll('.kiva-year-display');
  yearEls.forEach(el => {
    el.textContent = year;
  });
}

// --- Date Display (DD-MM-YYYY) ---
function updateDateDisplay() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const dateStr = `${day}-${month}-${year}`;

  const dateEls = document.querySelectorAll('.kiva-date-display');
  dateEls.forEach(el => {
    el.textContent = dateStr;
  });
}

// --- Core Functionality Initialization ---
function kivaInit() {
  updateTimeDisplay();
  updateYearDisplay();
  updateDateDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
  kivaInit();
  setInterval(updateTimeDisplay, 1000 * 30);
});
