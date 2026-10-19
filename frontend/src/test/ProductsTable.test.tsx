import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ProductsTable from '../pages/admin/components/ProductsTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: { products: [] } })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

window.URL.createObjectURL = vi.fn(() => 'mock-url');

const queryClient = new QueryClient();

describe('ProductsTable', () => {
  it('renders without crashing', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ProductsTable />
        </AuthProvider>
      </QueryClientProvider>
    );
    expect(screen.getByText('Add New Product')).toBeInTheDocument();
  });

  it('can fill and submit the new product form', async () => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ProductsTable />
        </AuthProvider>
      </QueryClientProvider>
    );

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    await user.type(screen.getByPlaceholderText('Product Name'), 'New Test Product');
    await user.selectOptions(screen.getByLabelText('Category *'), 'wall-art');
    await user.type(screen.getByPlaceholderText('Retail Price'), '150');
    await user.type(screen.getByPlaceholderText('MRP Price'), '250');
    await user.type(screen.getByPlaceholderText('e.g. Canvas, Ceramic, Cotton'), 'Canvas');
    await user.type(screen.getByPlaceholderText('e.g. Matte, Glazed, Embroidered'), 'Matte');
    await user.type(screen.getByPlaceholderText('Length'), '20');
    await user.type(screen.getByPlaceholderText('Width'), '20');
    await user.type(screen.getByPlaceholderText('Height'), '20');
    await user.type(screen.getByPlaceholderText('Net Weight'), '15');
    await user.type(screen.getByPlaceholderText('e.g. 12'), '24');
    await user.type(screen.getByPlaceholderText('Small, Medium, Large'), 'Standard');
    await user.type(screen.getByPlaceholderText('Product Description...'), 'New Description');
    await user.selectOptions(screen.getByLabelText('Storage Type *'), 'Without Storage');

    const fileInput = screen.getByTestId('file-input');
    await user.upload(fileInput, file);

    await user.click(screen.getByText('Add Product'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
  });
});
