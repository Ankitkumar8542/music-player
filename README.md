# MusicPlayer

A full-featured music player React app with admin panel.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure backend URL**

   Open `src/App.jsx` and update the `BASE_URL` at the top:
   ```js
   const BASE_URL = "http://localhost:8080"; // change to your backend
   ```

3. **Run in development**
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

## Features

- 🎵 Music playback with progress bar, volume, shuffle & repeat
- 🔍 Search songs, artists, albums
- 📚 Playlist library (create, delete, add/remove songs)
- ❤️ Liked songs
- 🕓 Play history
- 👤 User profile
- 🛡️ Admin panel: Dashboard stats, Songs, Albums, Categories, Users management
- 🔐 JWT-based auth (login / register)

## Tech Stack

- React 18 + Vite
- Inline CSS (no extra CSS framework)
- Native HTML5 `<audio>` API
- REST API via `fetch`
