[English](/docs/README.en.md) | [日本語](/docs/README.ja.md) | [繁體中文](/README.md) | [简体中文](/docs/README.zh-CN.md)

# HBR-AxleTool-vue - 緋染天空行動軸編輯器

這是一款專為手機遊戲《[緋染天空 Heaven Burns Red](https://heaven-burns-red.com/)》設計的網頁工具，旨在幫助玩家輕鬆分享戰鬥中的行動軸。

透過視覺化的介面，玩家可以紀錄每個回合的角色技能施放順序，並將最終的行動軸匯出成圖片或透過 URL 分享給朋友。

**[線上體驗 Demo](https://hbr-axletool.pages.dev/)**

![專案預覽圖](/image/preview.png)

## ✨ 主要功能

*   **視覺化行動軸編輯**：透過直覺的拖曳等操作，輕鬆安排每回合的角色行動。
*   **隊伍編成**：支援遊戲中所有部隊及角色，快速建立你的戰鬥隊伍。
*   **行動軸匯出**：可將排好的行動軸匯出成圖片或是 URL，方便保存與分享。

## 📖 使用教學

1.  **隊伍編輯**:
    *    角色選擇介面按照順序依序選擇 隊伍（Team）、角色（Character）、戰型（Style）。
        ![角色選擇](/image/select_char.png)
    *   其他設定（Others）可以設定 突破數（Rank）、耳環（Earring）、被動技能（Passive SKill）和 專武等級（Spiritual Rupture）。
        ![其他](/image/select_char_others.png)
    *   能透過拖曳隨意排序位置。
        ![拖曳](/image/select_char_drag&drop.gif)

2.  **行動軸編輯**:
    *   可以編輯 回合（Turn）、OD、技能選擇（Skill） 和 選擇對象（Target）。
        ![axle](/image/axle.png)
    *   能調換軸順序和透過拖曳隨意排序角色位置。
        ![拖曳](/image/axle.gif)

3.  **分享與匯出**:
    *   點擊網頁右上角的 ![axle icon](/src/assets/custom-icon/table.svg) 可以看到完整的軸。
    *   點進去後會左上會看到 3 個按鈕，分別是 篩選、下載圖片、分享
        *   ![filter](/src/assets/custom-icon/filter-on.svg)**篩選**: 自由選擇需要顯示的部分。
        *   ![share](/src/assets/custom-icon/share.svg)**分享**: 會產生一組包含目前隊伍和行動軸配置的連結，其他人打開連結即可看到你的軸，連結有效期限為7天。
        *   ![download](/src/assets/custom-icon/download.svg)**下載圖片**: 將整個行動軸輸出成一張圖片，方便你在社群或與朋友討論。

4.  **圖片上傳**
    透過網頁右上角![upload](/src/assets/custom-icon/upload.svg)可以上傳圖片並載入資料。
    ![upload](/image/upload.gif)

5.  **其他功能**:
    *   ![setting](/src/assets/custom-icon/setting.svg)**設定**: 在設定選單中，你可以調整技能語言。
        *   繁體中文
        *   日本語
        *   簡體中文(國際服)
        *   簡體中文(B服)
    * ![refresh skill options](/src/assets/custom-icon/update.svg)**技能選項刷新**: 技能選項是在角色選擇的當下設定好的，如果未來有新技能，可以選擇使用該按鈕，他會自動更新目前選擇隊伍的所有角色技能選項。

## 🛠️ 主要開發框架&套件 

| 類別 | 工具 |
| :--- | :--- |
| **核心框架** | [Vue 3](https://vuejs.org/) |
| **建置工具** | [Vite](https://vitejs.dev/) |
| **狀態管理** | [Pinia](https://pinia.vuejs.org/) |

## 🚀 本機開發

如果你想在本地端運行或進行二次開發，請遵循以下步驟。

### **環境準備**

-   確認已安裝 [Node.js](https://nodejs.org/) (建議版本 18.x 或以上)
-   推薦使用 [VSCode](https://code.visualstudio.com/) 作為開發工具，並安裝 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 擴充功能。

### **專案腳本**

| 指令 | 描述 |
| :--- | :--- |
| `npm install` | 安裝專案所有依賴。 |
| `npm run dev` | 啟動本地開發伺服器，支援熱重載。 |
| `npm run build` | 將專案打包至 `dist` 資料夾，並壓縮 JSON 檔案。 |
| `npm run preview` | 預覽打包後的成果。 |
| `npm run format` | 使用 Prettier 格式化所有程式碼。 |
| `npm run lint` | 使用 ESLint 檢查並修正程式碼風格問題。 |

## 💡 未來開發計畫

我們計畫開發一款搭配本網站使用的桌面端輔助工具，它將具備以下核心功能：

-   **即時戰鬥記錄**：透過電腦視覺技術，工具能夠在玩家進行遊戲時，即時辨識畫面中的角色、使用的技能與回合數。
-   **生成行動軸**：能上傳數據至本網站生成軸，並進行後續的編輯、分享。

這個功能的目標是將手動記錄的流程完全自動化，讓玩家可以更專注於戰鬥本身。敬請期待！

## 🤝 貢獻與協助

本專案目前非常歡迎社群的貢獻，特別是針對遊戲內資料的翻譯與校對。

### **誠徵：簡體中文 (B服) 翻譯夥伴**

由於開發者主要使用繁體中文，對於 Bilibili 伺服器的部分遊戲術語、技能名稱翻譯可能不夠精確或即時。如果你熟悉《緋染天空》B服的用語，並願意協助維護簡體中文的翻譯資料，歡迎透過以下方式聯繫我。

### **歡迎其他語言的貢獻者**

除了 B 服的簡體中文外，我們也誠摯地歡迎任何能夠提供**其他語言**（如英文、韓文等）翻譯的貢獻者。如果你希望能讓這個工具支援更多語言，幫助到更多不同地區的玩家，請不要猶豫，透過以下方式與我們聯繫！

**聯絡方式：**

-   **GitHub Issues**: 直接在本專案的 [Issues](https://github.com/FuseFairy/HBR-AxleTool-vue/issues) 中開啟一個新的 issue 說明你的來意。
-   **Email**: [dd8611706@gmail.com](mailto:dd8611706@gmail.com)

非常感謝你的熱情與支持！