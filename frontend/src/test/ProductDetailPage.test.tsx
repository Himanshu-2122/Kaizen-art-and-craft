import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductDetailPage from '../pages/ProductDetailPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockProduct = {
  name: 'Test Product',
  description: 'Test Description',
  price: 100,
  mrpPrice: 200,
  images: ['/test.jpg'],
  sizes: ['Small', 'Medium'],
  storageType: 'Box Storage',
  materialType: 'Wood',
  finishType: 'Matte',
  dimensions: { length: 10, width: 10, height: 10 },
  netWeight: 10,
  warrantyMonths: 12,
  averageRating: 4.5,
  numReviews: 10,
  reviews: [],
};

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: mockProduct })),
  },
}));

vi.mock('@/lib/utils', () => ({
  getImageUrl: (path: string) => `http://localhost:5000${path}`,
  cn: (...inputs: any[]) => inputs.join(' '),
}));

const queryClient = new QueryClient();

describe('ProductDetailPage', () => {
  it('renders product details after loading', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/product/test-product']}>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Routes>
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                </Routes>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    
    const priceSection = screen.getByText('Inclusive of all taxes').parentElement;
    expect(within(priceSection!).getByText('₹100')).toBeInTheDocument();
  });
});
