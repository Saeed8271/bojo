/* ===========================================================
   Firebase + Cloudinary Configuration
=========================================================== */

const firebaseConfig = {
    apiKey: "AIzaSyDHXwjSGZaj3yFKa3ovQ3vlAWV8Sr646E8",
    authDomain: "ss-enterprises-website.firebaseapp.com",
    projectId: "ss-enterprises-website",
    storageBucket: "ss-enterprises-website.firebasestorage.app",
    messagingSenderId: "842630846766",
    appId: "1:842630846766:web:f133d594d9be0c1313c2bf"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Services
const auth = firebase.auth();
const db = firebase.firestore();

/* ==========================
   Cloudinary
========================== */

const CLOUDINARY_CLOUD_NAME = "cnuzoh5i";
const CLOUDINARY_UPLOAD_PRESET = "ss_latest_jobs";

const CLOUDINARY_UPLOAD_URL =
`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
