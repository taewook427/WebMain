// Widget Generator
(function () {
  'use strict';

  // Serving file URL
  const DEFAULT_SCRIPT_URL = window.location.origin.includes('localhost')
    ? `${window.location.origin}/ghstat.js`
    : 'https://taewook427.github.io/WebMain/GithubStats/ghstat.js';
  const DEFAULT_EMBED_URL = window.location.origin.includes('localhost')
    ? `${window.location.origin}/embed.html`
    : 'https://taewook427.github.io/WebMain/GithubStats/embed.html';

  const inputUsername = document.getElementById('inputUsername');
  const selectLayout = document.getElementById('selectLayout');
  const selectTheme = document.getElementById('selectTheme');
  const selectLimit = document.getElementById('selectLimit');
  const inputExclude = document.getElementById('inputExclude');
  const inputTitle = document.getElementById('inputTitle');

  const liveWidget = document.getElementById('liveWidget');
  const codeWebComponent = document.getElementById('codeWebComponent');
  const codeIframe = document.getElementById('codeIframe');
  const btnGenerate = document.getElementById('btnGenerate');
  const btnCopyWebComponent = document.getElementById('btnCopyWebComponent');
  const btnCopyIframe = document.getElementById('btnCopyIframe');

  // Generate code
  function update() {
    const rawUser = inputUsername.value.trim();
    const user = window.GithubLangs ? window.GithubLangs.extractUsername(rawUser) : rawUser;
    const layout = selectLayout.value;
    const theme = selectTheme.value;
    const limit = selectLimit.value;
    const exclude = inputExclude.value.trim();
    const title = inputTitle.value.trim();

    // Update live widget
    if (liveWidget) {
      if (user) liveWidget.setAttribute('username', user);
      liveWidget.setAttribute('layout', layout);
      liveWidget.setAttribute('theme', theme);
      liveWidget.setAttribute('limit', limit);
      if (exclude) liveWidget.setAttribute('exclude', exclude);
      else liveWidget.removeAttribute('exclude');
      if (title) liveWidget.setAttribute('title', title);
      else liveWidget.removeAttribute('title');
    }

    // Generate HTML snippet
    let webCompCode = `<!-- GitHub Language Stats -->\n`;
    webCompCode += `<script src="${DEFAULT_SCRIPT_URL}" defer></script>\n`;
    webCompCode += `<github-langs\n`;
    webCompCode += `  username="${escapeAttr(user || 'octocat')}"\n`;
    webCompCode += `  theme="${escapeAttr(theme)}"\n`;
    webCompCode += `  layout="${escapeAttr(layout)}"\n`;
    webCompCode += `  limit="${escapeAttr(limit)}"`;
    if (exclude) webCompCode += `\n  exclude="${escapeAttr(exclude)}"`;
    if (title) webCompCode += `\n  title="${escapeAttr(title)}"`;
    webCompCode += `\n></github-langs>`;
    codeWebComponent.textContent = webCompCode;

    // Generate embed link
    const params = new URLSearchParams();
    params.set('username', user || 'octocat');
    params.set('theme', theme);
    params.set('layout', layout);
    params.set('limit', limit);
    if (exclude) params.set('exclude', exclude);
    if (title) params.set('title', title);
    const embedFullUrl = `${DEFAULT_EMBED_URL}?${params.toString()}`;
    codeIframe.textContent = `<iframe src="${escapeAttr(embedFullUrl)}" width="100%" height="180" frameborder="0" scrolling="no"></iframe>`;
  }

  // HTML attribute escape
  function escapeAttr(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Copy button feedback
  function setupCopyButton(button, targetElement) {
    button.addEventListener('click', () => {
      navigator.clipboard.writeText(targetElement.textContent).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Clipboard Copied';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      });
    });
  }

  // Event listeners
  btnGenerate.addEventListener('click', update);
  setupCopyButton(btnCopyWebComponent, codeWebComponent);
  setupCopyButton(btnCopyIframe, codeIframe);

  // Initial update
  update();
})();