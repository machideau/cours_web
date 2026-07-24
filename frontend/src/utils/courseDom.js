import { nextTick } from 'vue'

export function addCopyButtons() {
  nextTick(() => {
    const container = document.querySelector('.course-body')
    if (!container) return

    const preBlocks = container.querySelectorAll('pre')
    preBlocks.forEach((pre) => {
      if (pre.querySelector('.copy-code-btn')) return

      const button = document.createElement('button')
      button.className = 'copy-code-btn'
      button.type = 'button'
      button.innerText = 'Copier'
      button.title = 'Copier le code dans le presse-papiers'

      button.addEventListener('click', async () => {
        const codeElement = pre.querySelector('code')
        const text = codeElement ? codeElement.innerText : pre.innerText

        try {
          await navigator.clipboard.writeText(text.trim())
          button.innerText = 'Copié !'
          button.classList.add('copied')

          setTimeout(() => {
            button.innerText = 'Copier'
            button.classList.remove('copied')
          }, 2000)
        } catch (err) {
          console.error('Failed to copy text: ', err)
        }
      })

      pre.appendChild(button)
    })
  })
}

export function setupScrollSpy(activeTocId) {
  nextTick(() => {
    const headings = document.querySelectorAll('.course-body h2[id]')
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            activeTocId.value = entry.target.id
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )

    headings.forEach(h => observer.observe(h))
  })
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
