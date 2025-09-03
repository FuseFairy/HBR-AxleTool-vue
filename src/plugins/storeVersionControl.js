import { toast } from 'vue3-toastify'

const currentStorageVersion = '1.0.5'
const storedVersion = localStorage.getItem('piniaStorageVersion')

// Define a map for version-specific update handlers
const versionUpdateHandlers = {
  '1.0.5': () => {
    const storeIdsToClear = ['lastTab', 'showRow', 'slider', 'scrollbar', 'showTeam', 'sidebar']
    storeIdsToClear.forEach((storeId) => {
      const storageKey = storeId
      localStorage.removeItem(storageKey)
      sessionStorage.removeItem(storageKey)
      console.warn(`Cleared Storage data for Pinia Store "${storeId}" during version 1.0.5 update.`)
    })
  },
}

export default {
  install: () => {
    if (storedVersion !== currentStorageVersion) {
      console.warn('[Version Update Notice] Pinia Storage version updated.')

      // Get all versions that need to be updated, in order
      const versionsToUpdate = Object.keys(versionUpdateHandlers)
        .filter((version) => {
          if (storedVersion === null) return false
          version > storedVersion && version <= currentStorageVersion
        })
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))

      if (versionsToUpdate.length > 0) {
        versionsToUpdate.forEach((version) => {
          const handler = versionUpdateHandlers[version]
          if (handler) {
            console.warn(`Executing update handler for version ${version}.`)
            handler() // Execute the specific update logic for this version
          }
        })

        localStorage.setItem('piniaStorageVersion', currentStorageVersion)

        toast('Storage data structure changed, old storage deleted.', {
          theme: 'colored',
          type: 'warning',
          position: 'top-right',
          autoClose: 6000,
          dangerouslyHTMLString: true,
          newestOnTop: true,
          limit: 1,
          toastStyle: {
            'backgroundColor': 'rgba(22, 21, 24, 0.9)',
            'font-family': 'LXGW WenKai Mono TC',
            'color': 'rgb(250, 130, 78)',
          },
          progressStyle: {
            backgroundColor: 'rgb(232, 178, 104)',
          },
        })
      } else {
        // If no specific updates for versions, but storedVersion is older, just update the version number
        localStorage.setItem('piniaStorageVersion', currentStorageVersion)
      }
    } else if (!storedVersion) {
      console.warn('[Version Control] First visit detected, initializing Pinia Storage version.')
      localStorage.setItem('piniaStorageVersion', currentStorageVersion)
    }
  },
}
