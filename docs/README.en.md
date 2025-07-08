[English](/docs/README.en.md) | [日本語](/docs/README.ja.md) | [繁體中文](/README.md) | [简体中文](/docs/README.zh-CN.md)

# HBR-AxleTool-vue - Heaven Burns Red Action Timeline Editor

This is a web-based tool designed for the mobile game "[Heaven Burns Red](https://heaven-burns-red.com/)" to help players easily share their action timelines from battles.

Through a visual interface, players can record the skill execution order for each character per turn and export the final timeline as an image or share it with friends via a URL.

**[Try the Online Demo](https://hbr-axletool.pages.dev/)**

![Project Preview](/image/preview.png)

## ✨ Key Features

*   **Visual Timeline Editing**: Easily arrange character actions for each turn with intuitive operations like drag-and-drop.
*   **Team Composition**: Supports all in-game units and characters to quickly build your battle team.
*   **Timeline Export**: Export your arranged timeline as an image or a URL for easy saving and sharing.

## 📖 How to Use

1.  **Team Editing**:
    *   In the character selection interface, choose your Team, Character, and Style in order.
        ![Character Selection](/image/select_char.png)
    *   In "Others," you can set the Rank, Earring, Passive Skill, and Spiritual Rupture level.
        ![Others](/image/select_char_others.png)
    *   You can freely reorder positions by dragging and dropping.
        ![Drag & Drop](/image/select_char_drag&drop.gif)

2.  **Timeline Editing**:
    *   You can edit the Turn, OD, Skill, and Target.
        ![Timeline](/image/axle.png)
    *   You can swap timeline orders and freely reorder character positions by dragging.
        ![Drag & Drop](/image/axle.gif)

3.  **Sharing and Exporting**:
    *   Click the ![axle icon](/src/assets/custom-icon/table.svg) icon in the top-right corner to see the full timeline.
    *   After clicking, you will see 3 buttons in the top-left: Filter, Download Image, and Share.
        *   ![filter](/src/assets/custom-icon/filter-on.svg) **Filter**: Freely choose which parts to display.
        *   ![share](/src/assets/custom-icon/share.svg) **Share**: Generates a link containing the current team and timeline configuration. Others can open the link to see your timeline. The link is valid for 7 days.
        *   ![download](/src/assets/custom-icon/download.svg) **Download Image**: Exports the entire timeline as a single image, convenient for discussions in communities or with friends.

4.  **Image Upload**
    Upload an image and load data by clicking the ![upload](/src/assets/custom-icon/upload.svg) icon in the top-right corner.
    ![Upload](/image/upload.gif)

5.  **Other Features**:
    *   ![setting](/src/assets/custom-icon/setting.svg) **Settings**: In the settings menu, you can adjust the skill language.
        *   Traditional Chinese
        *   Japanese
        *   Simplified Chinese (International Server)
        *   Simplified Chinese (Bilibili Server)
    *   ![refresh skill options](/src/assets/custom-icon/update.svg) **Refresh Skill Options**: Skill options are set when a character is selected. If new skills are added in the future, you can use this button to automatically update the skill options for all characters in the currently selected team.

## 🛠️ Key Development Frameworks & Packages

| Category | Tool |
| :--- | :--- |
| **Core Framework** | [Vue 3](https://vuejs.org/) |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **State Management** | [Pinia](https://pinia.vuejs.org/) |

## 🚀 Local Development

If you want to run this project locally or contribute to its development, please follow these steps.

### **Prerequisites**

-   Ensure you have [Node.js](https://nodejs.org/) installed (version 18.x or higher is recommended).
-   It is recommended to use [VSCode](https://code.visualstudio.com/) as your development editor and install the [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension.

### **Project Scripts**

| Command | Description |
| :--- | :--- |
| `npm install` | Installs all project dependencies. |
| `npm run dev` | Starts the local development server with hot-reloading. |
| `npm run build` | Bundles the project into the `dist` folder and minifies JSON files. |
| `npm run preview` | Previews the bundled application. |
| `npm run format` | Formats all code using Prettier. |
| `npm run lint` | Lints and fixes code style issues using ESLint. |

## 💡 Future Development Plans

We are planning to develop a desktop assistant tool to complement this website, which will have the following core features:

-   **Real-time Battle Recording**: Using computer vision, the tool will recognize characters, skills used, and turn counts in real-time as you play.
-   **Timeline Generation**: It will be able to upload this data to our website to generate a timeline, which can then be edited and shared.

The goal of this feature is to fully automate the manual recording process, allowing players to focus more on the battle itself. Stay tuned!

## 🤝 Contribution and Support

This project currently welcomes community contributions, especially for translating and proofreading in-game data.

### **Seeking: Simplified Chinese (Bilibili Server) Translation Partner**

As the developer primarily uses Traditional Chinese, some game terminology and skill names for the Bilibili server may not be accurate or up-to-date. If you are familiar with the terminology of the "Heaven Burns Red" Bilibili server and are willing to help maintain the Simplified Chinese translation data, please contact me through the following methods.

### **Welcome Contributors for Other Languages**

In addition to Simplified Chinese for the Bilibili server, we sincerely welcome contributors who can provide translations in **other languages** (such as English, Korean, etc.). If you would like to help this tool support more languages and assist more players from different regions, please do not hesitate to contact us!

**Contact Methods:**

-   **GitHub Issues**: Open a new issue in this project's [Issues](https://github.com/FuseFairy/HBR-AxleTool-vue/issues) and state your purpose.
-   **Email**: [dd8611706@gmail.com](mailto:dd8611706@gmail.com)

Thank you very much for your enthusiasm and support!