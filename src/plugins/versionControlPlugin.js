import { toast } from 'vue3-toastify';

const currentStorageVersion = '1.0.1';
const storedVersion = localStorage.getItem('piniaStorageVersion');

const piniaStoreIds = [
  'characterSelect',
  'lastTab',
  'setting',
  'showRow',
  'showTeam',
  'skill',
  'slider'
];

export default {
  install: () => {
    if (storedVersion !== currentStorageVersion) {
      if (localStorage.getItem('characterSelect') !== null) {
        console.warn('[Version Update Notice] Pinia Storage version updated, will clear Storage data for all Pinia Stores.');

        piniaStoreIds.forEach(storeId => {
          const storageKey = storeId;
          localStorage.removeItem(storageKey);
          sessionStorage.removeItem(storageKey);
          console.warn(`Cleared Storage data for Pinia Store "${storeId}".`);
        });

        localStorage.removeItem('piniaStorageVersion');
        localStorage.setItem('piniaStorageVersion', currentStorageVersion);

        toast("Storage data structure changed, old storage deleted.", {
          "theme": "colored",
          "type": "warning",
          "position": "top-right",
          "autoClose": 6000,
          "dangerouslyHTMLString": true,
          "newestOnTop": true,
          "limit": 1,
          "toastStyle": {
            "backgroundColor": "rgba(22, 21, 24, 0.9)",
            "font-family": "LXGW WenKai Mono TC",
            "color": "rgb(250, 130, 78)"
          },
          "progressStyle": {
            "backgroundColor": "rgb(232, 178, 104)",
          }
        });
      } else { //  <--  第一次訪問 (storedVersion 為 null) 的情況
        console.warn('[Version Control] First visit detected, initializing Pinia Storage version.');
        localStorage.setItem('piniaStorageVersion', currentStorageVersion); //  仍然設定版本號，但跳過清除和 Toast
      }
    }
  }
};