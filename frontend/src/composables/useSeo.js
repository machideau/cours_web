import { onMounted } from 'vue'

export function setMeta({ title, description, url }) {
  document.title = title
  const setTag = (sel, attr, val) => {
    const el = document.querySelector(sel)
    if (el) el.setAttribute(attr, val)
  }
  setTag('meta[name="description"]', 'content', description)
  setTag('meta[property="og:title"]', 'content', title)
  setTag('meta[property="og:description"]', 'content', description)
  setTag('meta[property="og:url"]', 'content', url)
  setTag('meta[name="twitter:title"]', 'content', title)
  setTag('meta[name="twitter:description"]', 'content', description)
  setTag('link[rel="canonical"]', 'href', url)
}

export function useSeo(meta) {
  onMounted(() => {
    setMeta(meta)
  })
}
