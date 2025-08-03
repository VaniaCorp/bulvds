fetch('/data/faq.json')
  .then(response => response.json())
  .then(faqs => {
    const faqList = document.getElementById('faq-list');
    if (!faqList) return;

    faqList.innerHTML = faqs.map((faq, idx) => {
      const questionId = `faq-question-${faq.id}`;
      const answerId = `faq-answer-${faq.id}`;
      const number = String(idx + 1).padStart(2, '0');
      
      return `
        <div class="faq-item" data-faq-id="${faq.id}">
          <div class="faq-number">${number}</div>
          <div class="faq-content">
            <div
              id="${questionId}"
              class="faq-question"
              aria-expanded="false"
              aria-controls="${answerId}"
            >
              <span class="faq-question-text">${faq.question}</span>
              <div class="faq-toggle-icon">
                <span class="toggle-symbol">
                  <iconify-icon icon="ep:plus" width="24" height="24"></iconify-icon>
                </span>
              </div>
            </div>
            <div
              id="${answerId}"
              class="faq-answer"
              role="region"
              aria-labelledby="${questionId}"
            >
              <p>${faq.answer}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Add expand/collapse functionality with GSAP animations
    faqList.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        const answer = document.getElementById(this.getAttribute('aria-controls'));
        const toggleSymbol = this.querySelector('.toggle-symbol');
        const faqItem = this.closest('.faq-item');
        
        if (!answer) return;

        // Update aria-expanded
        this.setAttribute('aria-expanded', String(!expanded));
        
        // Update toggle icon
        if (toggleSymbol) {
          toggleSymbol.innerHTML = '';
          const icon = document.createElement('iconify-icon');
          icon.setAttribute('inline', '');
          if (expanded) {
            icon.setAttribute('icon', 'ep:plus');
            icon.setAttribute('width', '24');
            icon.setAttribute('height', '24');
          } else {
            icon.setAttribute('icon', 'mdi-light:minus');
            icon.setAttribute('width', '24');
            icon.setAttribute('height', '24');
          }
          toggleSymbol.appendChild(icon);
        }

        if (expanded) {
          // Collapse animation (closing)
          gsap.to(answer, {
            height: 0,
            duration: 0.13,
            ease: "power1.inOut",
            onComplete: () => {
              answer.style.overflow = 'hidden';
            }
          });
          if (toggleSymbol) {
            gsap.to(toggleSymbol, {
              rotation: 0,
              duration: 0.10,
              ease: "power1.inOut"
            });
          }
          if (faqItem) {
            gsap.to(faqItem, {
              scale: 1,
              duration: 0.10,
              ease: "power1.inOut"
            });
          }
        } else {
          // Expand animation (opening) - make it more fluid
          answer.style.overflow = 'hidden';
          answer.style.height = 'auto';
          const height = answer.offsetHeight;
          answer.style.height = '0px';

          // Use a slightly longer duration and a more fluid ease for opening
          gsap.to(answer, {
            height: height,
            duration: 0.20,
            ease: "power1.out",
            onComplete: () => {
              answer.style.height = 'auto';
              answer.style.overflow = 'visible';
            }
          });
          if (toggleSymbol) {
            gsap.to(toggleSymbol, {
              rotation: 45,
              duration: 0.13,
              ease: "power1.out"
            });
          }
          if (faqItem) {
            gsap.to(faqItem, {
              scale: 1.02,
              duration: 0.13,
              ease: "power1.out"
            });
          }
        }
      });
    });
  });
