
import { Product, ProductCategory } from "../types";

// In-memory "Database"
let productsInMemory: Product[] = [];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  /**
   * Fetch all products (Simulates GET /products)
   */
  getAllProducts: async (): Promise<Product[]> => {
    await delay(300); // Simulate network latency
    return [...productsInMemory];
  },

  /**
   * Add a new product (Simulates POST /products)
   */
  addProduct: async (product: Product): Promise<Product> => {
    await delay(300);
    // Ensure unique ID if not provided
    const newProduct = { 
        ...product, 
        id: product.id || Date.now().toString() 
    };
    productsInMemory.unshift(newProduct); // Add to top
    return newProduct;
  },

  /**
   * Update an existing product (Simulates PUT /products/:id)
   */
  updateProduct: async (updatedProduct: Product): Promise<Product> => {
    await delay(300);
    const index = productsInMemory.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      productsInMemory[index] = updatedProduct;
      return updatedProduct;
    }
    throw new Error(`Product with id ${updatedProduct.id} not found`);
  },

  /**
   * Delete a product (Simulates DELETE /products/:id)
   */
  deleteProduct: async (id: string): Promise<void> => {
    await delay(300);
    const initialLength = productsInMemory.length;
    productsInMemory = productsInMemory.filter(p => p.id !== id);
    
    if (productsInMemory.length === initialLength) {
        throw new Error(`Product with id ${id} not found`);
    }
  },

  /**
   * Initialize with some sample data if empty (Optional, for demo)
   */
  initializeDemoData: async () => {
    if (productsInMemory.length === 0) {
       // Only add data if empty to prevent duplicates on hot reload
       // We leave this empty based on user request to remove mocks, 
       // but the structure exists if needed.
    }
  }
};
