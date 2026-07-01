# WP Cache Helper

WP Cache Helper is a small WordPress library that wraps the object cache and transient APIs with a callback-style `remember()` helper, group-flush support for the object cache (which [core does not provide](https://core.trac.wordpress.org/ticket/4476)), and per-prefix scoping so multiple consumers on the same site never collide.

Inspired by [WP Cache Remember](https://github.com/stevegrunwell/wp-cache-remember).

## Requirements

- PHP 7.4+
- WordPress 5.0+
- Composer

## Installation

```console
composer require duckdev/wp-cache-helper
```

Classes autoload under the `DuckDev\Cache\` namespace via PSR-4.

## Initialisation

Each container instance is scoped to a single prefix. Pass any non-empty string the first time you ask for it; the same prefix returns the same instance on subsequent calls:

```php
$cache = \DuckDev\Cache\Cache::get_instance( 'my_plugin' );
```

You can also instantiate directly (useful for tests):

```php
$cache = new \DuckDev\Cache\Cache( 'my_plugin' );
```

Every key, group, and the `{prefix}_can_cache` toggle filter are namespaced under the supplied prefix.

## Options

There are no runtime options — the only configuration is the prefix passed to the constructor. Behaviour is instead tuned via the filter below.

## Methods

| Method | Backed by | Purpose |
| --- | --- | --- |
| `remember( $key, $callback, $group, $expiry )` | Object cache | Read, or compute + cache on miss. |
| `forget( $key, $group, $default )` | Object cache | Read then delete; return `$default` on miss. |
| `persist( $key, $callback, $site_wide, $expiry )` | Transients | Read, or compute + cache on miss. |
| `cease( $key, $site_wide, $default )` | Transients | Read then delete; return `$default` on miss. |
| `flush_group( $group )` | Object cache | Invalidate every entry in a group. |
| `flush()` | Object cache | Flush the entire object cache. **Last resort.** |
| `object_cache()` / `transient_cache()` | — | Access the underlying driver for finer-grained control. |

Every callback-based helper checks the callback return with `is_wp_error()` and skips caching when a `WP_Error` is returned, so a transient API failure is not memorised.

## Filters

| Filter | Arguments | Use |
| --- | --- | --- |
| `{prefix}_can_cache` | `bool $enabled, string $type` | Return `false` to disable caching. `$type` is `'object'` or `'transient'` so the two can be toggled independently. |

## Actions

The library does not fire any actions.

## Example usage

### `remember()` — object-cache read-through

```php
$cache = \DuckDev\Cache\Cache::get_instance( 'my_plugin' );

$posts = $cache->remember( 'latest_posts', function () {
    return new WP_Query( array(
        'posts_per_page' => 5,
        'orderby'        => 'post_date',
        'order'          => 'desc',
    ) );
}, 'queries', HOUR_IN_SECONDS );
```

Unlike a naive `wp_cache_get()`-then-fall-back pattern, `remember()` distinguishes a legitimately cached `0`, `''`, `[]`, or `false` from a true miss — the callback only runs when nothing was cached.

### `forget()` — one-shot read

```php
$error = $cache->forget( 'form_errors', 'flash', false );

if ( $error ) {
    echo 'An error occurred: ' . esc_html( $error );
}
```

### `persist()` — transient read-through

```php
$cache->persist( 'latest_tweets_' . $user_id, function () use ( $user_id ) {
    return get_latest_tweets_for_user( $user_id );
}, false, 15 * MINUTE_IN_SECONDS );
```

Pass `true` for the third argument to use site-wide (multisite) transients.

::: tip
Transients use boolean `false` as the miss sentinel, so a legitimately cached `false` value is indistinguishable from a miss. Reach for `remember()` if you need to cache `false`.
:::

### `flush_group()`

```php
$cache->flush_group( 'queries' );
```

Internally increments a per-group version sentinel — old entries become unreadable on next access without touching the rest of the object cache.

### Disabling caching for debugging

```php
add_filter( 'my_plugin_can_cache', '__return_false' );
```
