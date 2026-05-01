# Information Architecture

The Acme Widgets site is intentionally small. There are three top-level routes,
no auth, and no nested navigation. Anyone landing on the home page should be
able to find a widget or learn how to order one within a single click.

## Route map

| Path       | Purpose                                                                                          |
|------------|--------------------------------------------------------------------------------------------------|
| `/`        | Home page advertising Acme Widgets — widgets for all purposes and occasions.                     |
| `/widgets` | Listing of every widget for sale, sourced from `public/data/widgets.csv`.                        |
| `/orders`  | Placeholder explaining that online orders are coming soon; meanwhile, email `sales@acmewidgets.com`. |

## Navigation

A single top-level navigation surfaces all three routes from every page. There
is no breadcrumb, no sidebar, and no per-widget detail page. If a future
feature needs deeper nesting (e.g. `/widgets/:id`), capture the change in a
new ADR before adding it.

## Routing implementation

See [`0001.ADR.TECH_STACK.md`](../decision-records/0001.ADR.TECH_STACK.md)
for the choice of React Router v7 (data router). Routes are declared in a
single `routes.tsx` module so trainees can see the entire information
architecture in one file.
