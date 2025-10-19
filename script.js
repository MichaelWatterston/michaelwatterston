// Update footer year automatically
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Copy-to-clipboard for contact
const copyBtn = document.getElementById('copy-email');
const copyStatus = document.getElementById('copy-status');

if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const email = copyBtn.getAttribute('data-email');
    try {
      await navigator.clipboard.writeText(email);
      if (copyStatus) {
        copyStatus.setAttribute('aria-hidden', 'false');
        setTimeout(() => copyStatus.setAttribute('aria-hidden', 'true'), 1500);
      }
    } catch (e) {
      // Fallback if clipboard API not available
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
      if (copyStatus) {
        copyStatus.setAttribute('aria-hidden', 'false');
        setTimeout(() => copyStatus.setAttribute('aria-hidden', 'true'), 1500);
      }
    }
  });
}

// Portfolio in progress modal for index project links
(() => {
  const modal = document.getElementById('portfolio-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!modal) return; // Only on index

  const showModal = () => {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    // Auto close after 1500ms
    if (showModal._to) clearTimeout(showModal._to);
    showModal._to = setTimeout(hideModal, 5000);
  };
  const hideModal = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  };

  // Intercept clicks on home grid project links
  const projectLinks = document.querySelectorAll('.stagger-grid .project-link');
  projectLinks.forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      showModal();
    });
  });

  // Close button and overlay click
  if (closeBtn) closeBtn.addEventListener('click', hideModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });
})();

// Click on .email: copy to clipboard and temporarily show "Email Copied"
const emailBlocks = document.querySelectorAll('.email');
if (emailBlocks.length) {
  emailBlocks.forEach((block) => {
    block.style.cursor = 'pointer';
    block.addEventListener('click', async () => {
      const p = block.querySelector('p');
      const originalText = p ? p.textContent : '';
      const email = (block.getAttribute('data-email') || (originalText || '').trim());

      // Copy to clipboard (with fallback)
      const copyFallback = () => {
        const ta = document.createElement('textarea');
        ta.value = email;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch {}
        document.body.removeChild(ta);
      };

      try {
        await navigator.clipboard.writeText(email);
      } catch (e) {
        copyFallback();
      }

      // Swap text to confirmation, then revert after 2s
      if (p) {
        // Clear any previous revert timers
        if (block.__revertTO) clearTimeout(block.__revertTO);
        p.textContent = 'Email Copied';
        block.__revertTO = setTimeout(() => {
          p.textContent = originalText || email;
          block.__revertTO = null;
        }, 2000);
      }
    });
  });
}
