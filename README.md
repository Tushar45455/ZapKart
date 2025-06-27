# 🛒 ZapKart – E-Commerce Web Application

ZapKart is a modern, full-featured E-Commerce web application developed using the MERN stack. It provides a seamless online shopping experience with user authentication, product browsing, cart management, and an admin dashboard for managing inventory.

---

## 🔧 Features

- 🧑‍💼 User Registration & Login (JWT-based Authentication)
- 🛍️ Browse Products by Category, Price, and Search
- 🛒 Add to Cart / Remove from Cart
- 💳 Checkout Flow (Dummy Payment Gateway ready)
- 🧾 Order History & Invoice View
- 🛠️ Admin Panel to Add, Update, or Delete Products
- 🔍 Search & Filter Functionality
- 📱 Fully Responsive Design (Mobile-First)

---

## 🛠️ Tech Stack

### 💻 Frontend
- React.js (with Hooks & Context API)
- HTML5, CSS3, JavaScript
- Tailwind CSS / Bootstrap

### 🌐 Backend
- Node.js
- Express.js

### 🗃️ Database
- MongoDB (Mongoose ODM)

### 🔐 Authentication
- JWT (JSON Web Tokens)
- Protected Routes for Users/Admin

### 🧰 Tools & Utilities
- Git & GitHub
- Postman (API Testing)
- dotenv (Environment Configuration)

---

## 📂 Folder Structure

ZapKart/
├── client/ # Frontend - React.js
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ ├── App.tsx
│ │ └── index.tsx
├── server/ # Backend - Node.js/Express.js
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── config/
│ ├── middleware/
│ └── server.ts
└── README.md

yaml
Copy
Edit

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ZapKart-E-Commerce-Web-Application.git
2. Set up the backend
bash
Copy
Edit
cd ZapKart/server
npm install
npm run dev
Create a .env file with the following:

ini
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
3. Set up the frontend
bash
Copy
Edit
cd ../client
npm install
npm start
📷 Screenshots

🧑‍💻 Developed By
Tushar Ganesh Kadu
MCA Student @ GHRCEM, Nagpur
GitHub: Tushar45455
LinkedIn: tushar-kadu-b28482185

“Your most unhappy customers are your greatest source of learning.” – Bill Gates

Thanks for checking out ZapKart! Happy Coding 🛒✨
