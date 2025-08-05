document.addEventListener('DOMContentLoaded', function () {
  const formDisplay = document.getElementById('form-display');
  const formContent = formDisplay.querySelector('.form-content');
  const formDots = formDisplay.querySelector('#form-dots');
  const progressSteps = formDisplay.querySelector('#progress-steps');
  const progressFill = formDisplay.querySelector('.progress-fill');

  const formSteps = [
    {
      step: 1,
      question: "Hello! What's your name?",
      fields: [
        { type: 'text', name: 'firstName', label: 'First name', placeholder: 'Enter your first name', required: true },
        { type: 'text', name: 'lastName', label: 'Last name (optional)', placeholder: 'Enter your last name', required: false }
      ]
    },
    {
      step: 2,
      question: "Hi {{name}}! Where would you love to get a place?",
      fields: [
        { type: 'select', name: 'country', label: 'Country', placeholder: 'Select country', options: ['Nigeria', 'Ghana', 'Kenya', 'South Africa'], required: true },
        { type: 'tel', name: 'phone', label: 'Your phone number (optional)', placeholder: 'Enter your phone number', required: false }
      ]
    },
    {
      step: 3,
      question: "Lovely place! Where exactly in Nigeria?",
      fields: [
        { type: 'search', name: 'state', label: 'States (You can add up to 2)', placeholder: 'Search for a state', required: true },
        { type: 'quickpicks', name: 'quickpicks', label: 'QUICK PICKS', options: ['Lagos', 'Abuja', 'Ogun', 'Rivers', 'Cross-River'], required: false }
      ]
    }
  ];

  let currentStep = 0;
  let formData = {};
  let isTransitioning = false;

  // Helper: Animate out, then in, with direction
  function animateStepChange(nextStep, direction) {
    if (isTransitioning) return;
    isTransitioning = true;

    // Animate current content out
    formContent.style.transition = 'transform 0.45s cubic-bezier(.4,1.2,.6,1), opacity 0.35s';
    formContent.style.transform = direction === 'forward' ? 'translateX(-60px)' : 'translateX(60px)';
    formContent.style.opacity = '1';

    setTimeout(() => {
      // Remove content, reset transform, render new step offscreen
      renderStep(nextStep, direction, true);

      // Animate new content in
      requestAnimationFrame(() => {
        formContent.style.transition = 'none';
        formContent.style.transform = direction === 'forward' ? 'translateX(100%)' : 'translateX(-100%)';
        formContent.style.opacity = '1';

        // Force reflow
        void formContent.offsetWidth;

        formContent.style.transition = 'transform 0.45s cubic-bezier(.4,1.2,.6,1), opacity 0.35s';
        formContent.style.transform = 'translateX(0)';
        formContent.style.opacity = '1';

        setTimeout(() => {
          isTransitioning = false;
        }, 450);
      });
    }, 350);
  }

  function renderDots(stepIdx = currentStep) {
    formDots.innerHTML = '';
    for (let i = 0; i < formSteps.length; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === stepIdx ? ' active' : '');
      formDots.appendChild(dot);
    }
  }

  function updateProgressBar(stepIdx = currentStep) {
    const percent = ((stepIdx) / (formSteps.length - 1)) * 100;
    progressFill.style.width = percent + '%';
  }

  function getFirstName() {
    return formData.firstName || '';
  }

  function interpolateQuestion(question) {
    return question.replace('{{name}}', getFirstName() || '');
  }

  function createField(field, value = '') {
    const id = `field-${field.name}`;
    if (field.type === 'text' || field.type === 'tel' || field.type === 'search') {
      return `
        <div class="form-field">
          <label for="${id}">${field.label}</label>
          <input 
            type="${field.type === 'search' ? 'text' : field.type}" 
            id="${id}" 
            name="${field.name}" 
            placeholder="${field.placeholder}" 
            ${field.required ? 'required' : ''} 
            value="${value || ''}"
            autocomplete="off"
          />
        </div>
      `;
    } else if (field.type === 'select') {
      return `
        <div class="form-field">
          <label for="${id}">${field.label}</label>
          <select id="${id}" name="${field.name}" ${field.required ? 'required' : ''}>
            <option value="" disabled ${!value ? 'selected' : ''}>${field.placeholder}</option>
            ${field.options.map(opt => `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        </div>
      `;
    } else if (field.type === 'quickpicks') {
      const currentValues = (formData[field.name] || '').split(',').map(s => s.trim()).filter(Boolean);
      return `
        <div class="form-field">
          <label>${field.label}</label>
          <div class="quickpicks">
            ${field.options.map(opt => `
              <button type="button" class="quickpick-btn ${currentValues.includes(opt) ? 'selected' : ''}" data-value="${opt}">${opt}</button>
            `).join('')}
          </div>
        </div>
      `;
    }
    return '';
  }

  // Accepts optional stepIdx and direction for animation
  function renderStep(stepIdx = currentStep, direction = 'forward', skipAnimation = false) {
    const step = formSteps[stepIdx];
    let html = `<h4>${interpolateQuestion(step.question)}</h4>`;
    html += step.fields.map(field => createField(field, formData[field.name])).join('');
    html += `
      <div class="nav-buttons">
        ${stepIdx > 0 ? '<button type="button" class="btn-back">Back</button>' : ''}
        <button type="button" class="btn-continue">${stepIdx === formSteps.length - 1 ? 'Submit' : 'Continue'}</button>
      </div>
    `;
    formContent.innerHTML = html;
    renderDots(stepIdx);
    updateProgressBar(stepIdx);

    // Set Step ? of ? using progressSteps as innerText
    if (progressSteps) {
      progressSteps.innerText = `Step ${stepIdx + 1} of ${formSteps.length}`;
    }

    // Quickpicks event
    const quickpickBtns = formContent.querySelectorAll('.quickpick-btn');
    quickpickBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const val = btn.getAttribute('data-value');
        const input = formContent.querySelector('input[name="state"]');
        if (input) {
          let current = input.value.split(',').map(s => s.trim()).filter(Boolean);
          
          if (btn.classList.contains('selected')) {
            // Remove if already selected
            current = current.filter(item => item !== val);
            btn.classList.remove('selected');
          } else if (current.length < 2) {
            // Add if not selected and under limit
            current.push(val);
            btn.classList.add('selected');
          }
          
          input.value = current.join(', ');
          formData['state'] = input.value;
        }
      });
    });

    // If skipAnimation, don't animate in (used for step change)
    if (skipAnimation) return;
    // Otherwise, ensure content is visible and reset transform
    formContent.style.transition = 'none';
    formContent.style.transform = 'translateX(0)';
    formContent.style.opacity = '1';
  }

  function collectStepData() {
    const step = formSteps[currentStep];
    step.fields.forEach(field => {
      const el = formContent.querySelector(`[name="${field.name}"]`);
      if (el) {
        formData[field.name] = el.value;
      }
    });
  }

  function handleContinue() {
    if (isTransitioning) return;
    collectStepData();
    if (currentStep < formSteps.length - 1) {
      animateStepChange(currentStep + 1, 'forward');
      currentStep++;
    } else {
      // Final submit
      collectStepData();
      // Animate out before alert
      formContent.style.transition = 'transform 0.45s cubic-bezier(.4,1.2,.6,1), opacity 0.35s';
      formContent.style.transform = 'translateX(-60px)';
      formContent.style.opacity = '0';
      setTimeout(() => {
        alert('Thank you! Your information has been submitted successfully.');
        // Optionally reset
        // currentStep = 0; formData = {}; renderStep();
      }, 350);
    }
  }

  function handleBack() {
    if (isTransitioning) return;
    if (currentStep > 0) {
      animateStepChange(currentStep - 1, 'backward');
      currentStep--;
    }
  }

  function addNavListeners() {
    formContent.addEventListener('click', function (e) {
      if (e.target.classList.contains('btn-continue')) {
        e.preventDefault();
        handleContinue();
      }
      if (e.target.classList.contains('btn-back')) {
        e.preventDefault();
        handleBack();
      }
    });
    // Also update formData on input
    formContent.addEventListener('input', function (e) {
      const target = e.target;
      if (target.name) {
        formData[target.name] = target.value;
      }
    });
  }

  function initForm() {
    renderStep();
    addNavListeners();
    // Ensure initial state
    formContent.style.transition = 'none';
    formContent.style.transform = 'translateX(0)';
    formContent.style.opacity = '1';
  }

  initForm();
});