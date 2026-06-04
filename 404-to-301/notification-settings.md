---
title: Notification Settings
---

# Notification Settings

The **Notifications** tab on the Settings page configures the email that
goes out when a 404 fires. Email is opt-in — the master switch is off by
default so a fresh install never surprises an admin's inbox.

[[toc]]

[![Notification Settings](/404-to-301/settings/notification-settings.png)](/404-to-301/settings/notification-settings.png)

## Notify by email on 404 errors

**Setting key:** `email_enabled` &middot; **Default:** `Off`

The master switch. When off, the Email action becomes a no-op even if
recipient and threshold are populated. The other fields on this tab are
shown but visually marked as ignored.

When on, every 404 that reaches the Email action is evaluated against the
threshold and sent if it qualifies.

## Recipient email

**Setting key:** `email_recipient` &middot; **Default:** the site's
`admin_email` option.

The address that receives the notification. Single address only — for
multiple recipients, use a mailing-list address (e.g. `team@example.com`)
or hook into the [`404_to_301_email_payload`](/404-to-301/developer-docs#404_to_301_email_payload)
filter to rewrite the `to` field.

Sanitised through `sanitize_email()` before save. An invalid address is
cleared rather than partially saved, so a blank recipient field always
means "nobody configured."

## Hits threshold

**Setting key:** `email_threshold` &middot; **Default:** `1`

How many times the same URL must 404 before a notification is sent.

- **`1`** — email on the very first 404. Loud, but informative on a small
  site.
- **Higher values** — email only after the URL has been hit at least this
  many times. Useful on busy sites where one-off mistypes don't deserve a
  notification but a sustained 404 pattern does.

The threshold reads the per-URL `hits` counter on the matching log row,
which is why **logging has to be on** for notifications to fire — the
counter never advances without it.

::: tip One email per URL, not per hit
Once a URL crosses the threshold and an email is sent, the email action
remembers that and doesn't re-send for the same URL. Otherwise a URL set
to threshold `1` on a popular broken link would mean an email per visit.
:::
