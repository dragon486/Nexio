import { markAsRead as markLeadAsRead, markAllAsRead as markAllLeadsAsRead } from './leadService';
import { markAsRead as markNotifyAsRead, markAllAsRead as markAllNotifsAsRead } from './notificationService';

/**
 * SyncManager.js
 * Lightweight Optimistic UI + Background Retry System (V1)
 */

const RETRY_DELAY_MS = [2000, 5000, 10000]; // 2s, 5s, 10s backoff
const MAX_ATTEMPTS = RETRY_DELAY_MS.length;
const STORAGE_KEY = 'nexio_sync_queue';

class SyncManager {
    constructor() {
        this.queue = this.loadQueue();
        this.isProcessing = false;
        
        // Initial process on load
        if (this.queue.length > 0) {
            console.log(`[Sync] Found ${this.queue.length} pending actions on load.`);
            setTimeout(() => this.processQueue(), 2000);
        }
    }

    loadQueue() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("[Sync] Failed to load queue:", e);
            return [];
        }
    }

    saveQueue() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
        } catch (e) {
            console.error("[Sync] Failed to save queue:", e);
        }
    }

    /**
     * Adds an action to the sync queue.
     * @param {Object} action { type: 'mark_as_read' | 'mark_all_read', target: 'lead' | 'notification', id?: string }
     */
    async addAction(action) {
        const syncItem = {
            ...action,
            id: action.id || 'all',
            attempts: 0,
            createdAt: Date.now()
        };

        this.queue.push(syncItem);
        this.saveQueue();
        
        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    async processQueue() {
        if (this.queue.length === 0 || this.isProcessing) return;

        this.isProcessing = true;
        const currentItem = this.queue[0];

        try {
            console.log(`[Sync] Attempting ${currentItem.type} for ${currentItem.target} (${currentItem.id}). Attempt: ${currentItem.attempts + 1}`);
            
            if (currentItem.type === 'mark_all_read') {
                if (currentItem.target === 'lead') await markAllLeadsAsRead();
                else await markAllNotifsAsRead();
            } else {
                if (currentItem.target === 'lead') await markLeadAsRead(currentItem.id);
                else await markNotifyAsRead(currentItem.id);
            }

            // Success: Remove from queue
            console.log(`[Sync] Successfully synced ${currentItem.type}.`);
            this.queue.shift();
            this.saveQueue();
        } catch (error) {
            currentItem.attempts++;
            
            if (currentItem.attempts >= MAX_ATTEMPTS) {
                console.log(`[Sync] Max attempts reached for ${currentItem.type}. Giving up.`);
                this.queue.shift();
            } else {
                const delay = RETRY_DELAY_MS[currentItem.attempts - 1];
                console.log(`[Sync] Failed. Retrying in ${delay}ms...`);
                // Move item to end of queue if multi-item, or just wait if single
                this.queue.shift();
                this.queue.push(currentItem);
            }
            this.saveQueue();
        }

        this.isProcessing = false;

        // Process next item or retry current after delay
        if (this.queue.length > 0) {
            const nextDelay = this.isProcessing ? 0 : 2000;
            setTimeout(() => this.processQueue(), nextDelay);
        }
    }
}

export const syncManager = new SyncManager();
