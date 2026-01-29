function initAos() {
  if (!window.AOS || typeof window.AOS.init !== 'function') return;
  window.AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out',
  });
}

// Typing effect for the hero subheading
const typingElement = document.getElementById('typing');
const phrases = [
  'Red Team Engineer',
  'Security Consultant',
  'Startup Founder',
  'Continuous Learner',
];
let phraseIndex = 0;
let letterIndex = 0;
let currentPhrase = '';
let isDeleting = false;

function typeLoop() {
  const fullPhrase = phrases[phraseIndex];
  if (isDeleting) {
    currentPhrase = fullPhrase.substring(0, letterIndex--);
  } else {
    currentPhrase = fullPhrase.substring(0, letterIndex++);
  }
  typingElement.textContent = currentPhrase;
  if (!isDeleting && letterIndex === fullPhrase.length + 1) {
    isDeleting = true;
    setTimeout(typeLoop, 1500); // pause before deleting
    return;
  }
  if (isDeleting && letterIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }
  const typingSpeed = isDeleting ? 60 : 100;
  setTimeout(typeLoop, typingSpeed);
}

// Start typing effect after DOM has loaded
document.addEventListener('DOMContentLoaded', () => {
  initAos();

  if (typingElement) {
    typeLoop();
  }

  // Load the resume timeline after fonts and DOM are ready
  loadTimeline();
});

// Format ISO8601 partial dates (YYYY or YYYY-MM) into human friendly strings
function formatDate(dateStr) {
  if (!dateStr) return 'Present';
  const parts = String(dateStr).split('-');
  const year = parts[0];
  const month = parts[1];
  if (month) {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const m = parseInt(month, 10);
    if (!isNaN(m) && m >= 1 && m <= 12) {
      return `${monthNames[m - 1]} ${year}`;
    }
  }
  return year;
}

function buildDateRange(startDate, endDate) {
  const nbsp = '\u00A0';
  const enDash = '\u2013';
  return `${formatDate(startDate)}${nbsp}${enDash}${nbsp}${formatDate(endDate)}`;
}

function buildTimelineTitle(job) {
  // Match the formatting in index_old.html for Self-employed roles.
  if (job?.name === 'Self-employed' && job.description) {
    return `${job.position}, ${job.description}`;
  }
  return job?.position || '';
}

function buildTimelineLocation(job) {
  // Match the formatting in index_old.html:
  // - Self-employed roles show only the location.
  // - Other roles show "Company, Location".
  if (job?.name === 'Self-employed') return job?.location || '';
  const parts = [];
  if (job?.name) parts.push(job.name);
  if (job?.location) parts.push(job.location);
  return parts.join(', ');
}

function showTimelineLoadError(container) {
  container.innerHTML =
    '<div class="timeline-item"><div class="timeline-content"><p class="location">Unable to load <code>resume.json</code>. If you are opening <code>index.html</code> directly (file://), start a local server so the browser can fetch the JSON.</p></div></div>';
}

// Load resume.json and build the experience timeline
async function loadTimeline() {
  const container = document.getElementById('timeline');
  if (!container) return;

  let resume;
  try {
    const response = await fetch('resume.json');
    if (!response.ok) throw new Error('HTTP error ' + response.status);
    resume = await response.json();
  } catch (err) {
    console.error('Failed to fetch resume.json', err);
    showTimelineLoadError(container);
    return;
  }

  if (!resume?.work || !Array.isArray(resume.work)) return;

  container.innerHTML = '';
  resume.work.forEach((job) => {
    const item = document.createElement('div');
    item.classList.add('timeline-item');

    const dateSpan = document.createElement('span');
    dateSpan.classList.add('timeline-date');
    dateSpan.textContent = buildDateRange(job.startDate, job.endDate);
    item.appendChild(dateSpan);

    const content = document.createElement('div');
    content.classList.add('timeline-content');

    const title = document.createElement('h4');
    title.textContent = buildTimelineTitle(job);
    content.appendChild(title);

    const location = document.createElement('p');
    location.classList.add('location');
    location.textContent = buildTimelineLocation(job);
    content.appendChild(location);

    if (job.highlights && Array.isArray(job.highlights) && job.highlights.length > 0) {
      const list = document.createElement('ul');
      job.highlights.forEach((h) => {
        const li = document.createElement('li');
        li.textContent = h;
        list.appendChild(li);
      });
      content.appendChild(list);
    }

    item.appendChild(content);
    container.appendChild(item);
  });
}
