# 🚀 S S Enterprises Website

A modern, responsive business website for **S S Enterprises**, a manpower consultancy based in Patna, Bihar.

The website includes a professional landing page along with a secure **Staff Admin Portal** that allows authorized staff members to upload, update, and manage the latest job posters in real time without touching the website code.

---

## 🌐 Live Demo

🔗 https://saeed8271.github.io/bojo/

---

## ✨ Features

### Public Website
- Responsive design for all devices
- Modern and professional UI
- Service showcase
- About Us section
- Contact information
- Direct WhatsApp integration
- Google Maps integration
- Latest Jobs section
- Image lightbox for job posters
- Fast loading and optimized images

### Staff Admin Portal
- Secure Firebase Authentication
- Staff Login / Logout
- Upload new job posters
- Replace existing posters
- Delete job posters
- Company Name field
- Location field
- Posted Date field
- Drag & Drop image upload
- Image preview before upload
- Automatic homepage updates
- Responsive admin dashboard
- Toast notifications
- Delete confirmation modal

---

# 🛠 Tech Stack

### Frontend
- HTML5
- CSS3
- Bootstrap 5
- JavaScript (ES6)

### Backend Services
- Firebase Authentication
- Cloud Firestore
- Cloudinary

### Hosting
- GitHub Pages

---

# 📂 Project Structure

```
ss_enterprises.com/
│
├── css/
│   ├── style.css
│   ├── portal.css
│
├── js/
│   ├── firebase-config.js
│   ├── jobs-homepage.js
│   ├── portal.js
│   ├── script.js
│
├── images/
│
├── staff-portal/
│   └── index.html
│
└── index.html
```

---

# 🔐 Admin Portal

The website includes a private Staff Portal where authorized staff members can manage job advertisements.

### Admin Features

- Firebase Authentication
- Secure Login
- Upload Job Posters
- Replace Existing Posters
- Delete Posters
- Automatic Homepage Updates
- Real-time Firestore Sync

---

# ☁ Cloudinary Integration

Uploaded posters are stored securely in Cloudinary.

### Optimizations

- Automatic image compression
- Automatic format conversion
- Optimized thumbnails
- Faster loading speed
- Reduced bandwidth usage

Example transformation:

```
/upload/f_auto,q_auto,w_200/
```

Benefits:

- Smaller file sizes
- Better performance
- Improved user experience

---

# 🔥 Firebase Integration

This project uses Firebase for:

- Authentication
- Cloud Firestore Database

Firestore stores:

- Image URL
- Company Name
- Location
- Posted Date
- Cloudinary Public ID
- Created Timestamp

---

# 🚀 Deployment

Hosted on:

- GitHub Pages

Backend Services:

- Firebase
- Cloudinary

---

# 📸 Latest Jobs Workflow

```
Staff Login
      │
      ▼
Upload Poster
      │
      ▼
Cloudinary Upload
      │
      ▼
Firestore Document Created
      │
      ▼
Homepage Updates Automatically
      │
      ▼
Visitors View Latest Jobs
```

---

# 📈 Performance

✔ Responsive Design

✔ Lazy Loading Images

✔ Optimized Cloudinary Images

✔ Automatic Image Compression

✔ Fast Page Loading

✔ Mobile Friendly

---

# 🔒 Security

- Firebase Authentication
- Protected Staff Portal
- Firestore Security Rules
- Cloudinary Upload Presets
- No Admin Access from Public Website

---

# 👨‍💻 Developed By

**MD SAEED ANWAR**

Full Stack Developer

📧 Contact: +91-9934105655

🔗 GitHub: https://github.com/Saeed8271

---

## 📄 License

This project was developed for **S S Enterprises**.

The source code is shared for portfolio and learning purposes. Unauthorized commercial use or redistribution without permission is prohibited.

---

## ⭐ If you like this project

Please consider giving the repository a **Star ⭐**.
