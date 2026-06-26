---
title: Changelog
---

# Changelog

Full release history for **Loggedin**. The plugin's bundled
`readme.txt` keeps only the latest couple of releases; the complete
history lives here.

## 3.0.0

### Added

* Modern React-powered admin under **Users → Loggedin** with two tabs — Settings (concurrent-login limit + login logic + Force Logout panel) and Add-ons (catalogue + license management).
* REST API at `/loggedin/v1/` for settings (`GET/POST /settings`), session management (`POST /sessions/destroy`), and add-on licensing (`GET/POST /addons`, `POST/DELETE /addons/{id}/license`).
* Unified `loggedin_settings` option registered with `show_in_rest` — the React admin reads and writes settings through `@wordpress/core-data`, and integrations can use the same endpoint.
* Force Logout panel now accepts a user **ID, email, or username** — pick whichever is fastest to type. The resolver detects the input shape automatically.
* Add-ons module powered by Freemius — first-party add-ons (Real-time Logout, Limit Per User, Limit Per Role) register themselves through the new `loggedin_register_addon` filter and surface in the Add-ons tab.
* JavaScript extension slot — add-ons can append their own React `PanelBody` to the Settings tab via the `loggedin.settings.panels` filter.
* Documented PHP hook surface — `loggedin_init`, `loggedin_settings_defaults`, `loggedin_admin_script_vars`, `loggedin_addons_catalog`, `loggedin_destroy_oldest_session`, plus the existing limit / bypass / error-message filters.

### Improved

* Reorganised plugin structure (PSR-4 namespaces under `DuckDev\Loggedin\`) and aligned with WordPress Coding Standards.
* Comprehensive sanitisation pass across every input and option write path.
* PHP 7.4 is now the minimum supported version.

## 2.0.4

### Improved

* Review-notice scheduling — the dismiss state is now respected on every admin page load instead of being re-evaluated only on the plugin's own settings screen.

### Fixed

* Invalid nonce action prevented review notices from being dismissed; dismissing now persists across reloads.

## 2.0.3

### Improved

* Removed leftover debug code that shipped accidentally in 2.0.2.

## 2.0.2

### Fixed

* Nonce verification on the Force Logout action.
* Uninstall routine now cleans up every option and user-meta key the plugin creates.

## 2.0.1

### Fixed

* Fatal errors triggered on activation under specific PHP configurations.
* Empty Add-ons page when the licensing backend was unreachable at first load.

## 2.0.0

### Added

* Settings page.
* Add-ons.
* Logout Oldest logic. Thanks [#19](https://github.com/Joel-James/loggedin/pull/19).

### Improved

* Coding standards.
* Sanitization.

## 1.3.2

### Fixed

* Security fixes.

## 1.3.1

### Improved

* Support for AJAX logins. Thanks [Carlos Faria](https://github.com/cfaria).

## 1.3.0

### Improved

* "Allow" login logic now runs only after the password check so an invalid login no longer disturbs existing sessions.

## 1.2.0

### Added

* Ability to choose between the available login-logic modes from the settings screen.

## 1.1.0

### Added

* Force-logout panel in the admin to clear every active session for a chosen user.
* Cleanup routine that removes plugin options when the plugin is uninstalled.
* Review notice prompting happy users to leave a rating.

### Improved

* General code clean-up.

## 1.0.1

### Fixed

* Misspelled variable.

## 1.0.0

### Added

* Initial release.
