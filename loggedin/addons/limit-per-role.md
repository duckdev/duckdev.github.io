---
outline: deep
---

# Configuring Limit Per Role

The **Limit Per Role** add-on lets you define a maximum number of concurrent sessions for each WordPress user role. Instead of applying a single global limit to every user on your site, you can tailor the limit to each role — giving administrators more sessions while keeping stricter limits for subscribers, for example.

Unlike the [Limit Per User](./limit-per-user) add-on, this add-on is configured directly from the main Loggedin settings page rather than individual user profiles.

[![Limit Per Role Settings](/loggedin/limit-per-role/settings.png)](/limit-per-role/settings.png)

## Roles to Limit

This is a set of checkboxes listing every registered WordPress role on your site. Only roles you check here will have a custom concurrent session limit applied. Roles you leave unchecked continue to use the global concurrent session limit configured in the main Loggedin settings.

Checking a role reveals a number input field directly below where you can enter the limit for that role.

## Role Limit Fields

Once a role is selected, a dedicated input field appears for it. Enter the maximum number of concurrent sessions you want to allow for users belonging to that role.

- **Minimum value:** `1` — setting a limit below 1 is treated as no limit.
- **Empty or 0:** The role falls back to the global limit, same as if it were unchecked.

Each role gets its own independent field, so you can mix and match limits freely across roles.

## How It Works

### Priority over the global limit

When a user logs in, Loggedin checks whether any of their assigned roles have a custom limit configured here. If a matching role limit is found, it overrides the global concurrent session limit for that user.

### Multiple roles

WordPress users can have more than one role at a time. If a user holds multiple roles and more than one of those roles has a configured limit, the **highest limit wins**. This means multi-role users always get the most permissive cap among their roles, rather than the most restrictive one.

For example, if a user has both the **Editor** role (limit: 2) and the **Shop Manager** role (limit: 5), that user will be allowed up to **5** concurrent sessions.

### Fallback to global limit

If none of a user's roles have a configured limit, the global concurrent session limit from the main Loggedin settings applies as usual.

::: info Priority order
The **Limit Per User** add-on, if also active, takes priority over role-based limits. A per-user limit set on an individual's profile will always override both the role limit and the global limit.
:::
