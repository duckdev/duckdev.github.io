---
title: Redirect Settings
---

# Redirect Settings

The **Redirects** tab on the Settings page configures the **global fallback
redirect** — what happens when a 404 fires for a URL that has *no* matching
custom redirect on the [Redirects page](/404-to-301/redirects).

Custom redirects always win. These settings only apply when none match.

[[toc]]

[![Redirect Settings](/404-to-301/settings/redirect-settings.png)](/404-to-301/settings/redirect-settings.png)

## Enable redirect

**Setting key:** `redirect_enabled` &middot; **Default:** `On`

The master switch for the global fallback.

- **On** — every unmatched 404 is redirected to the destination configured
  below using the configured HTTP status.
- **Off** — unmatched 404s render WordPress's normal 404 template. Custom
  per-URL redirects from the Redirects page still fire as usual.

A site that turns this off effectively says: *"only redirect URLs I have
explicitly listed; everything else gets the theme's 404 page."*

## Redirect type

**Setting key:** `redirect_type` &middot; **Default:** `301`

The HTTP status code returned with the fallback redirect.

| Code | Name | When to use |
| --- | --- | --- |
| **301** | Moved Permanently | The right answer for SEO — search engines drop the old URL and start indexing the destination instead. Browsers cache aggressively. |
| **302** | Found | A temporary move. Search engines keep the old URL indexed. Caches don't hold the redirect for long. |
| **307** | Temporary Redirect | Like 302 but the HTTP method is preserved (a `POST` stays a `POST`). Rarely needed for 404 → page redirects. |

301 is the default and is almost always what you want for a 404 fallback —
the page genuinely doesn't exist, so telling clients to forget about it is
the honest signal.

## Redirect to

**Setting key:** `redirect_target` &middot; **Default:** `link`

Where unmatched 404s land. Three options:

### A custom URL (`link`)

The default. Pick an external or internal absolute URL to send 404 traffic
to. The destination is configured in the **Destination URL** field that
appears when this option is selected.

**Setting key for the URL:** `redirect_link` &middot; **Default:** the site's
home URL.

The value must be an absolute URL including the scheme (`https://…`). It is
sanitised through `esc_url_raw()` before save.

### An existing page (`page`)

Redirect to the permalink of a page by ID. The numeric ID is entered in
the **Destination page ID** field.

**Setting key for the page ID:** `redirect_page` &middot; **Default:** `0`

Use this when you maintain a dedicated "page not found" landing page inside
WordPress — it survives slug renames automatically because the redirect
resolves the permalink each time, not the saved URL.

### No redirect (`none`)

Skip the fallback entirely even when the master switch is on. Equivalent to
turning `redirect_enabled` off, but kept as a distinct option so the rest
of the redirect configuration (type, link, page) is preserved while you
temporarily disable the fallback.

::: tip Per-URL redirects always run first
None of these settings affects the Redirects page. A custom redirect
matching the request URL fires regardless of whether the global fallback
is on, off, or configured to do nothing. See the
[Redirects page docs](/404-to-301/redirects) for managing those.
:::
