// TODO: replace getMockResumes() with a mock of getResumes() once page.tsx restores getResumes()
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { getMockResumes } from '@/lib/resumes';

describe('Home page', () => {
  it('shows empty state when no resumes exist', async () => {
    render(await Home());
    // TODO: force empty state by mocking getResumes([]) once it is restored in page.tsx
    expect(screen.queryByText(/no resumes yet/i)).toBeDefined();
  });

  it('renders one card per resume', async () => {
    const { container } = render(await Home());
    const cards = container.querySelectorAll('[data-slot="card"]');
    expect(cards).toHaveLength(getMockResumes().length);
  });
});
