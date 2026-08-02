/* ==========================================================================
   Firebase + Cloudinary Configuration
   S S Enterprises - Staff Portal
   Replace the placeholder values below with your real project credentials.
   ========================================================================== */

// ---- Firebase Config (Authentication + Firestore) ----
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (compat SDK)
firebase.initializeApp(firebaseConfig);

// Shared Firebase service instances used across portal.js and jobs-homepage.js
const auth = firebase.auth();
const db = firebase.firestore();

// ---- Cloudinary Config (Unsigned Upload) ----
const CLOUDINARY_CLOUD_NAME = "YOUR_CLOUD_NAME";
const CLOUDINARY_UPLOAD_PRESET = "ss_latest_jobs";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
