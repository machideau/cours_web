/**
 * protection.js
 *
 * Module de protection du contenu du site :
 *  - Interdit la sélection/copie de texte (sauf dans les blocs de code via le bouton "Copier")
 *  - Interdit le clic droit (menu contextuel)
 *  - Interdit les raccourcis clavier de copie / inspection / sauvegarde
 *  - Tente de masquer le contenu lors d'une capture d'écran (visibilitychange + blur)
 *  - Interdit le glisser-déposer de contenu
 *  - Masque le contenu à l'impression
 */

/** ──────────────────────────────────────────
 *  1. Désactiver la sélection de texte
 *     Exception : les éléments <code> et <pre>
 * ─────────────────────────────────────────── */
function disableTextSelection() {
  document.addEventListener('selectstart', (e) => {
    if (e.target.closest('pre, code, .copy-code-btn')) return
    e.preventDefault()
  })
}

/** ──────────────────────────────────────────
 *  2. Désactiver le clic droit
 * ─────────────────────────────────────────── */
function disableContextMenu() {
  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('pre, code')) return
    e.preventDefault()
  })
}

/** ──────────────────────────────────────────
 *  3. Désactiver les raccourcis clavier sensibles
 * ─────────────────────────────────────────── */
function disableKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const ctrl = e.ctrlKey || e.metaKey

    // Toujours autoriser dans les champs de saisie
    if (e.target.closest('input, textarea, [contenteditable]')) return

    // Ctrl+C : autoriser seulement si la sélection est dans un pre/code
    if (ctrl && e.key === 'c') {
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0)
        const ancestor =
          range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
            ? range.commonAncestorContainer
            : range.commonAncestorContainer.parentElement
        if (ancestor && ancestor.closest('pre, code')) return
      }
      e.preventDefault()
      return
    }

    if (ctrl) {
      const key = e.key.toLowerCase()
      // a=select all, x=cut, u=view source, s=save, p=print
      if (['a', 'x', 'u', 's', 'p'].includes(key)) {
        e.preventDefault()
        return
      }
    }

    // Ctrl+Shift+I / J / C → DevTools
    if (ctrl && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) {
      e.preventDefault()
      return
    }

    // F12 → DevTools
    if (e.key === 'F12') {
      e.preventDefault()
      return
    }

    // Ctrl+Shift+S → sauvegarde partielle Chrome
    if (ctrl && e.shiftKey && e.key.toLowerCase() === 's') {
      e.preventDefault()
      return
    }
  })
}

/** ──────────────────────────────────────────
 *  4. Désactiver les événements clipboard
 * ─────────────────────────────────────────── */
function disableClipboardEvents() {
  document.addEventListener('copy', (e) => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0)
      const ancestor =
        range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
          ? range.commonAncestorContainer
          : range.commonAncestorContainer.parentElement
      if (ancestor && ancestor.closest('pre, code')) return
    }
    e.preventDefault()
  })

  document.addEventListener('cut', (e) => {
    e.preventDefault()
  })
}

/** ──────────────────────────────────────────
 *  5. Désactiver le glisser-déposer
 * ─────────────────────────────────────────── */
function disableDragAndDrop() {
  document.addEventListener('dragstart', (e) => {
    if (e.target.closest('pre, code')) return
    e.preventDefault()
  })
}

/** ──────────────────────────────────────────
 *  6. Overlay de protection (captures d'écran / perte de focus)
 * ─────────────────────────────────────────── */
function setupScreenshotProtection() {
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

  // Masquer quand la page est cachée (outil de capture, alt+tab, etc.)
  document.addEventListener('visibilitychange', () => {
    document.visibilityState === 'hidden' ? show() : hide()
  })

  // Masquer quand la fenêtre perd le focus
  window.addEventListener('blur', () => {
    setTimeout(() => { if (!document.hasFocus()) show() }, 300)
  })

  window.addEventListener('focus', hide)
}

/** ──────────────────────────────────────────
 *  7. CSS de protection (user-select, print)
 * ─────────────────────────────────────────── */
function injectProtectionCSS() {
  const style = document.createElement('style')
  style.id = 'content-protection-style'
  style.textContent = `
    /* Interdire la sélection sur l'ensemble du site */
    body {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
    }

    /* Autoriser la sélection uniquement dans les blocs de code */
    pre, code, pre *, code * {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
      user-select: text !important;
    }

    /* Masquer le contenu à l'impression */
    @media print {
      body > *:not(#screenshot-protection-overlay) {
        display: none !important;
        visibility: hidden !important;
      }
      #screenshot-protection-overlay {
        display: flex !important;
      }
    }
  `
  document.head.appendChild(style)
}

/** ──────────────────────────────────────────
 *  Point d'entrée
 * ─────────────────────────────────────────── */
export function initProtection() {
  injectProtectionCSS()
  disableTextSelection()
  disableContextMenu()
  disableKeyboardShortcuts()
  disableClipboardEvents()
  disableDragAndDrop()
  setupScreenshotProtection()
}
