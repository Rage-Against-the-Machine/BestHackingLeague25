import { UserProfile } from "../types";

const API_BASE_URL = '/api';

export const userService = {
  loginUser: async (username: string, password: string): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/validate-user?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
    if (!response.ok) {
        throw new Error('Failed to validate user');
    }
    const validationResult = await response.json();

    if (validationResult['validated?'] === 'true') {
        const userProfileResponse = await userService.getUser(username); // Using the existing getUser function
        return {
            id: userProfileResponse.username, // Assuming username can serve as ID
            email: userProfileResponse.email,
            name: userProfileResponse.username, // Assuming name is username for clients
            role: 'CLIENT', // Assuming validated users are clients for login
        };
    } else {
        throw new Error("Invalid username or password.");
    }
  },

  loginStore: async (name: string, password: string): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/validate-store?name=${encodeURIComponent(name)}&password=${encodeURIComponent(password)}`);
    if (!response.ok) {
        throw new Error('Failed to validate store');
    }
    const validationResult = await response.json();

    if (validationResult['validated?'] === 'true' && validationResult['id'] !== undefined) {
        // The /validate-store endpoint now returns the 'id' (numeric)
        return {
            id: validationResult['id'].toString(), // Use the returned ID, convert to string
            email: `${name.toLowerCase().replace(/\s/g, '')}@store.com`, // Placeholder email
            name: name,
            role: 'STORE',
            storeId: validationResult['id'].toString(), // Store the ID here, convert to string
        };
    } else {
        throw new Error("Invalid store name or password.");
    }
  },

  login: async (username: string, password: string, role: 'CLIENT' | 'STORE'): Promise<UserProfile> => {
    if (role === 'STORE') {
      return await userService.loginStore(username, password);
    } else {
      return await userService.loginUser(username, password);
    }
  },

  /**
   * Register new user or store
   */
  register: async (
    name: string, // For client, this is username
    password: string,
    role: 'CLIENT' | 'STORE',
    location?: string,
    email?: string // For client, this is their email
  ): Promise<UserProfile> => {
    if (role === 'STORE') {
        if (!location) throw new Error('Location is required for stores.');        
        // Assuming location is "lat,lng"
        const locationCoords = location.split(',').map(coord => parseFloat(coord.trim()));

        const response = await fetch(`${API_BASE_URL}/add-store`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                location: locationCoords,
                password: password, // Assuming backend accepts a 'password' field
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to register store: ${errorBody}`);
        }
        
        // The /add-store endpoint doesn't return the user profile.
        // We'll return a basic profile based on the input.
        // Generating a placeholder email for now as it's part of UserProfile.
        return {
            id: name, // Assuming name can serve as ID for stores
            email: `${name.toLowerCase().replace(/\s/g, '')}@store.com`, 
            name: name,
            role: 'STORE',
            location: location,
        };

    } else { // Client registration
        if (!email) throw new Error('Email is required for client registration.');

        const response = await fetch(`${API_BASE_URL}/add-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: name, // Assuming name is username for client
                email: email,
                password: password,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to register client: ${errorBody}`);
        }

        const newUser = await response.json();
        return {
            id: newUser.username, // Assuming username can serve as ID
            email: newUser.email,
            name: newUser.username, // Assuming name is username
            role: 'CLIENT',
        };
    }
  },

  /**
   * Get user data by username
   */
  getUser: async (username: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/get-user?username=${encodeURIComponent(username)}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }
    return await response.json();
  },

  /**
   * Generate QR code for a user
   */
  generateQr: async (username: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/generate-qr?username=${encodeURIComponent(username)}`);
    if (!response.ok) {
        throw new Error('Failed to generate QR code');
    }
    return await response.json();
  },

  /**
   * Buy a product
   */
  buyProduct: async (code: string, productId: string, quantity: number, storeId: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/buy-product`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            code,
            product_id: productId,
            quantity,
            store_id: storeId,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to buy product: ${errorBody}`);
    }
    return await response.json();
  },
};