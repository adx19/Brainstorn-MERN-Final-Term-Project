
# Brainstorm - Single User Whiteboard

**Brainstorm** is a modern, interactive web-based whiteboard application designed for individual use. Users can create, edit, and manage their boards with ease, draw with various brush sizes and colors, erase strokes, save their work, and download their boards as images.

Built with **React**, **Redux**, and **REST APIs**, Brainstorm provides a smooth, responsive, and user-friendly experience for digital brainstorming, note-taking, and sketching ideas.

---

## Features

* **User Authentication**

  * Secure login and logout.
  * Redux state management for user session.

* **Interactive Whiteboard**

  * Freehand drawing with customizable brush color and size.
  * Eraser functionality for removing unwanted strokes.
  * Clear board and reset canvas options.
  * Download boards as `.png` images.

* **Board Management**

  * Create multiple boards.
  * Update board status: ongoing, saved, completed.
  * Persistent state management via Redux (future-ready for multi-session support).

* **Responsive Design**

  * Clean UI built with Tailwind CSS.
  * Works seamlessly across desktop and tablet screens.

---

## Tech Stack

* **Frontend:** React, Redux Toolkit, Tailwind CSS
* **Routing:** React Router
* **Icons:** Lucide-react
* **Backend:** Node.js / Express (for authentication and board API)
* **State Management:** Redux for user and board data

---

## Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/adx19/Brainstorn-MERN-Final-Term-Project.git
cd brainstorm
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure API**

Update your backend API base URL in `apiCalls/config.js`:

```js
export const API_BASE_URL = "http://localhost:2805";
```

4. **Start the application**

```bash
npm start
```

The app will be available at `http://localhost:3000`.

---

## Usage

1. **Login** or **Sign Up** to start creating boards.
2. Use the **toolbar** to select colors, brush size, or erase strokes.
3. Click **Save** to store your board.
4. Click **Download** to export your board as an image.
5. Switch between multiple boards from the sidebar.

---

## Future Enhancements

* Multi-user support with collaborative real-time drawing.
* Cloud storage for boards.
* Undo/Redo functionality.
* Sticky notes and text annotations.

