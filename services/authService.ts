
import { UserRole, User } from "../types";

// Mock interface for stored credentials
interface StoredUser {
  email: string;
  name: string;
  passwordHash: string; // simulating security
  role: UserRole;
  // Store additional profile fields for persistence
  additionalData?: Partial<User>;
}

const STORAGE_KEY = 'peerloop_users';
const SESSION_KEY = 'peerloop_session';

// Simulating a hashing function
const simpleHash = async (text: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const authService = {
  async signup(name: string, email: string, password: string, role: UserRole): Promise<boolean> {
    try {
      const existingUsersStr = localStorage.getItem(STORAGE_KEY);
      const users: StoredUser[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];
      
      if (users.find(u => u.email === email)) {
        throw new Error("User already exists");
      }

      const passwordHash = await simpleHash(password);
      
      const newUser: StoredUser = {
        email,
        name,
        passwordHash,
        role
      };

      users.push(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async login(email: string, password: string): Promise<boolean> {
    const existingUsersStr = localStorage.getItem(STORAGE_KEY);
    const users: StoredUser[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];
    
    // In a real DB, we would find by email. Here we filter.
    const user = users.find(u => u.email === email);
    if (!user) return false;

    const inputHash = await simpleHash(password);
    if (user.passwordHash === inputHash) {
      // Create session with ROLE and NAME included
      const role = user.role || UserRole.STUDENT;
      
      localStorage.setItem(SESSION_KEY, JSON.stringify({ 
        email, 
        name: user.name,
        role,
        timestamp: Date.now() 
      }));
      return true;
    }
    return false;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  isAuthenticated(): boolean {
    const session = localStorage.getItem(SESSION_KEY);
    return !!session;
  },

  getCurrentSession(): { email: string, name: string, role: UserRole } | null {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    try {
      const session = JSON.parse(sessionStr);
      return { 
        email: session.email, 
        name: session.name || session.email.split('@')[0],
        role: session.role || UserRole.STUDENT 
      };
    } catch {
      return null;
    }
  },

  // Get extended profile data from storage
  getUserProfile(email: string): Partial<User> | null {
    const existingUsersStr = localStorage.getItem(STORAGE_KEY);
    const users: StoredUser[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];
    const user = users.find(u => u.email === email);
    return user ? { name: user.name, ...user.additionalData } : null;
  },

  // Update user profile in storage
  async updateProfile(email: string, updates: Partial<User>): Promise<boolean> {
    try {
      const existingUsersStr = localStorage.getItem(STORAGE_KEY);
      let users: StoredUser[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];
      
      const userIndex = users.findIndex(u => u.email === email);
      if (userIndex === -1) return false;

      // Update name at root level if present
      if (updates.name) {
        users[userIndex].name = updates.name;
        // Also update current session if it matches
        const currentSession = this.getCurrentSession();
        if (currentSession && currentSession.email === email) {
           localStorage.setItem(SESSION_KEY, JSON.stringify({ 
            ...currentSession,
            name: updates.name
          }));
        }
      }

      // Store other fields in additionalData
      users[userIndex].additionalData = {
        ...users[userIndex].additionalData,
        ...updates
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error("Failed to update profile", error);
      return false;
    }
  }
};
