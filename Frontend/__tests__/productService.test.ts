// __tests__/productService.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest';
import { productService } from '../services/productService';
import { Product, ProductCategory } from '../types';

// Mock global fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('productService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('getAllProducts should fetch products from the correct endpoint', async () => {
    // Arrange
    const mockProducts = [
      {
        id: '1',
        name: 'Milk',
        category: ProductCategory.DAIRY,
        price_original: 3.5,
        price_users: 2.8,
        exp_date: '2025-12-31',
        store: 'Biedronka',
        city: 'Warsaw',
        photo_url: 'http://example.com/milk.jpg',
        quantity: 10,
        location: [52.2297, 21.0122],
      },
    ];
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    });

    // Act
    await productService.getAllProducts();

    // Assert
    expect(fetchMock).toHaveBeenCalledWith('/api/products');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('deleteProduct should send a request to the correct endpoint', async () => {
    // Arrange
    fetchMock.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(''),
    });
    const productId = '123';

    // Act
    await productService.deleteProduct(productId);

    // Assert
    expect(fetchMock).toHaveBeenCalledWith(`/api/delete-product?product_id=${productId}`);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
