// src/scripts/chatbot.js
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('chatbot-root');
  const toggle = document.getElementById('chatbot-toggle');
  const panel = document.getElementById('chatbot-panel');
  const closeBtn = document.getElementById('chatbot-close');
  const log = document.getElementById('chatbot-log');
  const optionsContainer = document.getElementById('chatbot-options');
  const treeScript = document.getElementById('chatbot-tree');

  if (!root || !toggle || !panel || !closeBtn || !log || !optionsContainer || !treeScript) return;

  const tree = JSON.parse(treeScript.textContent || '{}');
  const homeUrl = root.dataset.homeUrl || '/';
  let hasStarted = false;

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function addMessage(text) {
    const bubble = document.createElement('p');
    bubble.className = 'rounded-lg bg-(--navy) px-3 py-2 text-slate-200';
    bubble.textContent = text;
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
  }

  function renderOptions(options) {
    optionsContainer.innerHTML = '';
    options.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = option.label;
      button.className = 'text-left text-sm font-medium text-teal-400 border border-teal-400 rounded-full px-4 py-2 hover:scale-[1.02] focus-visible:scale-[1.02] transition-transform duration-200';
      button.addEventListener('click', () => handleOption(option));
      optionsContainer.appendChild(button);
    });
    optionsContainer.querySelector('button')?.focus();
  }

  function getFocusable() {
    return Array.from(
      panel.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !el.hidden && el.offsetParent !== null);
  }

  function trapFocus(event) {
    if (event.key !== 'Tab' || panel.hidden) return;
    const focusable = getFocusable();
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (!panel.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
    }
  }

  function goToNode(nodeId) {
    const node = tree[nodeId];
    if (!node) return;
    addMessage(node.message);
    renderOptions(node.options);
  }

  function handleOption(option) {
    if (option.next) {
      goToNode(option.next);
      return;
    }
    if (!option.action) return;

    switch (option.action.type) {
      case 'restart':
        log.innerHTML = '';
        goToNode('start');
        break;
      case 'scroll': {
        const anchor = option.action.target;
        if (!anchor) return;
        const target = document.querySelector(anchor);
        closePanel();
        if (target) {
          target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        } else {
          window.location.href = `${homeUrl}${anchor}`;
        }
        break;
      }
      case 'link': {
        const target = option.action.target;
        if (!target) return;
        if (target.startsWith('/') || target.startsWith('mailto:')) {
          window.location.href = target;
        } else {
          window.open(target, '_blank', 'noopener,noreferrer');
        }
        break;
      }
    }
  }

  function openPanel() {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    if (!hasStarted) {
      hasStarted = true;
      goToNode('start');
    }
    panel.querySelector('button')?.focus();
  }

  function closePanel(returnFocus = true) {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    if (panel.hidden) {
      openPanel();
    } else {
      closePanel();
    }
  });

  closeBtn.addEventListener('click', closePanel);

  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
      closePanel();
      return;
    }
    trapFocus(event);
  });

  document.addEventListener('click', (event) => {
    if (panel.hidden) return;
    if (event.composedPath().includes(root)) return;
    closePanel(false);
  });
});
