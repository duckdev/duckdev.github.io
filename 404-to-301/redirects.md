---
title: Redirects
---

# Redirects

The **Redirects** page in wp-admin manages the list of per-URL redirects.
Each row tells the plugin: "when a 404 comes in for this source URL, send
the visitor to this destination using this HTTP status."

Custom redirects always win over the [global fallback](/404-to-301/redirect-settings).

[[toc]]

## The list view

Each row in the table shows:

| Column | What it means |
| --- | --- |
| **Source URL** | The URL (path) that should trigger the redirect when a 404 fires. |
| **Destination** | Where matching requests are sent. |
| **Type** | HTTP status code (`301`, `302`, `307`). |
| **Match** | How `Source URL` is compared to the request (`Exact`, `Prefix`, or `Regex`). |
| **Status** | Whether the row is `Active` or `Disabled`. Disabled rows are skipped during the lookup. |
| **Hits** | Number of times this redirect has fired. |
| **Last hit** | When it last fired. |
| **Created** | When the row was created. |

Use the search bar above the table to filter by source URL. The list paginates
once you have more than a screen's worth of rows.

## Adding a redirect

Click **Add new** to open the editor. Fill in the fields below.

### Source URL

The URL (or pattern) the plugin will look for when a 404 fires. Always a
relative path beginning with `/` — the host is implicit.

Examples:

- `/old-product` — single-URL redirect.
- `/blog/2018/` — a prefix or regex when paired with the matching mode below.

### Destination

Where matching requests are sent. Three forms are accepted:

- **An absolute URL** — `https://example.com/landing` — external or internal,
  scheme required.
- **A site-relative path** — `/new-product` — resolved against your site URL.
- **A page ID** when the row's target type is set to `page` — the plugin
  resolves the permalink at redirect time, so the destination follows the
  page even if its slug changes later.

### Type

HTTP status code used for the redirect.

- **`301` Moved Permanently** — the default, and the right SEO answer for
  pages that have genuinely moved or been removed.
- **`302` Found** — temporary move, search engines keep the source URL.
- **`307` Temporary Redirect** — like 302 but the request method is
  preserved. Rarely needed for content redirects.

### Match

How the source URL is compared to the incoming request.

| Mode | What it does | Example |
| --- | --- | --- |
| **Exact** | Only the literal source URL triggers the redirect. The default. | `/old-product` matches `/old-product` but not `/old-product/` or `/old-product?ref=x`. |
| **Prefix** | Any URL that starts with the source triggers the redirect, and the remainder of the path is preserved if the destination supports it. | `/blog/2018/` matches `/blog/2018/launch` and `/blog/2018/anything-else`. |
| **Regex** | The source is treated as a PHP regular expression (without delimiters). Most flexible, also the most expensive — use sparingly on busy sites. | `^/news/\d{4}/(.*)$` |

Always test regex sources on a staging site first. A malformed regex is
caught and the row is skipped at lookup time, but a regex that matches more
than you intended can silently redirect live traffic.

### Status

`Active` rows are evaluated on every 404. `Disabled` rows are skipped — use
this to take a redirect out of rotation without deleting and re-creating it.

## Editing and deleting

Click the row's overflow menu (the three dots) to edit, disable, or delete
it. Deleting is permanent — the row is removed from the database, but the
matching log rows (if any) are left in place.

## Promoting a log entry to a redirect

The fastest way to fix a known broken URL is to redirect it directly from
the Logs page. Open the log row and choose **Add a custom redirect** —
the source URL is pre-filled and you only need to enter the destination.
See the [Logs page](/404-to-301/logs#actions) for the full action list.

## Bulk actions

Select rows with the checkboxes in the leftmost column and the bulk actions
bar appears at the top. You can mass-delete, mass-enable, or mass-disable
the selection in one operation.

## REST API

Every action available in the UI maps to a REST endpoint under
`/wp-json/d404/v1/redirects`. The endpoints require the
`d404_manage_redirects` capability (filterable — see the
[developer docs](/404-to-301/developer-docs#404_to_301_capability)).
