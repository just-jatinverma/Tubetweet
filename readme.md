# 📺 Tubetweet

Tubetweet is a full-stack-ready **backend API** that combines video sharing and micro-blogging. It powers features similar to platforms like **YouTube** and **Twitter**, offering user registration, video uploads, tweet posting, comments, likes, subscriptions, and playlist management.

---

## 🚀 Features

- ✅ User registration & login (JWT + refresh token authentication)
- 📹 Upload, edit, and delete videos (ImageKit + Multer)
- 📝 Post, update, delete tweets
- 💬 Comment on videos
- ❤️ Like/unlike tweets, videos, and comments
- 📁 Playlist creation & management
- 👥 Subscribe to channels (users)
- 📊 Dashboard with video stats
- 🧾 Modular controller-based structure

---

## 🛠️ Tech Stack

- **Backend**: Node.js with Express v5
- **Database**: MongoDB (via Mongoose)
- **Auth**: JWT + Refresh tokens via cookies
- **Uploads**: ImageKit + Multer
- **Others**: dotenv, CORS, cookie-parser

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/just-jatinverma/Tubetweet.git
cd tubetweet
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file in the root with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_project_id
```

### 4. Start development server

```bash
npm run dev
```

---

## 🔐 Authentication

Tubetweet uses **JWT-based authentication**:

- Tokens are stored in **HTTP-only cookies**
- Access token and refresh token are generated during login
- Refresh token endpoint allows regenerating expired tokens

---

## 🔄 Core API Endpoints (Examples)

| Feature             | Endpoint                       | Method | Auth |
| ------------------- | ------------------------------ | ------ | ---- |
| Register User       | `/api/v1/users/register`       | POST   | ❌   |
| Login User          | `/api/v1/users/login`          | POST   | ❌   |
| Logout User         | `/api/v1/users/logout`         | POST   | ✅   |
| Refresh Token       | `/api/v1/users/refresh-token`  | POST   | ❌   |
| Upload Video        | `/api/v1/videos`               | POST   | ✅   |
| Like Video          | `/api/v1/likes/video/:videoId` | POST   | ✅   |
| Comment on Video    | `/api/v1/comments/:videoId`    | POST   | ✅   |
| Create Tweet        | `/api/v1/tweets`               | POST   | ✅   |
| Toggle Subscription | `/api/v1/subscribe/:channelId` | POST   | ✅   |
| Playlist CRUD       | `/api/v1/playlists/`           | CRUD   | ✅   |

> For complete route details, refer to the `controllers/` and assumed `routes/` directory.

---

## 📊 Dashboard & Stats

Authenticated users can access their own:

- Total videos
- Total views
- Subscriber count
- Total likes

---

## 🧪 Dev Tools

- **Nodemon**: Auto-restarts server on file changes
- **Prettier**: Enforced code formatting
- **Mongoose Aggregate Pagination**: Pagination for video queries

---

## ✅ Scripts

```bash
npm run dev    # Run dev server with nodemon
```

---

## 📌 Note

🛠 This project is part of the **Backend Mastery Course by Hitesh Choudhary (Chai aur Code)** on YouTube.
📂 The initial `user.controller.js` and related authentication logic were built by @hiteshchoudhary sir in the course.
🧑‍💻 All remaining controllers (videos, tweets, playlists, likes, comments, etc.) were implemented by **me** as part of my learning journey.

📺 **Watch the course here**:
[Chai aur Code Backend Playlist](https://youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW&si=IxheTxzfP8vvEXU1)

---

## 📄 License

Licensed under the **ISC License** — free for personal and commercial use.

---

## 👨‍💻 Author

Developed by @just-jatinverma.
