import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { AuthProvider } from '../../context/AuthContext';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Move mockNavigate and vi.mock to top-level
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// Helper to render with context and router
const renderWithProviders = (ui) => {
  return render(
    <AuthProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthProvider>
  );
};

describe('Header (logged out)', () => {
  it('renders Sign In and Sign Up buttons when not authenticated', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });
});

describe('Header (logged in)', () => {
  beforeEach(() => {
    // Mock localStorage for AuthProvider
    localStorage.setItem('access_token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ email: 'test@example.com' }));
    mockNavigate.mockClear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it('shows profile icon and user email in dropdown', () => {
    renderWithProviders(<Header />);
    // Profile icon should be present
    expect(screen.getByLabelText(/open user menu/i)).toBeInTheDocument();
    // Open dropdown
    fireEvent.click(screen.getByLabelText(/open user menu/i));
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('toggles dropdown on profile icon click', () => {
    renderWithProviders(<Header />);
    const profileBtn = screen.getByLabelText(/open user menu/i);
    // Dropdown should not be visible initially
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    // Click to open
    fireEvent.click(profileBtn);
    expect(screen.getByText('Logout')).toBeInTheDocument();
    // Click again to close
    fireEvent.click(profileBtn);
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('logs out and navigates to /signin on logout click', () => {
    renderWithProviders(<Header />);
    fireEvent.click(screen.getByLabelText(/open user menu/i));
    fireEvent.click(screen.getByText('Logout'));
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });
}); 