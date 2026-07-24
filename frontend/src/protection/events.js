export function disableTextSelection() {
  document.addEventListener('selectstart', (e) => {
    if (e.target.closest('pre, code, .copy-code-btn')) return
    e.preventDefault()
  })
}

export function disableContextMenu() {
  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('pre, code')) return
    e.preventDefault()
  })
}

export function disableKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const ctrl = e.ctrlKey || e.metaKey
    if (e.target.closest('input, textarea, [contenteditable]')) return

    if (ctrl && e.key === 'c') {
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0)
        const ancestor = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
          ? range.commonAncestorContainer
          : range.commonAncestorContainer.parentElement
        if (ancestor && ancestor.closest('pre, code')) return
      }
      e.preventDefault()
      return
    }

    if (ctrl && ['a', 'x', 'u', 's', 'p'].includes(e.key.toLowerCase())) {
      e.preventDefault()
      return
    }

    if (ctrl && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) {
      e.preventDefault()
      return
    }

    if (e.key === 'F12' || (ctrl && e.shiftKey && e.key.toLowerCase() === 's')) {
      e.preventDefault()
    }
  })
}

export function disableClipboardEvents() {
  document.addEventListener('copy', (e) => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0)
      const ancestor = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? range.commonAncestorContainer
        : range.commonAncestorContainer.parentElement
      if (ancestor && ancestor.closest('pre, code')) return
    }
    e.preventDefault()
  })
  document.addEventListener('cut', (e) => e.preventDefault())
}

export function disableDragAndDrop() {
  document.addEventListener('dragstart', (e) => {
    if (e.target.closest('pre, code')) return
    e.preventDefault()
  })
}
