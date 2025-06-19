import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InputPage from '../../components/InputPage';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// Mock the environment variable
vi.stubEnv('VITE_BACKEND_URL', 'http://localhost:5000');

vi.mock('axios');

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('InputPage', () => {
  it('renders title, textarea, and button', () => {
    renderWithRouter(<InputPage />);
    expect(screen.getByText(/Transform Your Notes into Quizzes!/i)).toBeInTheDocument();
    expect(screen.getByText(/Paste your lecture notes below and generate a custom multiple-choice quiz in seconds./i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Paste your lecture notes here:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate quiz/i })).toBeInTheDocument();
  });

  it('updates textarea value on input', () => {
    renderWithRouter(<InputPage />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test notes' } });
    expect(textarea.value).toBe('Test notes');
  });

  it('disables button and shows loading text when generating', async () => {
    renderWithRouter(<InputPage />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'A'.repeat(60) } });
    const button = screen.getByRole('button', { name: /generate quiz/i });
    fireEvent.click(button);
    expect(button).toBeDisabled();
    await waitFor(() => {
      expect(button.textContent.toLowerCase()).toContain('generating');
    });
  });

  it('shows error message when error state is set', async () => {
    renderWithRouter(<InputPage />);
    // Simulate error by submitting empty textarea
    const button = screen.getByRole('button', { name: /generate quiz/i });
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText(/please enter at least 50 characters/i)).toBeInTheDocument();
    });
  });

  it('calls axios.post and navigates on success', async () => {
    axios.post.mockResolvedValueOnce({ data: { quiz: [{ question: 'Q1', options: ['A', 'B', 'C', 'D'] }] } });
    renderWithRouter(<InputPage />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Some notes that are definitely more than fifty characters long for testing.' } });
    const button = screen.getByRole('button', { name: /generate quiz/i });
    fireEvent.click(button);
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${import.meta.env.VITE_BACKEND_URL}/generate-quiz`,
        { text: 'Some notes that are definitely more than fifty characters long for testing.' }
      );
      expect(mockNavigate).toHaveBeenCalledWith('/quiz', expect.anything());
    });
  });

  it('shows error message on API failure', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { error: 'API error' } } });
    renderWithRouter(<InputPage />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Some notes that are definitely more than fifty characters long for testing.' } });
    const button = screen.getByRole('button', { name: /generate quiz/i });
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText(/api error/i)).toBeInTheDocument();
    });
  });
}); 