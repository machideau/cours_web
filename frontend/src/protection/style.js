export function injectProtectionCSS() {
  const style = document.createElement('style')
  style.id = 'content-protection-style'
  style.textContent = `
    body {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
    }

    pre, code, pre *, code * {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
      user-select: text !important;
    }

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
