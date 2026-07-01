# Freemius Plugin Licensing

A lite, UI-free Freemius SDK for Duck Dev WordPress plugins. It handles license activation, deactivation, update delivery, and addon listing by talking to the Freemius API directly. The library deliberately ships no admin screens — host plugins build their own UI and call into this library for the underlying logic.

## Requirements

- PHP 7.4+
- WordPress 5.0+
- Composer

## Installation

```console
composer require duckdev/freemius-plugin-licensing
```

Classes autoload under the `DuckDev\Freemius\` namespace via PSR-4.

## Initialisation

Initialise the container by calling `Freemius::get_instance()` with your Freemius product ID and an arguments array:

```php
$freemius = \DuckDev\Freemius\Freemius::get_instance(
    12345, // Freemius product ID.
    array(
        'slug'       => 'loggedin',
        'main_file'  => LOGGEDIN_FILE,
        'public_key' => 'pk_XXXXXXXXXXXXXXXXX',
        'is_premium' => true,
        'has_addons' => false,
    )
);
```

The first call creates the container and registers WordPress hooks; subsequent calls for the same plugin ID return the existing instance.

## Options

| Key | Type | Description |
| --- | --- | --- |
| `slug` | `string` | Unique Freemius slug for the plugin. |
| `main_file` | `string` | Absolute path to the plugin's main file (used for `plugin_basename()` and `get_plugin_data()`). |
| `public_key` | `string` | Freemius public key (`pk_…`). Required for plugin-scoped endpoints (addons, info). |
| `is_premium` | `bool` | Whether this build is the premium edition. Update hooks only register when `true`. Default `false`. |
| `has_addons` | `bool` | Whether the product has addons to list. Default `false`. |

## Actions

| Hook | Arguments | When |
| --- | --- | --- |
| `duckdev_freemius_license_activated` | `array $activation, bool $success` | After a successful activation. |
| `duckdev_freemius_license_deactivated` | `array $activation, bool $success` | After a successful deactivation. |

## Filters

| Hook | Arguments | Use |
| --- | --- | --- |
| `duckdev_freemius_api_request_args` | `array $args, string $method, string $url, array $data, array $headers` | Tweak request arguments before they reach `wp_remote_request()`. |
| `duckdev_freemius_api_request_verify_ssl` | `bool $verify, Client $client` | Disable SSL verification (typically only in local dev). |
| `duckdev_freemius_format_addon_data` | `array $addon, Addon $service` | Rewrite or augment each addon entry before it is returned. |

## Example usage

### License activation

```php
$result = $freemius->license()->activate( 'XXXX-XXXX-XXXX' );

if ( is_wp_error( $result ) ) {
    echo esc_html( $result->get_error_message() );
}
```

`activate()` returns `true` / `false` from the option update on success, or a `WP_Error` when the key is empty, the plugin is not the premium build, the API call fails, or the response does not include an install ID.

### License deactivation

```php
$result = $freemius->license()->deactivate();
```

`deactivate()` refuses to proceed when the stored UID does not match the current site — that means the activation was moved elsewhere, and the new host correctly appears unlicensed rather than silently freeing the original seat.

### Reading the current activation

```php
$activation = $freemius->license()->get_activation();

if ( $activation->is_active() ) {
    $key     = $activation->license_key();
    $install = $activation->install_id();
}
```

### Updates

Update hooks are registered automatically during `boot()` for premium builds. To force a refresh:

```php
$freemius->update()->get_update_data( true );
```

### Addons

```php
$addons = $freemius->addon()->get_addons();       // Cached for 24h.
$addons = $freemius->addon()->get_addons( true ); // Force refresh.
```

Each entry is enriched with a `link` field (Freemius checkout URL) and an `is_premium` boolean.

## Security notes

- The library does **not** verify nonces or capabilities. Host plugins MUST do that before forwarding form input to `License::activate()` / `License::deactivate()`.
- The license key is stored in the `duckdev_freemius_activation_data` option, keyed by plugin ID. It is blanked from storage on deactivation.
