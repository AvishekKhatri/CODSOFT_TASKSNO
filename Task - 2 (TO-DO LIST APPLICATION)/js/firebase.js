/**
 * ZenTask - Firebase Configuration & Initialization
 * Uses Firebase v9+ Modular SDK loaded from CDN
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js';

// Firebase project configuration for ZenTask Planner
const firebaseConfig = {
    apiKey: "AIzaSyBh8qiruizWxyZQPRxPK1EoDe2LBI-1Ib0",
    authDomain: "zentask-planner-fe3ef.firebaseapp.com",
    projectId: "zentask-planner-fe3ef",
    storageBucket: "zentask-planner-fe3ef.firebasestorage.app",
    messagingSenderId: "745560900828",
    appId: "1:745560900828:web:7b038e0c413e2daef8e019",
    measurementId: "G-S6JEPESPVS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { app, auth };
