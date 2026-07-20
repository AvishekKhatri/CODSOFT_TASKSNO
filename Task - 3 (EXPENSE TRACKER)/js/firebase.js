/**
 * Firebase Configuration & Initialization
 * 
 * Configured automatically with your Firebase Project keys.
 */

const firebaseConfig = {
  apiKey: "AIzaSyAXLJYW3tuuG8bzFl81oe6UB08u9JFoRUU",
  authDomain: "spendora-4871d.firebaseapp.com",
  projectId: "spendora-4871d",
  storageBucket: "spendora-4871d.firebasestorage.app",
  messagingSenderId: "301021598894",
  appId: "1:301021598894:web:09ca160044bacb825e093f",
  measurementId: "G-Q8C485PZ6N"
};

// Initialize Firebase using compat syntax
firebase.initializeApp(firebaseConfig);

// Global references
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence for Firestore (graceful offline support)
db.enablePersistence({ synchronizeTabs: true }).catch(err => {
    if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence failed: Multiple tabs open.');
    } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence not supported in this browser.');
    }
});

console.log('[Firebase] Spendora initialized successfully.');
