/**
 * Auth Manager Module
 * Handles all Firebase Authentication operations.
 */

class AuthManager {
    /**
     * Register a new user with email and password.
     * Creates a Firestore profile document for the user.
     */
    static async signUp(email, password) {
        try {
            const credential = await auth.createUserWithEmailAndPassword(email, password);
            const user = credential.user;

            // Create user profile document in Firestore
            await db.collection('users').doc(user.uid).set({
                email: user.email,
                displayName: email.split('@')[0],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Create default accounts subcollection
            const accountsRef = db.collection('users').doc(user.uid).collection('accounts');
            await accountsRef.doc('acc_cash').set({ name: 'Cash Wallet', type: 'cash' });
            await accountsRef.doc('acc_checking').set({ name: 'Checking Account', type: 'bank' });
            await accountsRef.doc('acc_credit').set({ name: 'Credit Card', type: 'credit' });

            return { success: true, user };
        } catch (error) {
            return { success: false, error: this.getFriendlyError(error.code) };
        }
    }

    /**
     * Sign in an existing user.
     */
    static async signIn(email, password, rememberMe = false) {
        try {
            // Set persistence based on "Remember Me"
            const persistence = rememberMe
                ? firebase.auth.Auth.Persistence.LOCAL
                : firebase.auth.Auth.Persistence.SESSION;
            await auth.setPersistence(persistence);

            const credential = await auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: credential.user };
        } catch (error) {
            return { success: false, error: this.getFriendlyError(error.code) };
        }
    }

    /**
     * Sign in or Sign up with Google OAuth redirect.
     */
    static async signInWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            // Optional: Customize scopes if needed
            provider.addScope('profile');
            provider.addScope('email');
            
            const credential = await auth.signInWithPopup(provider);
            const user = credential.user;

            // Check if profile document already exists in Firestore, otherwise initialize profile & accounts
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (!userDoc.exists) {
                await db.collection('users').doc(user.uid).set({
                    email: user.email,
                    fullName: user.displayName || user.email.split('@')[0],
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                // Create default accounts
                const accountsRef = db.collection('users').doc(user.uid).collection('accounts');
                await accountsRef.doc('acc_cash').set({ name: 'Cash Wallet', type: 'cash' });
                await accountsRef.doc('acc_checking').set({ name: 'Checking Account', type: 'bank' });
                await accountsRef.doc('acc_credit').set({ name: 'Credit Card', type: 'credit' });
            }

            return { success: true, user };
        } catch (error) {
            return { success: false, error: this.getFriendlyError(error.code) };
        }
    }

    /**
     * Sign out the current user.
     */
    static async signOut() {
        try {
            await auth.signOut();
            return { success: true };
        } catch (error) {
            return { success: false, error: this.getFriendlyError(error.code) };
        }
    }

    /**
     * Send a password reset email.
     */
    static async resetPassword(email) {
        try {
            await auth.sendPasswordResetEmail(email);
            return { success: true };
        } catch (error) {
            return { success: false, error: this.getFriendlyError(error.code) };
        }
    }

    /**
     * Listen for authentication state changes.
     * Returns unsubscribe function.
     */
    static onAuthStateChanged(callback) {
        return auth.onAuthStateChanged(callback);
    }

    /**
     * Get the currently logged-in user (synchronous snapshot).
     */
    static getCurrentUser() {
        return auth.currentUser;
    }

    /**
     * Map Firebase error codes to user-friendly messages.
     */
    static getFriendlyError(code) {
        const errors = {
            'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/user-not-found': 'No account found with this email. Please sign up first.',
            'auth/wrong-password': 'Incorrect password. Please try again.',
            'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
            'auth/too-many-requests': 'Too many failed attempts. Please wait a moment and try again.',
            'auth/network-request-failed': 'Network error. Please check your connection.',
            'auth/user-disabled': 'This account has been disabled. Contact support.',
            'auth/operation-not-allowed': 'Email/Password sign-in is not enabled. Enable it in Firebase Console.',
            'auth/invalid-credential': 'Invalid email or password. Please try again.',
            'auth/missing-password': 'Please enter your password.'
        };
        return errors[code] || `Authentication error: ${code}`;
    }
}

window.AuthManager = AuthManager;
