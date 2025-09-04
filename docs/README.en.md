# HBR-AxleTool-vue - Heaven Burns Red Axle Tool

This is a web tool designed for the mobile game "Heaven Burns Red" to help players easily share their battle action axes.

Through a visualized interface, players can record the skill casting order of characters in each turn and export the final action axis as an image or share it with friends via URL.

![Project Preview](/image/preview.png)

## ✨ Main Features

- **Visualized Axle Editing**: Easily arrange character actions for each turn through intuitive drag-and-drop operations.
- **Team Composition**: Supports all troops and characters in the game, quickly building your battle team.
- **Axle Export**: The arranged action axis can be exported as an image or URL for easy saving and sharing.

## 📖 Usage Guide

<details>
<summary>Click to expand usage guide</summary>

1.  **Team Editing**:

    - In the character selection interface, select Team, Character, and Style in order.
      ![Character Selection](/image/select_char.png)
    - You can freely sort positions by dragging.
      ![Drag and Drop](/image/select_char_drag&drop.gif)

2.  **Axle Editing**:

    - You can edit Turn, OD, Skill Selection, and Target.
      ![Axle](/image/axle.png)
    - You can swap axle order and freely sort character positions by dragging.
      ![Drag and Drop Axle](/image/axle.gif)

3.  **Share and Export**:

    - Click the ![Axle Icon](/src/assets/custom-icon/table.svg) in the upper right corner of the webpage to see the complete axle.
    - After clicking, you will see 3 buttons in the upper left: Filter, Download Image, Share
      - ![Filter](/src/assets/custom-icon/filter-on.svg)**Filter**: Freely select the parts you need to display.
      - ![Share](/src/assets/custom-icon/share.svg)**Share**: Generates a link containing the current team and axle configuration. Others can open the link to see your axle. The link is valid for 60 days.
      - ![Download](/src/assets/custom-icon/download.svg)**Download Image**: Converts the entire axle into an image.

4.  **Image Upload**

    - You can upload images and load data via ![Upload Icon](/src/assets/custom-icon/upload.svg) in the upper left corner of the webpage.
      ![Upload](/image/upload.gif)

5.  **Other Features**:
    - ![Settings Icon](/src/assets/custom-icon/setting.svg)**Settings**: In the settings menu, you can adjust the skill language.
      - Traditional Chinese
      - Japanese
      - Simplified Chinese (International Server)
      - Simplified Chinese (Bilibili Server)
    - ![Refresh Skill Options Icon](/src/assets/custom-icon/update.svg)**Refresh Skill Options**: Skill options are set at the time of character selection. If there are new skills in the future, you can choose to use this button, which will automatically update all character skill options for the currently selected team.

</details>

## 🛠️ Main Development Frameworks & Packages

| Category         | Tool                              |
| :--------------- | :-------------------------------- |
| **Core Framework** | [Vue 3](https://vuejs.org/)       |
| **Build Tool**   | [Vite](https://vitejs.dev/)       |
| **State Management** | [Pinia](https://pinia.vuejs.org/) |

## 🚀 Local Development

If you want to run or develop locally, please follow these steps.

### **Environment Setup**

- Confirm [Node.js](https://nodejs.org/) is installed (recommended version 18.x or above)
- Recommended to use [VSCode](https://code.visualstudio.com/) as a development tool and install the [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension.

### **Project Scripts**

| Command           | Description                                    |
| :---------------- | :--------------------------------------------- |
| `npm install`     | Installs all project dependencies.             |
| `npm run dev`     | Starts the local development server with hot reload. |
| `npm run build`   | Builds the project to the `dist` folder and compresses JSON files. |
| `npm run preview` | Previews the built output.                     |
| `npm run format`  | Formats all code using Prettier.               |
| `npm run lint`    | Checks and fixes code style issues using ESLint. |

## 🤝 Contributions & Assistance

This project currently welcomes community contributions, especially for translation and proofreading of in-game data.