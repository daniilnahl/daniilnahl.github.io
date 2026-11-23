---
{
  "title": "Stock Tracking App",
  "summary": "A Python stock tracker with a CLI, a local API, and a dashboard.",
  "role": "Developer",
  "technologies": [
    "Python",
    "Typer",
    "Rich",
    "FastAPI",
    "SQLite",
    "React"
  ],
  "repository": "https://github.com/daniilnahl/Stock-Tracking-App",
  "tags": [
    "software"
  ],
  "featured": false,
  "placeholder": false,
  "dates": "Oct 22, 2024 – Oct 22, 2026",
  "dateLabel": "Repository activity"
}
---

A stock-tracking project with a Python CLI, a FastAPI local API, and a React dashboard. The CLI lets me add, remove, view, and refresh saved stocks.

## Storage and interfaces
Watchlists are stored in SQLite. The local API uses bearer authentication, and the dashboard reads saved entries in light or dark mode. The dashboard is bundled with the Python package, so running it doesn’t require a separate frontend build.

The dashboard and API don’t edit holdings. Provider-backed history and upcoming-EPS requests are optional and gated separately. It doesn’t search for stocks or make recommendations.

The repo includes the setup instructions, API contracts, persistence and migration details, and offline tests.

[Code and setup](https://github.com/daniilnahl/Stock-Tracking-App)
