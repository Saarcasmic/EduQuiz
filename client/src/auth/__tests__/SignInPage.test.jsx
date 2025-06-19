import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInPage from '../SignInPage';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider } from '../../context/AuthContext';

// Mock the environment variable
vi.stubEnv('VITE_BACKEND_URL', 'http://localhost:5000');

// Move mockNavigate and vi.mock to top-level
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderWithProviders = (ui) => {
  return render(
    <AuthProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthProvider>
  );
};

describe('SignInPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders email, password fields, and sign in button', () => {
    renderWithProviders(<SignInPage />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('updates email and password fields on input', () => {
    renderWithProviders(<SignInPage />);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(emailInput.value).toBe('user@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('disables button and shows loading text when signing in', async () => {
    renderWithProviders(<SignInPage />);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    const button = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(button);
    expect(button).toBeDisabled();
    await waitFor(() => {
      expect(button.textContent.toLowerCase()).toContain('signing in');
    });
  });

  it('calls axios.post and navigates on success', async () => {
    axios.post.mockResolvedValueOnce({ data: { access_token: 'token', user: { email: 'user@example.com' } } });
    renderWithProviders(<SignInPage />);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    const button = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(button);
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signin`,
        { email: 'user@example.com', password: 'password123' }
      );
      expect(mockNavigate).toHaveBeenCalledWith('/input');
    });
  });

  it('shows error message on API failure', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { error: 'Invalid credentials' } } });
    renderWithProviders(<SignInPage />);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    const button = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
}); 