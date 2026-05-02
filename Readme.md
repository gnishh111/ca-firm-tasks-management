# 📊 CA Firm Task Management System

A full-stack web application designed to streamline task management, employee coordination, and client services for Chartered Accountant firms.

---

## 🚀 Features

- 👥 User & Employee Management
- 🏢 Customer & Firm Management
- 📂 Department-wise Task Assignment
- 📝 Task Tracking & Status Updates
- 🛠️ Services & Firm Services Management
- 📁 File Upload (User Images)
- 🔐 Authentication System
- 📊 Admin Dashboard

---

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)

### Frontend

- React (Vite)
- Axios
- Custom Admin UI Theme

---

## 📁 Project Structure

```
Root
│── Backend        # Node.js + Express API
│── Frontend       # React (Vite)
```

---

## ⚙️ Backend Setup

### 1. Navigate to Backend

```bash
cd Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in `Backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 4. Run Server

```bash
npm start
```

Or (for development):

```bash
nodemon server.js
```

---

## 🌐 Frontend Setup

### 1. Navigate to Frontend

```bash
cd Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run App

```bash
npm run dev
```

---

## 🗄️ MongoDB Database Import

If you have a MongoDB collection export folder:

### 📥 Import using `mongorestore`

```bash
mongorestore --uri="your_mongodb_atlas_uri" path_to_export_folder
```

### Example:

```bash
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/db_name" ./db_backup
```

> ⚠️ Make sure:
>
> - MongoDB Database Tools are installed
> - Your IP is whitelisted in MongoDB Atlas
> - Correct database name is used

---

## 📡 API Structure

```
/api/
│── user
│── department
│── service
│── firm-service
│── task
│── customer-firm
│── user-department
```

---

## 📂 Important Backend Folders

- `controller/` → Business logic
- `models/` → Mongoose schemas
- `routes/` → API routes
- `db/` → Database connection
- `helper/` → Utility functions (file upload, etc.)
- `public/Images/User/` → Uploaded user images

---

## 📂 Important Frontend Folders

- `pages/admin/` → Admin panel pages
- `components/admin/` → Layout components
- `layouts/` → Admin layout
- `api/axios.js` → API configuration
- `router/` → App routing

---

## 🔐 Authentication

Login page location:

```
Frontend/src/pages/admin/Login.jsx
```

---

## 📸 File Upload

User images are stored in:

```
Backend/src/public/Images/User/
```

---

## 📌 Future Improvements

- Role-based access control (RBAC)
- Notifications system
- Real-time updates (WebSockets)
- Mobile app integration
- Reports & analytics

---

## 🤝 Contribution

Feel free to fork and improve the project.

---

## 📄 License

This project is for educational and internal use.

---

## 👨‍💻 Author

**Jeenishh M**
