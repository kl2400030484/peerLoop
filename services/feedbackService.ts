
import { Feedback } from "../types";

const FEEDBACK_STORAGE_KEY = 'peerloop_feedbacks';

export const feedbackService = {
  getFeedbacks(): Feedback[] {
    try {
      const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse feedbacks", e);
      return [];
    }
  },

  addFeedback(userName: string, message: string, role?: string): Feedback {
    const feedbacks = this.getFeedbacks();
    const newFeedback: Feedback = {
      id: `fb-${Date.now()}`,
      userName,
      role,
      message,
      timestamp: new Date().toISOString()
    };
    
    // Add to beginning of array (newest first)
    const updatedFeedbacks = [newFeedback, ...feedbacks];
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updatedFeedbacks));
    return newFeedback;
  }
};
