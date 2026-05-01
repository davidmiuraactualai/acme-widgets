# Personas

Acme Widgets serves three personas. None of them have accounts in the current
system — the site is anonymous and read-only — but the personas still drive
how the catalog is organized and how copy is written.

## Customers

Everyone needs widgets. Customers range from kids buying a first widget to
elderly buyers replacing a long-loved one, and they shop both for personal
use and for business. The catalog must be browseable without a tutorial and
should communicate purpose and occasion clearly.

**What customers do on the site:** browse `/widgets`, decide they want one,
follow the instructions on `/orders` to email sales.

## Producers

The people who make widgets and sell them through Acme Widgets. This includes
handcrafted artisanal makers, manufacturers of high-precision widgets, and
specialty producers for particular occasions and purposes.

**What producers do on the site:** producers do not interact with the live
site directly. They submit catalog entries by editing `public/data/widgets.csv`
in a pull request. An employee reviews and merges.

## Employees

People who work for Acme Widgets, buying widgets from producers and selling to
customers.

**What employees do on the site:** employees own the catalog. They review
producer PRs against `widgets.csv`, merge them, and respond to orders sent to
`sales@acmewidgets.com`.

## Why this matters for the codebase

Because there is no auth and no per-persona UI, persona differences show up in
**copy and catalog structure**, not in conditional rendering. When adding new
content, ask which persona it serves and whether the existing IA
(`/`, `/widgets`, `/orders`) is the right home for it.
