import { toast } from 'vue3-toastify'
import { compareVersions } from '@/utils/compareVersions'

const currentStorageVersion = '1.0.5'
const storedVersion = localStorage.getItem('piniaStorageVersion')

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
    if (storedVersion && storedVersion !== currentStorageVersion) {
      console.warn('[Version Update Notice] Pinia Storage version updated.')

      const versionsToUpdate = Object.keys(versionUpdateHandlers)
        .filter((version) => {
          const isNewer = compareVersions(version, storedVersion) > 0
          const isNotFuture = compareVersions(version, currentStorageVersion) <= 0
          return isNewer && isNotFuture
        })
        .sort((a, b) => compareVersions(a, b))

      if (versionsToUpdate.length > 0) {
        versionsToUpdate.forEach((version) => {
          const handler = versionUpdateHandlers[version]
          if (handler) {
            console.warn(`Executing update handler for version ${version}.`)
            handler()
          }
        })

        localStorage.setItem('piniaStorageVersion', currentStorageVersion)

        toast('Data version update.', {
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
        localStorage.setItem('piniaStorageVersion', currentStorageVersion)
      }
    } else if (!storedVersion) {
      console.warn('[Version Control] First visit detected, initializing Pinia Storage version.')
      localStorage.setItem('piniaStorageVersion', currentStorageVersion)
    }
  },
}
