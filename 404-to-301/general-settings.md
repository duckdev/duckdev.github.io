---
title: General Settings
---

# General Settings

The **General** tab on the Settings page controls site-wide behaviour that
applies to every 404 the plugin sees. None of these options touches the
list of redirects or the log table directly — they shape how requests reach
those subsystems in the first place.

The tab is split into two panels: **Behaviour** (four toggles) and
**Exclude paths** (a repeater).

[[toc]]

## Behaviour

[![Behaviour](/404-to-301/settings/behaviour-settings.png)](/404-to-301/settings/behaviour-settings.png)

### Disable WordPress URL guessing

**Setting key:** `disable_guessing` &middot; **Default:** `On`

WordPress tries to be helpful: when a URL doesn't match any post, it scans
your content for the closest matching slug and silently 301-redirects the
visitor there. That's the `redirect_canonical` filter at work.

With this toggle on, the plugin returns `false` from `redirect_canonical`
and that guessing is skipped — the request becomes a real 404 and flows
through the plugin's normal action chain (log → email → redirect).

::: tip Why this exists
WordPress's guessing makes 404 reporting unreliable. With guessing on, broken
links to `/about-uss` silently land on `/about-us` and never appear in your
logs even though they are mistakes you'd want to fix at the source. Turning
guessing off makes your 404 data accurate.
:::

The plugin still honours the `?p=ID` shortlink form — when WordPress is
resolving a post by numeric ID, the filter is left alone so direct post-ID
links keep working.

### Monitor post slug changes

**Setting key:** `monitor_post_slug` &middot; **Default:** `Off`

When on, the plugin watches for post/page slug renames and automatically
creates a redirect from the old URL to the new one. The created redirect
appears in the Redirects list and behaves exactly like a manual entry —
you can edit it, disable it, or delete it later.

This is the easiest way to avoid 404s when you rename existing content.

### Mask IP addresses

**Setting key:** `mask_ip` &middot; **Default:** `Off`

Drops the visitor IP before it reaches the database. Logs are still
created, but the `ip` column stays empty. Useful for GDPR-conscious
deployments where you want 404 telemetry without the personally identifying
data.

The mask happens inside `Request::ip()`, so any downstream code that reads
the IP (custom filters, the email body, exported CSV rows) sees the empty
value too — there is no second copy to forget about.

### Track admin 404s

**Setting key:** `track_admin_404` &middot; **Default:** `Off`

By default the plugin does nothing on wp-admin requests — admin 404s are
almost always uninteresting (deleted admin pages, deprecated query
parameters, etc.) and they shouldn't pollute the log table or trigger
redirects.

Turn this on if you specifically want to log and act on admin-side 404s
too. When off, the dispatcher bails the moment `is_admin()` is true.

## Exclude paths

[![Exclude Paths](/404-to-301/settings/exclude-paths.png)](/404-to-301/settings/exclude-paths.png)

**Setting key:** `exclude_paths` &middot; **Default:** empty list

A repeater of substrings. Any 404 whose URL contains any of the listed
substrings is skipped entirely — no log row, no email, no redirect.

Use it for traffic you know you don't care about:

- `/wp-json/` — REST probes from bots and integrations.
- `/feed/` — defunct RSS endpoints.
- `.well-known/` — robots.txt-style discovery probes.
- `/xmlrpc.php` — legacy XML-RPC noise.

The match is a simple `strpos()` substring check (the URL is normalised
first), not a regex. Empty rows are dropped at save time, so adding a row
to type into and leaving it blank is safe.

::: info How matching works
The check runs in `Request::is_excluded()` and is called at the top of
every action in the chain — Log, Email and Redirect each ask the request
whether it's excluded before doing any work. That means an excluded URL
truly costs the plugin nothing past the substring scan.
:::
