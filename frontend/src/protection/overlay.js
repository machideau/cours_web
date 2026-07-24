export function setupScreenshotProtection() {
  const overlay = document.createElement('div')
  overlay.id = 'screenshot-protection-overlay'
  overlay.setAttribute('aria-hidden', 'true')
  overlay.style.cssText = [
    'display:none',
    'position:fixed',
    'inset:0',
    'z-index:999999',
    'background:#0a0a0a',
    'align-items:center',
    'justify-content:center',
    'flex-direction:column',
    'gap:1rem',
    'color:#fff',
    'font-family:system-ui,sans-serif',
    'text-align:center',
    'padding:2rem',
    'user-select:none',
    'pointer-events:all',
  ].join(';')

  overlay.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="1.5"
      stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
    <h2 style="margin:0;font-size:1.5rem;font-weight:700;">Contenu protégé</h2>
    <p style="margin:0;opacity:.7;max-width:400px;line-height:1.6;">
      Ce cours est protégé contre la reproduction non autorisée.<br>
      Revenez sur la page pour continuer votre lecture.
    </p>
  `
  document.body.appendChild(overlay)

  const show = () => { overlay.style.display = 'flex' }
  const hide = () => { overlay.style.display = 'none' }

  document.addEventListener('visibilitychange', () => {
    document.visibilityState === 'hidden' ? show() : hide()
  })

  window.addEventListener('blur', () => {
    setTimeout(() => { if (!document.hasFocus()) show() }, 300)
  })

  window.addEventListener('focus', hide)
}
