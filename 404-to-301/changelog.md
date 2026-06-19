---
title: Changelog
---

# Changelog

Full release history for **404 to 301**. The plugin's bundled
`readme.txt` keeps only the latest couple of releases; the complete
history lives here.

## 4.0.0

* New: Custom redirect manager with exact, prefix and regex matching and per-redirect redirect type.
* New: Active/inactive toggle, hit counter and last-hit timestamp on every redirect.
* New: Dedicated, indexed database tables for 404 logs and custom redirects.
* New: Modern React-powered admin with full-featured Logs and Redirects tables (search, filters, bulk actions, pagination).
* New: Per-log lifecycle status (open / ignored / fixed) and date filters.
* New: Email notifications with a configurable hit threshold.
* New: REST API at `/404-to-301/v1/`.
* New: WP-CLI command set — `wp 404-to-301 logs|redirects|settings`.
* New: Add-ons catalogue for free and premium extensions.
* Improve: IP masking and path exclusions for GDPR-friendly logging.

## 3.1.5

* Improve: Row action link.
* Fix: Unable to delete logs.

## 3.1.4

* Improve: Sanitize variables.

## 3.1.3

* Improve: Security checks and improvements.

## 3.1.2

* Improve: Security checks and improvements.

## 3.1.1

* Improve: Security checks and improvements.

## 3.1.0

* Improve: Tested with WP 5.8.
* Improve: Added sanitization.

## 3.0.9

* Improve: Added nonce verification for bulk actions.

## 3.0.8

* Improve: Tested with WP 5.7.
* Improve: Add capability checks for ajax actions - Thanks [Jerome](https://secure.nintechnet.com/).
* Improve: Improve query preparations - Thanks [Jerome](https://secure.nintechnet.com/).

## 3.0.7

* Fix: Activation hook was not being executed.
* Fix: Table creation failed in new installations.

## 3.0.6

* Improve: Tested with WP 5.6.
* Improve: Small improvements.
* Improve: Temporarily disabled Freemius SDK.

## 3.0.5

* Improve: Updated Freemius SDK.
* Improve: Tested with WP 5.2.

## 3.0.4

* New: Added option to disable URL guessing.
* New: Added review notice.

## 3.0.3

* Fix: Opt-in is disabled temporarily to debug the issues.

## 3.0.2

* Improve: Minor performance improvements.
* Fix: Security fix.

## 3.0.1

* Improve: Make release automated.
* Fix: Do not include exclude path items.

## 3.0.0.1

* Fix: Using template_redirect hook for redirect instead of wp hook.
* Fix: Fixed an issue with do_action in Freemius SDK.

## 3.0.0

* New: Individual optional settings for each error log item (individual redirect, log, email alert can be set).
* New: Clear error logs without removing custom redirects.
* New: Added error logs grouping with count.
* New: [WPML compatible](https://wpml.org/plugin/404-to-301/).
* New: Integrated Freemius for addon, support and analytics (optional).
* Improve: Complete code revamp. More improved structure.
* Improve: Set custom options from previous logs if same item exists.
* Improve: Made 3rd party integration easier.

## 2.3.3

* Fix: Using `esc_url()` for Ref and Url fields.
* Fix: Fixed Cross Site Scripting vulnerability in "From" column - Thanks to [Plugin Vulnerabilities](https://www.pluginvulnerabilities.com/).

## 2.3.1

* Improve: Tested with WordPress 4.6.
* Fix: Fixed Cross Site Scripting vulnerability - Thanks to [Summer of Pwnage](https://www.sumofpwn.nl/) & Louis Dion-Marcil.
* Fix: Fixed sorting issue in error log (changed default order to date descending).
* Fix: Fixed issues when trailing slash found at the end of custom redirect.

## 2.3.0

* Fix: Removed unused UAN button from help page.
* Fix: Completely safe to use.
* Fix: Tracking completely removed from the plugin since it was detected as spam. Read more [here](https://duckdev.com/blog/404-to-301-plugin-detected-by-wordfence-here-is-what-actually-happened/).

## 2.2.9

* Fix: Serious issue fixed - usage tracking script was being detected as spam.
* Fix: Removed tracking completely.

## 2.2.8

* Fix: Fixed a minor bug on TOC button.

## 2.2.7

* Improve: Improved condition checking.
* Improve: Speed improvements.
* Improve: Made error log link to new tab.
* Fix: Fixed issue with PHP 5.4 - empty error log data.

## 2.2.6

* Improve: Improved condition checking.
* Fix: Fixed issue - undefined index when accessed directly.

## 2.2.5

* Fix: Fixed issue - front end was slow.

## 2.2.4

* Fix: Fixed custom redirect issue.
* Fix: Fixed issues when activating.

## 2.2.2

* New: Now you can set custom redirects for each error path.
* New: Go to error logs list and set custom redirect.
* Improve: Improved code.
* Fix: Fixed issues with BuddyPress.

## 2.1.7

* New: New [Log Manager](https://duckdev.com/products/404-to-301-log-manager/) add-on available now.
* New: Get periodic email alerts instead of instant email alerts for every error (add-on).
* New: Automatically clear error logs (add-on).
* Improve: Removed inactive filter - `i4t3_before_404_redirect`.

## 2.1.6

* Improve: Fixed broken plugin website links.
* Improve: Tested with WordPress 4.5.

## 2.1.5

* Improve: Translated missing strings.
* Improve: Tested with WordPress 4.4.2.
* Fix: Fixed issues with deprecated functions - Thanks to [Pedro Mendonça](https://github.com/pedro-mendonca).

## 2.1.4

* Improve: Tested with WordPress 4.4.1.
* Fix: Fixed issues when clearing logs (header already sent).

## 2.1.3

* Fix: Fixed issues with older versions of WordPress.
* Fix: Fixed issues with older versions of PHP.

## 2.1.0

* New: New option to set items per page from error log listing page.
* New: New option to show or hide items from listing table (screen option).
* Improve: Improved error listing page table structure.
* Fix: Fixed issue - null value issue when no Referrer or User Agent found.
* Fix: Fixed issue - clearing errors and redirecting.

## 2.0.9

* Fix: Fixed issue - empty needle issue after 2.0.8 update.

## 2.0.8

* New: New option to exclude paths from error logs and redirect.
* Fix: Fixed issue - email notifications are being sent even after disabling it.
* Fix: Fixed issue - settings reset after reactivation of plugin.

## 2.0.7

* New: New option to change error notification email address.
* New: Now 100% translation ready.
* Improve: Minor code improvements.

## 2.0.6

* Improve: Introduced new website for the plugin.
* Improve: Fixed a few dead link issues.

## 2.0.5

* Improve: Added option to avoid search engine crawlers/bots from logging errors.
* Fix: Fixed error log per page issue.

## 2.0.4

* Fix: Fixed an issue where error log table is not being created.

## 2.0.3

* Fix: Fixed a serious issue which may cause SQL injection attack.

## 2.0.2

* Fix: Fixed an issue with https redirect.
* Fix: Fixed an issue with url `preg_match`.

## 2.0.1

* New: Now you can log/monitor all 404 errors (optional).
* New: You can get email notifications on 404 errors (optional).
* New: You can select existing pages from dropdown to set as redirect page.
* New: New plugin home page.
* Improve: Upgraded to WordPress plugin coding standard.
* Improve: Documented all functions.

## 1.0.8

* Improve: Tested for WP 4.2.
* Fix: Very minor bug fix.

## 1.0.7

* Improve: Improved performance.
* Fix: Fixed options saving issue in admin page.

## 1.0.6

* Improve: Tested with latest version.
* Improve: Improved structure.

## 1.0.5

* Fix: Fixed permission issue on redirect link on plugin activation.

## 1.0.4

* Fix: Fixed permission issue on activating along with some security plugins like WordFence.

## 1.0.3

* New: Added official support forum.

## 1.0.1

* New: Added official website details.

## 1.0.0

* New: Added first version with basic options.
