---
title: Logs
---

# Logs

The **Logs** page in wp-admin shows the recorded 404 hits. Every URL the
plugin couldn't resolve appears here with full request context — referer,
IP, user-agent, hit count and first/last-seen timestamps.

What gets recorded is controlled by the
[Log settings](/404-to-301/log-settings).

- **This page** — the list view, statuses, filtering and searching.
- **[Log actions](/404-to-301/logs/actions)** — per-row and bulk actions,
  where the data lives, and keeping the table small.

[[toc]]

## The list view

| Column | What it means |
| --- | --- |
| **404 Path** | The URL the visitor tried to reach. |
| **Referrer** | The page they were on before hitting the 404. Empty when typed directly or arrived via an unknown source. |
| **IP Address** | The visitor's IP (empty if `Mask IP addresses` is on or the request had no resolvable address). |
| **User Agent** | The browser / bot string. |
| **Hits** | Total times this URL has 404'd. |
| **Status** | Workflow state — `Open`, `Ignored`, `Fixed`, or `Custom redirect`. |
| **First seen** | When the URL first 404'd. |
| **Last hit** | When it last 404'd. |

## Statuses

- **Open** — the default. The URL is 404ing and nothing has been done about
  it.
- **Ignored** — you decided this URL isn't worth fixing (a typo bot, a
  scanner pattern, etc.) and don't want to see it surface in dashboards.
- **Fixed** — you addressed the source of the 404 (typo fixed, slug
  restored). The row is kept for history but visually marked as resolved.
- **Custom redirect** — the URL now has a matching row on the
  [Redirects page](/404-to-301/redirects/). The status is set automatically
  when you promote a log to a redirect; manual edits aren't usually needed.

## Filtering and searching

The toolbar above the table supports:

- **Search** — substring match across URL, referer, and user-agent.
- **Status filter** — narrow to Open, Ignored, Fixed, or Custom-redirect rows.
- **Per-page selector** — switch the page size.

The current filter and search state lives in the URL, so dashboards can be
bookmarked and shared.
