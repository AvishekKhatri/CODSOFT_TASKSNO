/**
 * Firestore Manager Module
 * Handles all Cloud Firestore CRUD operations for Spendora.
 */

class FirestoreManager {
    // --- Helper to get user subcollection references ---
    static getUserRef(userId) {
        return db.collection('users').doc(userId);
    }

    // --- Profile & Settings ---
    static async getUserProfile(userId) {
        try {
            const doc = await this.getUserRef(userId).get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return null;
        }
    }

    static async saveUserProfile(userId, data) {
        try {
            await this.getUserRef(userId).set(data, { merge: true });
            return { success: true };
        } catch (error) {
            console.error("Error saving user profile:", error);
            return { success: false, error };
        }
    }

    // --- Real-time Subscriptions (Real-time updates) ---
    static subscribeToSubcollection(userId, subcollection, callback) {
        return this.getUserRef(userId)
            .collection(subcollection)
            .onSnapshot(snapshot => {
                const items = [];
                snapshot.forEach(doc => {
                    items.push({ id: doc.id, ...doc.data() });
                });
                callback(items);
            }, error => {
                console.error(`Error subscribing to ${subcollection}:`, error);
            });
    }

    // --- Transactions CRUD ---
    static async addTransaction(userId, data) {
        try {
            const docRef = await this.getUserRef(userId).collection('transactions').add({
                ...data,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error("Error adding transaction:", error);
            return { success: false, error };
        }
    }

    static async updateTransaction(userId, docId, data) {
        try {
            await this.getUserRef(userId).collection('transactions').doc(docId).update({
                ...data,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error("Error updating transaction:", error);
            return { success: false, error };
        }
    }

    static async deleteTransaction(userId, docId) {
        try {
            await this.getUserRef(userId).collection('transactions').doc(docId).delete();
            return { success: true };
        } catch (error) {
            console.error("Error deleting transaction:", error);
            return { success: false, error };
        }
    }

    // --- Accounts CRUD ---
    static async addAccount(userId, data) {
        try {
            const docRef = await this.getUserRef(userId).collection('accounts').add(data);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error("Error adding account:", error);
            return { success: false, error };
        }
    }

    static async updateAccount(userId, docId, data) {
        try {
            await this.getUserRef(userId).collection('accounts').doc(docId).update(data);
            return { success: true };
        } catch (error) {
            console.error("Error updating account:", error);
            return { success: false, error };
        }
    }

    // --- YNAB Category Budgets CRUD ---
    static async setCategoryBudget(userId, category, limit) {
        try {
            await this.getUserRef(userId).collection('budgets').doc(category).set({
                limit: parseFloat(limit) || 0
            });
            return { success: true };
        } catch (error) {
            console.error("Error setting category budget:", error);
            return { success: false, error };
        }
    }

    // --- Subscriptions CRUD ---
    static async addSubscription(userId, data) {
        try {
            const docRef = await this.getUserRef(userId).collection('subscriptions').add({
                ...data,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error("Error adding subscription:", error);
            return { success: false, error };
        }
    }

    static async deleteSubscription(userId, docId) {
        try {
            await this.getUserRef(userId).collection('subscriptions').doc(docId).delete();
            return { success: true };
        } catch (error) {
            console.error("Error deleting subscription:", error);
            return { success: false, error };
        }
    }
}

window.FirestoreManager = FirestoreManager;
