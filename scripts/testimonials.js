const content = document.querySelector('#client-stories-display');

function createTestimonialCard(testimonial, idx) {
  // Create the main article element for each testimonial
  const article = document.createElement('article');
  article.className = 'testimonial-card';
  article.id = `testimonial-${idx}`;
  article.setAttribute('tabindex', '0');
  article.setAttribute('role', 'region');
  article.setAttribute('aria-labelledby', `testimonial-title-${idx}`);
  article.setAttribute('aria-describedby', `testimonial-desc-${idx} testimonial-meta-${idx}`);

  // Name and title
  const header = document.createElement('header');
  header.className = 'testimonial-header';

  // Avatar image
  const avatar = document.createElement('img');
  avatar.className = 'testimonial-avatar';
  avatar.src = testimonial.avatar;
  avatar.alt = `${testimonial.name}'s profile picture`;
  avatar.setAttribute('aria-hidden', 'true');

  // User info container
  const userInfo = document.createElement('div');
  userInfo.className = 'testimonial-user-info';

  const name = document.createElement('h5');
  name.className = 'testimonial-name';
  name.id = `testimonial-title-${idx}`;
  name.textContent = testimonial.name;

  const title = document.createElement('span');
  title.className = 'testimonial-user-title';
  title.textContent = `@${testimonial.title}`;

  userInfo.appendChild(name);
  userInfo.appendChild(title);

  // Social media icon
  const socialIcon = document.createElement('div');
  socialIcon.className = 'testimonial-social-icon';
  socialIcon.innerHTML = `<iconify-icon icon="${testimonial.icon}" width="48" height="48"></iconify-icon>`;

  header.appendChild(avatar);
  header.appendChild(userInfo);
  header.appendChild(socialIcon);

  // Description
  const desc = document.createElement('p');
  desc.className = 'testimonial-desc';
  desc.id = `testimonial-desc-${idx}`;
  desc.textContent = testimonial.desc;

  // Meta (date and time)
  const meta = document.createElement('footer');
  meta.className = 'testimonial-meta';
  meta.id = `testimonial-meta-${idx}`;
  meta.setAttribute('aria-label', 'Testimonial date and time');

  const date = document.createElement('time');
  date.className = 'testimonial-date';
  date.setAttribute('datetime', testimonial.date);
  date.textContent = testimonial.date;

  const time = document.createElement('span');
  time.className = 'testimonial-time';
  time.textContent = `• ${testimonial.time}`;

  meta.appendChild(date);
  meta.appendChild(time);

  // Assemble card
  article.appendChild(header);
  article.appendChild(desc);
  article.appendChild(meta);

  return article;
}

function getTestimonials() {
  fetch('/data/client.json')
    .then(res => res.json())
    .then(data => {
      // Clear any existing content
      content.innerHTML = '';

      // Create a list for testimonials for better accessibility
      const list = document.createElement('ul');
      list.className = 'testimonial-list';
      list.id = 'testimonial-list';
      list.setAttribute('role', 'list');
      list.setAttribute('aria-label', 'Client Testimonials');

      // Duplicate testimonials multiple times for seamless infinite scroll effect
      // We need enough duplicates to fill the screen width plus extra for smooth looping
      const duplicatedData = [...data, ...data, ...data, ...data, ...data, ...data];

      duplicatedData.forEach((testimonial, idx) => {
        const listItem = document.createElement('li');
        listItem.className = 'testimonial-list-item';
        listItem.setAttribute('role', 'listitem');
        listItem.appendChild(createTestimonialCard(testimonial, idx));
        list.appendChild(listItem);
      });

      content.appendChild(list);

      // Add event listeners for better animation control
      setupAnimationControls(list);
    })
    .catch(_err => {
      content.innerHTML = '<p role="alert" aria-live="assertive" class="testimonial-error">Unable to load testimonials at this time.</p>';
    });
}

function setupAnimationControls(list) {
  let isHovered = false;
  let animationPaused = false;

  // Pause animation on hover
  list.addEventListener('mouseenter', () => {
    isHovered = true;
    if (!animationPaused) {
      list.style.animationPlayState = 'paused';
    }
  });

  // Resume animation when hover ends
  list.addEventListener('mouseleave', () => {
    isHovered = false;
    if (!animationPaused) {
      list.style.animationPlayState = 'running';
    }
  });

  // Add keyboard controls for accessibility
  list.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      animationPaused = !animationPaused;
      
      if (animationPaused) {
        list.style.animationPlayState = 'paused';
      } else if (!isHovered) {
        list.style.animationPlayState = 'running';
      }
    }
  });

  // Add focus management for better accessibility
  list.addEventListener('focusin', () => {
    if (!animationPaused) {
      list.style.animationPlayState = 'paused';
    }
  });

  list.addEventListener('focusout', () => {
    if (!animationPaused && !isHovered) {
      list.style.animationPlayState = 'running';
    }
  });
}

getTestimonials();