import { Product, ProductCategory } from "../types";

const API_BASE_URL = '/api';

// Helper to transform backend product to frontend Product
const transformProduct = (backendProduct: any): Product => {
  const originalPrice = backendProduct.price_original;
  const discountPrice = backendProduct.price_users;
  
  const discountPercentage = originalPrice > 0 
    ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
    : 0;

  const coordinates = (backendProduct.location && Array.isArray(backendProduct.location) && backendProduct.location.length >= 2)
    ? {
        lat: backendProduct.location[0],
        lng: backendProduct.location[1],
      }
    : undefined;

  return {
    id: backendProduct.id,
    name: backendProduct.name,
    category: backendProduct.category as ProductCategory, // Assuming category strings match enum values
    originalPrice: originalPrice,
    discountPrice: discountPrice,
    expiryDate: backendProduct.exp_date,
    storeName: backendProduct.store, // Use 'store' directly from backend
    storeId: backendProduct.store_id ? backendProduct.store_id.toString() : undefined, // Add storeId, convert to string
    storeLocation: backendProduct.city, // Use city directly from backend
    imageUrl: backendProduct.photo_url,
    discountPercentage: discountPercentage,
    quantity: backendProduct.quantity,
    coordinates: coordinates,
  };
};

export const productService = {
  /**
   * Fetch all products (Simulates GET /products)
   */
  getAllProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    // console.log('Products returned by getAllProducts:', data); // Removed debugging line
    return data.map(transformProduct);
  },

  /**
   * Add a new product (Simulates POST /products)
   */
  addProduct: async (product: Omit<Product, 'id' | 'discountPercentage'> & {store_id: number | null, EAN: string, series: string}): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/add-product`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: product.name,
            series: product.series,
            price_original: product.originalPrice,
            price_users: product.discountPrice,
            exp_date: product.expiryDate,
            EAN: product.EAN,
            category: product.category,
            store_id: product.store_id,
            quantity: product.quantity,
            photo_url: product.imageUrl
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to add product: ${errorBody}`);
    }

    const newProduct = await response.json();
    return transformProduct(newProduct);
  },

  /**
   * Update an existing product (Simulates PUT /products/:id)
   * !!! Backend endpoint not available !!!
   */
  updateProduct: async (updatedProduct: Product): Promise<Product> => {
    console.warn('Backend endpoint for updating products is not available.');
    // Keep original mocked functionality but with a warning
    return updatedProduct;
  },


  /**
   * Delete a product by its ID.
   */
  deleteProduct: async (id: string, keep?: number): Promise<void> => {
    let url = `${API_BASE_URL}/delete-product?product_id=${id}`;
    if (keep !== undefined) {
      url += `&keep=${keep}`;
    }

    const response = await fetch(url);
    // console.log('Delete product response:', response); // Removed debugging line

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to delete product: ${errorBody}`);
    }
  },
};
