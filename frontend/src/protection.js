import {
  disableTextSelection,
  disableContextMenu,
  disableKeyboardShortcuts,
  disableClipboardEvents,
  disableDragAndDrop
} from './protection/events.js'
import { setupScreenshotProtection } from './protection/overlay.js'
import { injectProtectionCSS } from './protection/style.js'

export function initProtection() {
  injectProtectionCSS()
  disableTextSelection()
  disableContextMenu()
  disableKeyboardShortcuts()
  disableClipboardEvents()
  disableDragAndDrop()
  setupScreenshotProtection()
}
