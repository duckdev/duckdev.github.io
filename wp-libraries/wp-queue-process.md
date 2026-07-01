# WP Queue Process

WP Queue Process is a WordPress library for firing off non-blocking asynchronous requests and for running long jobs as a background queue. Items pushed onto the queue are worked through in batches that bail out before exhausting the server's time or memory budget; each finished batch chains the next instantly, and a self-healing cron restarts a stalled queue.

- Inspired by [TechCrunch WP Asynchronous Tasks](https://github.com/techcrunch/wp-async-task).
- Forked from [WP Background Processing](https://github.com/deliciousbrains/wp-background-processing), modernised with a swappable storage driver, a server-load guard, and a full test suite.

## Requirements

- PHP 7.4+
- WordPress 6.0+
- Composer

## Installation

```console
composer require duckdev/wp-queue-process
```

Classes autoload under the `DuckDev\Queue\` namespace via PSR-4.

## Concepts

Consumers extend one of two abstract classes:

- **`Async`** — a one-off non-blocking request. Use it when you want to hand off a slow task (sending an email, warming a cache) to a background PHP process.
- **`Task`** — a background queue that extends `Async`. Items are pushed onto the queue and processed in batches, first-in first-out. New items can be pushed even while a batch is running.

`Task` delegates persistence to a `StoreInterface`, load-guarding to `ServerLimits`, and single-worker locking to `ProcessLock`. All three are injected through the constructor with WordPress-backed defaults.

## Options

Configuration is via subclass properties and the filters below. The most common property is:

| Property | Type | Purpose |
| --- | --- | --- |
| `$action` | `string` | Unique action name used to namespace every filter, option key, cron hook, and lock transient. |

Batch behaviour (time/memory budget, lock duration, cron interval) is configured via filters — see below.

## Public methods (`Task`)

| Method | Description |
| --- | --- |
| `push_to_queue( $item )` | Append a single item to the in-memory queue. |
| `set_queue( array $items )` | Replace the in-memory queue wholesale. |
| `save( string $group = 'default' )` | Persist the in-memory queue as a new batch. |
| `dispatch()` | Schedule the health-check cron and start processing. |
| `update( string $key, array $data )` | Replace the items of an existing batch. |
| `delete( string $key )` | Delete a batch entirely. |
| `cancel_process()` | Drop the current batch and clear the cron. |

## Actions

The library does not fire any WordPress actions of its own — extend the `complete()` method on your `Task` subclass to run code when the queue drains.

## Filters

Every filter is namespaced with the process identifier (`{prefix}_{action}`, e.g. `duckdev_example_process`):

| Filter | Default | Purpose |
| --- | --- | --- |
| `{id}_query_args` | action + nonce | Query args added to the dispatch URL. |
| `{id}_query_url` | `admin-ajax.php` | URL the request is dispatched to. |
| `{id}_post_args` | non-blocking POST | Arguments passed to `wp_remote_post()`. |
| `{id}_default_time_limit` | `20` | Per-batch time budget, in seconds. |
| `{id}_time_exceeded` | computed | Override whether the time budget is spent. |
| `{id}_memory_exceeded` | computed | Override whether the memory budget is spent. |
| `{id}_queue_lock_time` | `60` | Process lock duration, in seconds. |
| `{id}_cron_interval` | `5` | Health-check interval, in minutes. |

## Example usage

### One-off async request

```php
class WP_Example_Request extends \DuckDev\Queue\Async {

    protected $action = 'example_request';

    protected function handle() {
        // Actions to perform. Dispatched data is available in $_POST.
    }
}
```

Dispatch it (chaining is supported):

```php
$request = new WP_Example_Request();
$request->data( array( 'value1' => $value1, 'value2' => $value2 ) )->dispatch();
```

### Background queue

```php
class WP_Example_Process extends \DuckDev\Queue\Task {

    protected $action = 'example_process';

    /**
     * Return the item (optionally modified) to push it back for another pass,
     * or false to remove it from the queue.
     */
    protected function task( $item, $group ) {
        // Actions to perform.
        return false;
    }

    protected function complete() {
        parent::complete();
        // Show a notice, log, etc.
    }
}
```

Instantiate the process **unconditionally** (every request, even when nothing is queued), push items, then save and dispatch:

```php
$process = new WP_Example_Process();

foreach ( $items as $item ) {
    $process->push_to_queue( $item );
}

$process->save( 'my-group' )->dispatch();
```

### Swapping the storage driver

Pass your own `StoreInterface` — or a custom `ServerLimits` / `ProcessLock` — to the constructor:

```php
$process = new WP_Example_Process( new MyCustomStore( 'my_plugin_example_process' ) );
```

### BasicAuth

If your site is behind BasicAuth, the dispatched request needs credentials attached:

```php
add_filter( 'http_request_args', function ( $r ) {
    $r['headers']['Authorization'] = 'Basic ' . base64_encode( USERNAME . ':' . PASSWORD );
    return $r;
} );
```
