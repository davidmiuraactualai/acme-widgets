import {
  createBrowserRouter,
  isRouteErrorResponse,
  Outlet,
  useRouteError,
  type RouteObject,
} from 'react-router';
import TopNav from './components/TopNav';
import Home from './pages/Home';
import Orders from './pages/Orders';
import Widgets, { widgetsLoader, WidgetsHydrateFallback } from './pages/Widgets';

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
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <TopNav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
    </>
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
        element: <Home />,
        errorElement: <RouteError />,
      },
      {
        path: 'widgets',
        element: <Widgets />,
        loader: widgetsLoader,
        HydrateFallback: WidgetsHydrateFallback,
        errorElement: <RouteError />,
      },
      {
        path: 'orders',
        element: <Orders />,
        errorElement: <RouteError />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
});
