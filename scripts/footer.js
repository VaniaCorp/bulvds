fetch('/data/footer.json')
  .then(res => res.json())
  .then(data => {
    const linksContainer = document.getElementById('links-container');
    const legalContainer = document.getElementById('legal');
    const socialsContainer = document.getElementById('socials');
    if (!linksContainer) return;

    // Helper to create a section
    function createSection(title, links) {
      const section = document.createElement('section');
      if (title) {
        const h4 = document.createElement('h4');
        h4.textContent = title;
        section.appendChild(h4);
      }
      if (Array.isArray(links)) {
        const ul = document.createElement('ul');
        links.forEach(link => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.textContent = link.label;
          a.href = link.href;
          li.appendChild(a);
          ul.appendChild(li);
        });
        section.appendChild(ul);
      }
      return section;
    }

    // Company
    if (data.company) {
      const companySection = createSection(data.company.title, data.company.links);
      linksContainer.appendChild(companySection);
    }

    // Why Bulvds
    if (data.why) {
      const whySection = createSection(data.why.title, data.why.links);
      linksContainer.appendChild(whySection);
    }

    // Contact
    if (data.contact) {
      const contactSection = document.createElement('section');
      const h4 = document.createElement('h4');
      h4.textContent = data.contact.title || 'Contact';
      contactSection.appendChild(h4);

      if (data.contact.phone) {
        const pPhone = document.createElement('p');
        pPhone.innerHTML = `<a href="tel:${data.contact.phone.replace(/\s+/g, '')}">${data.contact.phone}</a>`;
        contactSection.appendChild(pPhone);
      }
      if (data.contact.email) {
        const pEmail = document.createElement('p');
        pEmail.innerHTML = `<a href="mailto:${data.contact.email}">${data.contact.email}</a>`;
        contactSection.appendChild(pEmail);
      }
      linksContainer.appendChild(contactSection);
    }

    // Legal
    if (legalContainer && data.legal && Array.isArray(data.legal.links)) {
      legalContainer.innerHTML = ''; // Clear any existing content
      data.legal.links.forEach(link => {
        const a = document.createElement('a');
        a.textContent = link.label;
        a.href = link.href;
        a.style.marginRight = '1.5em';
        legalContainer.appendChild(a);
      });
    }

    // Socials
    if (socialsContainer && Array.isArray(data.social)) {
      socialsContainer.innerHTML = ''; // Clear any existing content
      data.social.forEach(social => {
        const a = document.createElement('a');
        a.href = social.href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        // Use iconify for icons if available, fallback to text
        if (social.icon) {
          const span = document.createElement('iconify-icon');
          span.className = 'iconify';
          span.setAttribute('data-icon', social.icon);
          span.setAttribute('icon', social.icon);
          span.setAttribute('data-inline', 'false');
          span.style.fontSize = '1.5em';
          a.appendChild(span);
        } else {
          a.textContent = social.label || '';
        }
        a.style.marginRight = '1em';
        socialsContainer.appendChild(a);
      });
    }
  });
