/**
 * ZenTask - Firebase Authentication Controller Module
 * Handles user sign-up, sign-in, sign-out, and auth state monitoring.
 */

import { auth } from './firebase.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    browserLocalPersistence,
    setPersistence,
    GoogleAuthProvider,
    signInWithPopup
} from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js';

/**
 * Map Firebase error codes to user-friendly messages
 * @param {string} errorCode - Firebase error code
 * @returns {string} user-friendly message
 */
function getFriendlyError(errorCode) {
    const errorMap = {
        'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/user-disabled': 'This account has been disabled. Please contact support.',
        'auth/user-not-found': 'No account found with this email. Please sign up first.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
        'auth/too-many-requests': 'Too many failed attempts. Please wait a moment and try again.',
        'auth/network-request-failed': 'Network error. Please check your internet connection.',
        'auth/invalid-credential': 'Invalid email or password. Please try again.',
        'auth/operation-not-allowed': 'Sign-in method is not enabled. Please enable it in the Firebase Console.',
        'auth/configuration-not-found': 'Sign-in provider has not been enabled in the Firebase Console under Authentication > Sign-in method.',
        'auth/missing-password': 'Please enter your password.',
        'auth/missing-email': 'Please enter your email address.'
    };

    return errorMap[errorCode] || `An unexpected error occurred (${errorCode}). Please try again.`;
}

/**
 * Sign up a new user with email and password
 * @param {string} email 
 * @param {string} password 
 * @param {string} displayName - optional display name
 * @returns {Promise<Object>} result with { success, user, error }
 */
export async function signUpWithEmail(email, password, displayName = '') {
    try {
        // Set persistence so the session survives page reloads
        await setPersistence(auth, browserLocalPersistence);
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Set display name if provided
        if (displayName.trim()) {
            await updateProfile(userCredential.user, { displayName: displayName.trim() });
        }
        
        return { success: true, user: userCredential.user, error: null };
    } catch (error) {
        console.error('Sign up error:', error.code, error.message);
        return { success: false, user: null, error: getFriendlyError(error.code) };
    }
}

/**
 * Sign in existing user with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} result with { success, user, error }
 */
export async function signInWithEmail(email, password) {
    try {
        await setPersistence(auth, browserLocalPersistence);
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user, error: null };
    } catch (error) {
        console.error('Sign in error:', error.code, error.message);
        return { success: false, user: null, error: getFriendlyError(error.code) };
    }
}

/**
 * Sign out current user
 * @returns {Promise<Object>} result with { success, error }
 */
export async function signOutUser() {
    try {
        await signOut(auth);
        return { success: true, error: null };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, error: 'Failed to sign out. Please try again.' };
    }
}

/**
 * Listen for auth state changes
 * @param {Function} callback - called with (user) on state change; user is null when signed out
 */
export function onAuthChange(callback) {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}

/**
 * Get current authenticated user (synchronous check)
 * @returns {Object|null} Firebase User or null
 */
export function getCurrentUser() {
    return auth.currentUser;
}

/**
 * Sign in / Sign up using Google Authenticator Popup
 * @returns {Promise<Object>} result with { success, user, error }
 */
export async function signInWithGoogle() {
    try {
        await setPersistence(auth, browserLocalPersistence);
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return { success: true, user: result.user, error: null };
    } catch (error) {
        console.error('Google Auth error:', error.code, error.message);
        return { success: false, user: null, error: getFriendlyError(error.code) };
    }
}

/**
 * Update current user's profile display name
 * @param {string} displayName
 * @returns {Promise<Object>}
 */
export async function updateUserProfile(displayName) {
    try {
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: displayName.trim() });
            return { success: true };
        }
        return { success: false, error: 'No active user session.' };
    } catch (error) {
        return { success: false, error: 'Failed to update profile name.' };
    }
}
