---
title: Log Actions
---

# Log Actions

What you can do with recorded 404s — individually or in bulk — plus where
the data lives and how to keep the table from growing forever.

For the list view, columns, statuses and filtering, see
[Logs](/404-to-301/logs/).

[[toc]]

## Row actions

Each row's overflow menu offers:

- **View** — opens a side panel with the full request context (all headers,
  the resolved IP, the User-Agent, the hit timeline).
- **Add a custom redirect** — pre-fills the source URL in the redirect
  editor so you only need to enter the destination. Saves a click compared
  to opening the [Redirects page](/404-to-301/redirects/) manually.
- **Mark as fixed** — set the row's status to `Fixed`.
- **Mark as ignored** — set the row's status to `Ignored`.
- **Reopen** — flip a `Fixed` / `Ignored` row back to `Open`.
- **Delete** — remove the row from the log table. Permanent.

## Bulk actions

Select rows with the checkboxes and the bulk action bar appears. You can
mass-delete, mass-mark fixed/ignored, or mass-reopen the selection.

## Exporting logs

To download the log table as a CSV — honouring your current search and
status filters — install the **[Logs Exporter](/404-to-301/addons/logs-exporter)**
add-on. It adds an export control to this page.

## Where the data lives

Every 404 ends up in the `wp_404_to_301_logs` table. The plugin writes via
the Log action on `template_redirect` — see the
[`404_to_301_pre_log_insert`](/404-to-301/developer-docs#404_to_301_pre_log_insert)
filter if you need to alter the row payload before it lands.

## Keeping the table small

The core plugin doesn't auto-prune. The
**[Logs Cleaner](/404-to-301/addons/logs-cleaner)** add-on adds:

- Delete rows older than N days.
- Cap the table at N rows (oldest first).
- A scheduled cleaner that runs on a recurring interval.

The promo at the bottom of the [Log settings](/404-to-301/log-settings) tab
links to it directly.
