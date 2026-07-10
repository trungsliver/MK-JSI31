// File firebase-config.js
import { firebaseConfig } from "./firebase-config.js";
// Thư viện Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
// Thư viện Authentication
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut
}
    from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
// Thư viện Firestore
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
    addDoc,
	deleteDoc,
	onSnapshot,
	orderBy,
	serverTimestamp
}
    from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Khởi tạo firebase
const app = initializeApp(firebaseConfig);
// test app
console.log(app.name); // "[DEFAULT]"