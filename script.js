// Initialise scroll animations
AOS.init({
  duration: 800,
  once: true,
  easing: 'ease-in-out',
});

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
  if (typingElement) {
    typeLoop();
  }

  // Load the resume timeline after fonts and DOM are ready
  loadTimeline();
});

// Format ISO8601 partial dates (YYYY or YYYY-MM) into human friendly strings
function formatDate(dateStr) {
  if (!dateStr) return 'Present';
  const parts = dateStr.split('-');
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

// Load resume.json and build the experience timeline
async function loadTimeline() {
  try {
    const response = await fetch('resume.json');
    if (!response.ok) throw new Error('HTTP error ' + response.status);
    const resume = await response.json();
    const container = document.getElementById('timeline');
    if (!container || !resume.work) return;
    // Clear any existing items
    container.innerHTML = '';
    resume.work.forEach((job) => {
      const item = document.createElement('div');
      item.classList.add('timeline-item');
      // Date range
      const dateSpan = document.createElement('span');
      dateSpan.classList.add('timeline-date');
      dateSpan.textContent = `${formatDate(job.startDate)} – ${formatDate(job.endDate)}`;
      item.appendChild(dateSpan);
      // Content container
      const content = document.createElement('div');
      content.classList.add('timeline-content');
      const title = document.createElement('h4');
      title.textContent = job.position;
      content.appendChild(title);
      const location = document.createElement('p');
      location.classList.add('location');
      let nameLocation = job.name;
      if (job.location) {
        nameLocation += `, ${job.location}`;
      }
      location.textContent = nameLocation;
      content.appendChild(location);
      if (job.highlights && job.highlights.length > 0) {
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
  } catch (err) {
    console.error('Failed to load timeline data', err);
  }
}