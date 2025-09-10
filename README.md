[English](/docs/README.en.md) | [日本語](/docs/README.ja.md) | [繁體中文](/README.md) | [简体中文](/docs/README.zh-CN.md)

# HBR-AxleTool-vue - 緋染天空行動軸編輯器

這是一款專為手機遊戲《[緋染天空 Heaven Burns Red](https://heaven-burns-red.com/)》設計的網頁工具，幫助玩家輕鬆分享戰鬥中的行動軸。

透過視覺化的介面，玩家可以紀錄每個回合的角色技能施放順序，並將最終的行動軸匯出成圖片或透過 URL 分享給朋友。

![專案預覽圖](/image/preview.png)

## ✨ 主要功能

- **視覺化行動軸編輯**：透過直覺的拖曳等操作，輕鬆安排每回合的角色行動。
- **隊伍編成**：支援遊戲中所有部隊及角色，快速建立你的戰鬥隊伍。
- **行動軸匯出**：可將排好的行動軸匯出成圖片或是 URL，方便保存與分享。

## 📖 使用教學

<details>
<summary>點擊展開使用教學</summary>

1.  **隊伍編輯**:
    - 角色選擇介面按照順序依序選擇 隊伍（Team）、角色（Character）、戰型（Style）。
      ![角色選擇](/image/select_char.png)
    - 能透過拖曳隨意排序位置。
      ![拖曳](/image/select_char_drag&drop.gif)

2.  **行動軸編輯**:
    - 可以編輯 回合（Turn）、OD、技能選擇（Skill） 和 選擇對象（Target）。
      ![axle](/image/axle.png)
    - 能調換軸順序和透過拖曳隨意排序角色位置。
      ![拖曳](/image/axle.gif)

3.  **分享與匯出**:
    - 點擊網頁右上角的 ![axle icon](/src/assets/custom-icon/table.svg) 可以看到完整的軸。
    - 點進去後會左上會看到 3 個按鈕，分別是 篩選、下載圖片、分享
      - ![filter](/src/assets/custom-icon/filter-on.svg)**篩選**: 自由選擇需要顯示的部分。
      - ![share](/src/assets/custom-icon/share.svg)**分享**: 產生分享連結，有效期限為60天。
      - ![download](/src/assets/custom-icon/download.svg)**下載圖片**: 將整個行動軸轉換成圖片。

4.  **圖片上傳**
    - 透過網頁左上角![upload](/src/assets/custom-icon/upload.svg)可以上傳圖片並載入資料。
      ![upload](/image/upload.gif)

5.  **其他功能**:
    - ![setting](/src/assets/custom-icon/setting.svg)**設定**: 在設定選單中，你可以調整技能語言。
      - 繁體中文
      - 日本語
      - 簡體中文(國際服)
      - 簡體中文(B服)
    - ![refresh skill options](/src/assets/custom-icon/update.svg)**技能選項刷新**: 技能選項是在角色選擇的當下設定好的，如果未來有新技能，可以選擇使用該按鈕，他會自動更新目前選擇隊伍的所有角色技能選項。

</details>

## 🛠️ 主要開發框架&套件

| 類別         | 工具                              |
| :----------- | :-------------------------------- |
| **核心框架** | [Vue 3](https://vuejs.org/)       |
| **建置工具** | [Vite](https://vitejs.dev/)       |
| **狀態管理** | [Pinia](https://pinia.vuejs.org/) |

## 🚀 本機開發

如果你想在本地端運行或進行二次開發，請遵循以下步驟。

### **環境準備**

- 確認已安裝 [Node.js](https://nodejs.org/) `20.19+`
- 推薦使用 [VSCode](https://code.visualstudio.com/) 作為開發工具，並安裝 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 擴充功能。

### **專案腳本**

| 指令              | 描述                                           |
| :---------------- | :--------------------------------------------- |
| `npm install`     | 安裝專案所有依賴。                             |
| `npm run dev`     | 啟動本地開發伺服器，支援熱重載。               |
| `npm run build`   | 將專案打包至 `dist` 資料夾，並壓縮 JSON 檔案。 |
| `npm run preview` | 預覽打包後的成果。                             |
| `npm run format`  | 使用 Prettier 格式化所有程式碼。               |
| `npm run lint`    | 使用 ESLint 檢查並修正程式碼風格問題。         |

## 🤝 貢獻與協助

本專案目前非常歡迎社群的貢獻，特別是針對遊戲內資料的翻譯與校對。
