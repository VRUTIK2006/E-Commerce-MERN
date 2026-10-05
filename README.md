# 🛒 BuyOn — Full-Stack E-Commerce Platform

## 📌 Overview

**BuyOn** is a full-stack e-commerce platform built with the **MERN stack**, providing a complete shopping experience with user authentication, product management, cart, checkout, orders, and an admin dashboard.

The project focuses on implementing real-world web application concepts such as:

- Authentication and authorization
- RESTful APIs
- Role-based access control
- Product management
- Persistent shopping cart
- Checkout and order processing
- Email OTP verification
- Order tracking
- Image uploads and cloud storage
- Responsive UI
- Admin dashboard

---

## ✨ Features

### 👤 Authentication & Authorization

- User registration and login
- Email OTP verification
- JWT-based authentication
- Protected routes
- Role-based authorization
- User/Admin roles
- Secure password handling

### 🛍️ Product Management

- Browse products
- Dynamic product cards
- Product images
- Product descriptions
- Product pricing
- Product categories
- Admin product management

### 🛒 Shopping Cart

- Add products to cart
- Update product quantity
- Remove products
- Persistent cart stored in MongoDB
- User-specific cart
- Redux cart state management

### 💳 Checkout & Payments

- Delivery address management
- Order summary
- Tax calculation
- Shipping calculation
- Cash on Delivery
- Razorpay payment integration
- Payment status tracking

### 📦 Orders

- Place orders
- View previous orders
- Order details
- Payment status
- Order tracking

### 📧 Email Verification

- OTP generation
- OTP expiration
- Email-based account verification

### 🛠️ Admin Dashboard

Administrators can manage:

- Products
- Product images
- Orders
- Order status

### ☁️ Image Management

- Cloudinary for image storage
- Multer for file uploads

### 🎨 User Experience

- Responsive design
- Tailwind CSS
- Toast notifications
- Loading states
- Error handling
- Reusable React components

---

## 🏗️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React.js | UI development |
| Vite | Development and build tool |
| Tailwind CSS | Styling |
| Redux Toolkit | State management |
| Axios | API communication |
| React Router | Client-side routing |
| Sonner | Toast notifications |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcrypt | Password hashing |
| Nodemailer | Email/OTP |
| Multer | File uploads |
| Cloudinary | Image storage |
| Razorpay | Payment processing |
