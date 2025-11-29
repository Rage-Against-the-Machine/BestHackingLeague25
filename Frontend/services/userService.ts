
import { UserProfile } from "../types";

// --- Mock Data ---
interface UserDatabaseEntry extends UserProfile {
  password: string; // In real app, this would be hashed
}

// Initial in-memory users (Demo Accounts)
let usersInMemory: UserDatabaseEntry[] = [
  {
    id: 'u1',
    email: 'jan@zerowaste.pl',
    password: 'user123',
    name: 'Jan Kowalski',
    role: 'CLIENT'
  },
  {
    id: 's1',
    email: 'sklep@zerowaste.pl',
    password: 'store123',
    name: 'Eko Warzywniak',
    role: 'STORE',
    location: 'ul. Marszałkowska 10, Warszawa'
  }
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  /**
   * Login user by email and password
   */
  login: async (email: string, password: string): Promise<UserProfile> => {
    await delay(500);
    const user = usersInMemory.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error("Użytkownik o podanym adresie email nie istnieje.");
    }

    if (user.password !== password) {
      throw new Error("Błędne hasło.");
    }

    // Return profile without password
    const { password: _, ...profile } = user;
    return profile;
  },

  /**
   * Register new user or store
   */
  register: async (
    email: string, 
    password: string, 
    name: string, 
    role: 'CLIENT' | 'STORE', 
    location?: string
  ): Promise<UserProfile> => {
    await delay(500);
    
    const existing = usersInMemory.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error("Użytkownik o tym adresie email już istnieje.");
    }

    const newUser: UserDatabaseEntry = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role,
      location: role === 'STORE' ? location : undefined
    };

    usersInMemory.push(newUser);

    // Return profile without password
    const { password: _, ...profile } = newUser;
    return profile;
  }
};
