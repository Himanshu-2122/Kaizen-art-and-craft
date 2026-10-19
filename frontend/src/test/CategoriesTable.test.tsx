import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CategoriesTable from '../pages/admin/components/CategoriesTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import api from '@/lib/api';

const mockCategories = [
  {
    _id: 'cat-1',
    name: 'Wall Art',
    slug: 'wall-art',
    description: 'Beautiful handcrafted wall art',
    imageUrl: 'https://images.unsplash.com/wall-art',
    isActive: true,
  },
  {
    _id: 'cat-2',
    name: 'Clay Pottery',
    slug: 'clay-pottery',
    description: 'Traditional terracotta craft',
    imageUrl: '',
    isActive: false,
  },
];

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

window.URL.createObjectURL = vi.fn(() => 'mock-category-url');
window.URL.revokeObjectURL = vi.fn();
window.confirm = vi.fn(() => true);

describe('CategoriesTable Admin Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
      },
    });

    (api.get as any).mockImplementation((url: string) => {
      if (url === '/categories') {
        return Promise.resolve({ data: mockCategories });
      }
      return Promise.resolve({ data: [] });
    });

    (api.post as any).mockImplementation(() =>
      Promise.resolve({
        data: {
          _id: 'cat-3',
          name: 'Brass Sculptures',
          slug: 'brass-sculptures',
          description: 'Handmade metal pieces',
          isActive: true,
        },
      })
    );
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CategoriesTable />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('renders the creation form and category list', async () => {
    renderComponent();

    expect(screen.getByText('Create New Category')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Wall Decor, Solid Wood Furniture/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Wall Art')).toBeInTheDocument();
      expect(screen.getByText('Clay Pottery')).toBeInTheDocument();
    });

    expect(screen.getByText('Categories Directory (2)')).toBeInTheDocument();
    expect(screen.getAllByText('Active').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Inactive').length).toBeGreaterThanOrEqual(1);
  });

  it('can fill and submit the new category form', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = screen.getByPlaceholderText(/Wall Decor, Solid Wood Furniture/i);
    await user.type(nameInput, 'Brass Sculptures');

    const descInput = screen.getByPlaceholderText(/Short description for collection banners/i);
    await user.type(descInput, 'Handmade metal pieces');

    const submitBtn = screen.getByRole('button', { name: /Create Category/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/categories',
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({ 'Content-Type': 'multipart/form-data' }),
        })
      );
    });
  });

  it('filters categories by search input', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Wall Art')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Filter categories...');
    await user.type(searchInput, 'Pottery');

    expect(screen.queryByText('Wall Art')).not.toBeInTheDocument();
    expect(screen.getByText('Clay Pottery')).toBeInTheDocument();
  });

  it('populates form for editing when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Wall Art')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByTitle('Edit category');
    await user.click(editButtons[0]);

    expect(screen.getByText('Edit Category')).toBeInTheDocument();
    const nameInput = screen.getByPlaceholderText(/Wall Decor, Solid Wood Furniture/i) as HTMLInputElement;
    expect(nameInput.value).toBe('Wall Art');
    expect(screen.getByRole('button', { name: /Update Category/i })).toBeInTheDocument();
  });
});
