# WP Review Notice

A small, opinionated WordPress library that gently asks for a wp.org plugin review after a few days of usage. Built around a tiny set of focused, swappable collaborators so it stays trivially testable and easy to extend.

## Requirements

- PHP 7.4+
- WordPress 6.0+
- Composer

## Installation

```console
composer require duckdev/wp-review-notice
```

Classes autoload under the `DuckDev\Reviews\` namespace via PSR-4.

## Quick start

```php
add_action( 'plugins_loaded', function () {
    \DuckDev\Reviews\Notice::create(
        'my-plugin', // wp.org plugin slug (e.g. "hello-dolly").
        'My Plugin', // Display name shown in the notice copy.
        array(
            'days'    => 7,
            'cap'     => 'manage_options',
            'screens' => array( 'dashboard', 'plugins' ),
        )
    )->register();
} );
```

`register()` is what hooks `admin_notices` + `admin_init` and seeds the show-time schedule. Calling `create()` without `register()` does nothing — useful for tests, or for configuring a notice you want to render manually.

## Options

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `days` | `int` | `7` | Days to wait before showing the notice for the first time. |
| `screens` | `array` | `[]` | Allowed admin screen IDs. Empty = every admin screen. |
| `cap` | `string` | `manage_options` | Capability required to see and act on the notice. |
| `classes` | `array` | `[]` | Extra CSS classes appended to the `notice notice-info` wrapper. |
| `domain` | `string` | `duckdev` | Text domain used for the bundled copy. |
| `message` | `string` | auto-generated | Custom HTML message. Not escaped — sanitise it yourself. |
| `action_labels` | `array` | bundled labels | Keys: `review`, `later`, `dismiss`. Set any to `''` to hide that link. |
| `prefix` | `string` | slug with `-` → `_` | Storage namespace. Keys are written as `{prefix}_review_{key}`. |

## Actions

The library does not fire any WordPress actions of its own — user interactions (Review / Later / Dismiss) are handled internally through `admin_init`.

## Filters

| Filter | Arguments | Use |
| --- | --- | --- |
| `duckdev_reviews_notice_message` | `string $message, int $days` | Replace the default notice copy. |

```php
add_filter( 'duckdev_reviews_notice_message', function ( $message, $days ) {
    return "We're glad you've been with us for {$days}+ days!";
}, 10, 2 );
```

## Example usage

### Basic

Register on `plugins_loaded` — the notice will appear on the dashboard and plugins screen after 7 days of usage, and only to users who can `manage_options`.

```php
add_action( 'plugins_loaded', function () {
    \DuckDev\Reviews\Notice::create( 'my-plugin', 'My Plugin' )->register();
} );
```

### Custom storage / rendering

Every collaborator is constructor-injectable, so tests (and unusual integrations) can swap any single piece without forking the library:

```php
use DuckDev\Reviews\Notice;
use DuckDev\Reviews\Support\Config;

$notice = new Notice(
    Config::fromArray( 'my-plugin', 'My Plugin' ),
    new MyRedisTimerStore(),      // implements TimerStoreInterface
    null,                         // default user-meta dismissal
    null,                         // default admin-screen resolver
    null,                         // default capability checker
    new MyBlockEditorRenderer()   // implements RendererInterface
);
$notice->register();
```

### Available interfaces

- `TimerStoreInterface` — when the next show is due (default: `SiteOptionTimerStore`).
- `DismissalStoreInterface` — per-user dismissal flag (default: `UserMetaDismissalStore`).
- `ScreenResolverInterface` — current admin screen check.
- `CapabilityCheckerInterface` — capability gate.
- `RendererInterface` — emits the notice HTML (default: `DefaultRenderer`).
