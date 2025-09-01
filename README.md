# 🎬 CineCritic – Movie Review App

A **MERN stack** movie review application where users can explore Avengers movies, view details, and manage sessions securely.  
The project integrates **OMDb API** for fetching movie data and uses **MongoDB Atlas** for storing user information and reviews.  

🌐 **Live Demo**: [https://revmov.netlify.app/](https://revmov.netlify.app/)

---

## 🚀 Features

- 🔑 **Authentication & Authorization** using sessions (no localStorage, secure route protection).  
- 🎥 **OMDb API Integration** – fetches Avengers movie data (limited to 10 movies with pagination).  
- ⚡ **React Query** used for caching API responses to save API tokens & optimize performance.  
- 🗄️ **MongoDB Atlas** as the database with customized schemas for storing users and reviews.  
- 🛠️ **Express.js Backend** with cleanly separated routes & models.  
- 🎨 **Frontend** built with React, Context API for global user state management.  
- 📱 **Responsive UI** for both desktop & mobile.  

---

## 🏗️ Tech Stack

- **Frontend:** React, Vite, Context API, React Query  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas  
- **API:** OMDb API (for movies)  
- **Hosting:** Netlify (frontend), Render (backend)  

---

## ⚙️ Installation & Setup

Clone the repository:

```bash
git clone https://github.com/adithyakrishnapn/moviereview
cd moviereview
```

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Project Structure

```
moviereview/
│
├── backend/        # Express backend
│   ├── models/     # Mongoose schemas
│   ├── routes/     # API routes
│   ├── server.js   # Entry point
│
├── frontend/       # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/   # AuthContext for user state
│   │   ├── services/  # API utilities
│   │   └── pages/
│
└── README.md
```

---

## 🔒 Authentication Flow

- Uses **sessions** with cookies (not localStorage) for better security.  
- Protected routes validate the session state before rendering.  
- Logout clears the session securely.  

---

 

## 👨‍💻 Author

Developed by **[Adithya Krisna P N](https://github.com/adithyakrishnapn)** 🚀

---
