---
title: Developer Docs
---

# Developer Docs

404 to 301 ships with a stable extension surface so you can customise
behaviour without touching plugin files. Everything documented on this
page is part of the public API and will keep working across minor
releases.

All examples can be dropped into your theme's `functions.php` or a small
companion plugin.

[[toc]]

## Architecture overview

```
DuckDev\FourNotFour\
├── Plugin                       Identity helpers (name, version, slug, URL)
├── Core                         Boot orchestrator + service locator
├── Settings                     Settings CRUD + REST registration
├── Setup\{Activator, Deactivator, Upgrader}
├── Admin\{Menu, Assets, Page, Links}
├── Front\{Controller, Request,
│         Actions\{Log, Email, Redirect}}
├── Api\{Endpoint, Redirects, Logs, Settings, Migration, Addons}
├── Models\{Logs, Redirects}
├── Migration\{Migrator, Scheduler}
├── CLI\{CLI, Logs, Redirects, Settings, Migrate}
├── Database\Database            BerlinDB table installer
├── Utils\{Singleton, Permission, Sanitizer, Helpers, Assets}
└── Contracts\{Actionable, Runnable, Routable}
```

The recommended way to extend the plugin is:

1. Hook into `404_to_301_init` so your code runs only after every
   subsystem is up.
2. Reach long-lived services through the service locator on
   `\DuckDev\FourNotFour\Core::instance()`.
3. Use the documented filters and actions for everything you can — they
   are guaranteed stable.

## Actions

### `404_to_301_init`

Fires once the plugin has finished booting every subsystem.

```php
add_action( '404_to_301_init', function ( $core ) {
    // $core is the DuckDev\FourNotFour\Core instance.
} );
```

### `404_to_301_activated`

Fires from the activation handler after the database tables are installed
and defaults are seeded.

### `404_to_301_deactivated`

Fires from the deactivation handler. Use it to cancel your own scheduled
jobs or clean up transients.

### `404_to_301_upgraded`

Fires after the upgrader detects a version bump and runs its routines.

```php
add_action( '404_to_301_upgraded', function ( $previous, $current ) {
    // $previous and $current are version strings.
}, 10, 2 );
```

### `404_to_301_request`

Fires after every action in the chain has run on a request — including
non-404 requests where the chain still ran (for the `Excluded` short-
circuit, etc.).

```php
add_action( '404_to_301_request', function ( $request ) {
    // $request is a DuckDev\FourNotFour\Front\Request.
} );
```

### `404_to_301_404_request`

Same timing as `404_to_301_request` but only fires when the request was
an actual 404. Use this for analytics integrations that should only
count true 404s.

### `404_to_301_pre_redirect`

Fires immediately before the Redirect action calls `wp_safe_redirect()`.

```php
add_action( '404_to_301_pre_redirect', function ( $url, $status, $request ) {
    error_log( "404 → $url ($status) for {$request->url()}" );
}, 10, 3 );
```

### `404_to_301_post_log_insert`

Fires after a 404 row has been written. The new row ID is passed first.

```php
add_action( '404_to_301_post_log_insert', function ( $id, $data, $request ) {
    // …
}, 10, 3 );
```

### `404_to_301_email_sent`

Fires after the notification email has been queued through `wp_mail()`.

### `404_to_301_migration_complete`

Fires once the legacy table has been fully migrated and dropped.

## Filters

### `404_to_301_should_process`

The big short-circuit. Return `false` to skip every action on a given
request.

```php
add_filter( '404_to_301_should_process', function ( $proceed, $request ) {
    // Skip JSON API 404s regardless of other settings.
    if ( str_starts_with( $request->url(), '/wp-json/' ) ) {
        return false;
    }
    return $proceed;
}, 10, 2 );
```

### `404_to_301_actions`

Rewrite the action chain for a request. Each element must implement
`DuckDev\FourNotFour\Contracts\Actionable`.

```php
add_filter( '404_to_301_actions', function ( $actions, $request ) {
    $actions[] = new My\Webhook_Notifier();
    return $actions;
}, 10, 2 );
```

### `404_to_301_settings_defaults`

Add your own keys to the settings store so they're picked up by the
defaults() pass.

```php
add_filter( '404_to_301_settings_defaults', function ( $defaults ) {
    $defaults['my_addon_enabled'] = false;
    return $defaults;
} );
```

Pair it with `404_to_301_settings_rest_schema` so the REST API accepts
your keys.

### `404_to_301_settings_rest_schema`

Describe added settings so the REST endpoint validates them instead of
dropping them on save.

```php
add_filter( '404_to_301_settings_rest_schema', function ( $properties ) {
    $properties['my_addon_enabled'] = array( 'type' => 'boolean' );
    return $properties;
} );
```

### `404_to_301_settings_pre_update`

Last-chance hook before the option is written. Useful for cross-field
validation.

```php
add_filter( '404_to_301_settings_pre_update', function ( $clean, $raw, $previous ) {
    // Force notifications off if the recipient was cleared.
    if ( empty( $clean['email_recipient'] ) ) {
        $clean['email_enabled'] = false;
    }
    return $clean;
}, 10, 3 );
```

### `404_to_301_capability`

The capability required to access the admin UI and REST endpoints.
Defaults to `manage_options`.

```php
add_filter( '404_to_301_capability', function () {
    return 'd404_manage_redirects';
} );
```

### `404_to_301_redirect_target`

Override the resolved redirect target before `wp_safe_redirect()` is
called.

```php
add_filter( '404_to_301_redirect_target', function ( $payload, $request ) {
    if ( str_starts_with( $request->url(), '/legacy/' ) ) {
        $payload['url']    = home_url( '/archive' );
        $payload['status'] = 302;
    }
    return $payload;
}, 10, 2 );
```

`$payload` is `[ 'url' => string, 'status' => int ]`.

### `404_to_301_redirect_statuses`

Customise the list of HTTP status codes allowed on a per-redirect basis.
Defaults to `[ 301, 302, 307 ]`.

### `404_to_301_is_human`

Override the bot detection used by the Log action's "skip bots" toggle.

```php
add_filter( '404_to_301_is_human', function ( $is_human, $user_agent ) {
    // Treat our load balancer's health check as a bot.
    if ( str_contains( $user_agent, 'GoogleHC' ) ) {
        return false;
    }
    return $is_human;
}, 10, 2 );
```

### `404_to_301_pre_log_insert`

Modify the row before it lands in the database.

```php
add_filter( '404_to_301_pre_log_insert', function ( $data, $request ) {
    $data['user_agent'] = substr( $data['user_agent'], 0, 200 );
    return $data;
}, 10, 2 );
```

### `404_to_301_email_payload`

Rewrite the outgoing notification. Useful for switching recipients per
URL or replacing the body with HTML.

```php
add_filter( '404_to_301_email_payload', function ( $email, $request ) {
    $email['subject'] = '[404] ' . $email['subject'];
    return $email;
}, 10, 2 );
```

`$email` is `[ 'recipient' => string, 'subject' => string, 'body' => string ]`.

### Request filters

The `Request` object exposes each accessor through its own filter, so
addons can rewrite individual fields without subclassing.

- `404_to_301_request_method` — HTTP method.
- `404_to_301_request_referer` — Referer header.
- `404_to_301_request_user_agent` — User-Agent header.
- `404_to_301_request_ip` — Resolved client IP (already empty when
  `mask_ip` is on).
- `404_to_301_request_url` — Request URI (path + query).
- `404_to_301_request_host` — Host header.
- `404_to_301_request_is_404` — The `is_404()` check itself, in case you
  want to force-treat a non-404 response as a 404 (e.g. an empty search
  results page).

Each filter receives the resolved value and the `Request` instance:

```php
add_filter( '404_to_301_request_ip', function ( $ip, $request ) {
    // Anonymise IPv4 to the /24.
    return preg_replace( '/\.\d+$/', '.0', $ip );
}, 10, 2 );
```

## JavaScript hooks

The admin React UI uses `@wordpress/hooks` for two extension points the
[Logs Cleaner](https://duckdev.com/addons/) add-on uses:

### `d404.settings.logs.fields`

Append fields to the Error logs settings panel.

```js
import { addFilter } from '@wordpress/hooks'

addFilter(
    'd404.settings.logs.fields',
    'my-addon/extra-log-fields',
    (existing, { getSetting, setSetting }) => (
        <>
            {existing}
            <MyExtraField
                value={getSetting('my_addon_enabled', false)}
                onChange={(v) => setSetting('my_addon_enabled', v)}
            />
        </>
    ),
)
```

### `d404.settings.logs.cross_sell`

Replace or suppress the default cross-sell banner at the bottom of the
Error logs panel. Return `null` to hide it; return your own React node to
swap it.

::: info Hook names start with a letter
`@wordpress/hooks` rejects hook names that begin with a digit, which is
why JS-side filters use the `d404` prefix instead of `404_to_301`.
:::

## REST API

All endpoints live under `/wp-json/d404/v1/`:

- `GET/POST /redirects` — list / create redirects.
- `GET/POST/DELETE /redirects/<id>` — single redirect.
- `GET /logs`, `GET/POST/DELETE /logs/<id>` — logs.
- `GET/PATCH /settings` — read or update settings (also bridged through
  `/wp/v2/settings` for use with the WP core React hooks).
- `GET/POST /migration` — drive the v3 → v4 migration.
- `GET /addons` — the add-on catalog.

The endpoints require the capability returned by `404_to_301_capability`
(defaults to `manage_options`).

## Service locator

Inside an `404_to_301_init` action, you can reach core services through:

```php
$core     = \DuckDev\FourNotFour\Core::instance();
$settings = $core->settings();             // DuckDev\FourNotFour\Settings|null
```

For the request-scoped `Request` object during the action chain, use the
`$request` argument that every action / request filter receives.
