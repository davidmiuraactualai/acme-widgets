import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import TopNav from './TopNav';

function renderTopNavAtPath(initialPath: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: (
          <>
            <TopNav />
            <Outlet />
          </>
        ),
        children: [
          { index: true, element: <div data-testid="home-page">Home</div> },
          {
            path: 'widgets',
            element: <div data-testid="widgets-page">Widgets</div>,
          },
          {
            path: 'orders',
            element: <div data-testid="orders-page">Orders</div>,
          },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  );
  return render(<RouterProvider router={router} />);
}

describe('TopNav', () => {
  it('renders three primary nav links', () => {
    renderTopNavAtPath('/');
    const nav = screen.getByRole('navigation', { name: /primary/i });
    expect(within(nav).getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'Widgets' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'Orders' })).toBeInTheDocument();
  });

  it('marks the active link with aria-current="page"', () => {
    renderTopNavAtPath('/widgets');
    const nav = screen.getByRole('navigation', { name: /primary/i });
    expect(within(nav).getByRole('link', { name: 'Widgets' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(nav).getByRole('link', { name: 'Home' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('navigates to /widgets when the Widgets link is clicked', async () => {
    const user = userEvent.setup();
    renderTopNavAtPath('/');
    expect(screen.getByTestId('home-page')).toBeInTheDocument();

    const nav = screen.getByRole('navigation', { name: /primary/i });
    await user.click(within(nav).getByRole('link', { name: 'Widgets' }));

    expect(await screen.findByTestId('widgets-page')).toBeInTheDocument();
  });
});
