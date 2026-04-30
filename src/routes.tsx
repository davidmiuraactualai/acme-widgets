import {
  createBrowserRouter,
  isRouteErrorResponse,
  Outlet,
  useRouteError,
  type RouteObject,
} from 'react-router';

function RouteError() {
  const error = useRouteError();
  const isDev = import.meta.env.DEV;

  let title = 'Something went wrong';
  let detail = 'Please try again later.';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    detail =
      error.status === 404
        ? "We couldn't find that page."
        : (error.data ?? detail);
  } else if (isDev && error instanceof Error) {
    detail = error.message;
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-ink">{title}</h1>
      <p className="mt-4 text-ink-soft">{detail}</p>
    </section>
  );
}

function RootLayout() {
  return (
    <>
      <header className="border-b border-ink-soft/20">
        <div className="max-w-6xl mx-auto px-6 py-4 text-ink-soft">
          nav goes here
        </div>
      </header>
      <main id="main">
        <Outlet />
      </main>
    </>
  );
}

function HomePlaceholder() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Acme Widgets</h1>
      <p className="mt-4 text-ink-soft">Home placeholder.</p>
    </section>
  );
}

function WidgetsPlaceholder() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Widgets</h1>
      <p className="mt-4 text-ink-soft">Catalog placeholder.</p>
    </section>
  );
}

function OrdersPlaceholder() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Orders</h1>
      <p className="mt-4 text-ink-soft">Orders placeholder.</p>
    </section>
  );
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <HomePlaceholder />,
        errorElement: <RouteError />,
      },
      {
        path: 'widgets',
        element: <WidgetsPlaceholder />,
        errorElement: <RouteError />,
      },
      {
        path: 'orders',
        element: <OrdersPlaceholder />,
        errorElement: <RouteError />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
});
