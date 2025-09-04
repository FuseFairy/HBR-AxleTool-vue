[English](/docs/README.en.md) | [日本語](/docs/README.ja.md) | [繁體中文](/README.md) | [简体中文](/docs/README.zh-CN.md)

# HBR-AxleTool-vue - 绯染天空行动轴编辑器

这是一款专为手机游戏《[绯染天空 Heaven Burns Red](https://heaven-burns-red.com/)》设计的网页工具，旨在帮助玩家轻松分享战斗中的行动轴。

通过可视化的界面，玩家可以记录每个回合的角色技能施放顺序，并将最终的行动轴导出成图片或通过 URL 分享给朋友。

![项目预览图](/image/preview.png)

## ✨ 主要功能

*   **可视化行动轴编辑**：通过直观的拖曳等操作，轻松安排每个回合的角色行动。
*   **队伍編成**：支持游戏中所有部队及角色，快速建立你的战斗队伍。
*   **行动轴导出**：可将排好的行动轴导出成图片或是 URL，方便保存与分享。

## 📖 使用教学

1.  **队伍编辑**:
    *    角色选择界面按照顺序依次选择 队伍（Team）、角色（Character）、战型（Style）。
        ![角色选择](/image/select_char.png)
    *   其他设定（Others）可以设定 突破数（Rank）、耳环（Earring）、被动技能（Passive SKill）和 专武等级（Spiritual Rupture）。
        ![其他](/image/select_char_others.png)
    *   能通过拖曳随意排序位置。
        ![拖曳](/image/select_char_drag&drop.gif)

2.  **行动轴编辑**:
    *   可以编辑 回合（Turn）、OD、技能选择（Skill） 和 选择对象（Target）。
        ![axle](/image/axle.png)
    *   能调换轴顺序和通过拖曳随意排序角色位置。
        ![拖曳](/image/axle.gif)

3.  **分享与导出**:
    *   点击网页右上角的 ![axle icon](/src/assets/custom-icon/table.svg) 可以看到完整的轴。
    *   点进去后会左上会看到 3 个按钮，分别是 筛选、下载图片、分享
        *   ![filter](/src/assets/custom-icon/filter-on.svg)**筛选**: 自由选择需要显示的部分。
        *   ![share](/src/assets/custom-icon/share.svg)**分享**: 会产生一组包含目前队伍和行动轴配置的链接，其他人打开链接即可看到你的轴，链接有效期限为60天。
        *   ![download](/src/assets/custom-icon/download.svg)**下载图片**: 将整个行动轴输出成一张图片，方便你在社群或与朋友讨论。

4.  **图片上传**
    *   通过网页右上角![upload](/src/assets/custom-icon/upload.svg)可以上传图片并加载数据。
    ![upload](/image/upload.gif)

5.  **其他功能**:
    *   ![setting](/src/assets/custom-icon/setting.svg)**设定**: 在设定菜单中，你可以调整技能语言。
      *   繁体中文
      *   日本语
      *   简体中文(国际服)
      *   简体中文(B服)
    * ![refresh skill options](/src/assets/custom-icon/update.svg)**技能选项刷新**: 技能选项是在角色选择的当下设定好的，如果未来有新技能，可以选择使用该按钮，他会自动更新目前选择队伍的所有角色技能选项。

## 🛠️ 主要开发框架&套件 

| 类别 | 工具 | 
| :--- | :--- | 
| **核心框架** | [Vue 3](https://vuejs.org/) | 
| **构建工具** | [Vite](https://vitejs.dev/) | 
| **状态管理** | [Pinia](https://pinia.vuejs.org/) | 

## 🚀 本机开发

如果你想在本地端运行或进行二次开发，请遵循以下步骤。

### **环境准备**

- 确认已安装 [Node.js](https://nodejs.org/) (建议版本 18.x 或以上)
- 推荐使用 [VSCode](https://code.visualstudio.com/) 作为开发工具，并安装 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 扩充功能。

### **项目脚本**

| 指令 | 描述 | 
| :--- | :--- | 
| `npm install` | 安装项目所有依赖。 | 
| `npm run dev` | 启动本地开发服务器，支持热重载。 | 
| `npm run build` | 将项目打包至 `dist` 文件夹，并压缩 JSON 文件。 | 
| `npm run preview` | 预览打包后的成果。 | 
| `npm run format` | 使用 Prettier 格式化所有代码。 | 
| `npm run lint` | 使用 ESLint 检查并修正代码风格问题。 | 

## 🤝 贡献与协助

本专案目前非常欢迎社群的贡献，特别是针对游戏内资料的翻译与校对。