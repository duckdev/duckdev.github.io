---
title: Developer Docs
---

# Developer Docs

Lazy Load for Comments offers a set of hooks that let you extend the plugin's functionality without modifying its core files. This ensures your custom code remains intact even after a plugin update. There are two primary types of hooks: Actions and Filters.

To use either type of hook, you must first create a callback function — a custom function that contains the code you want to run. You then register this callback with a specific Lazy Load for Comments hook, telling the plugin exactly when and where to execute your code.

All hooks should be added to your theme's `functions.php` file or to a custom plugin.

## Actions

Actions let you run a custom function at a specific, predefined point in the plugin's execution.

### 1. `lazy_load_for_comments_init`

This action fires once the plugin is fully loaded and all of its classes are ready. Addons and extensions should hook into this action so they only run when Lazy Load for Comments is active.

#### Parameters

* `core`: The main plugin core instance (`DuckDev\LazyComments\Core`).

#### Example Usage

```php
add_action( 'lazy_load_for_comments_init', 'my_addon_init' );

function my_addon_init( $core ) {
    // Lazy Load for Comments is loaded and ready.
    // Safe to initialize your addon here.
}
```

### 2. `lazy_load_for_comments_activated`

This action fires right after the plugin is activated. Use it to run one-time setup tasks for your addon.

#### Example Usage

```php
add_action( 'lazy_load_for_comments_activated', 'my_addon_on_activate' );

function my_addon_on_activate() {
    // Runs when Lazy Load for Comments is activated.
}
```

### 3. `lazy_load_for_comments_deactivated`

This action fires right after the plugin is deactivated. Use it to run cleanup tasks.

#### Example Usage

```php
add_action( 'lazy_load_for_comments_deactivated', 'my_addon_on_deactivate' );

function my_addon_on_deactivate() {
    // Runs when Lazy Load for Comments is deactivated.
}
```

## Filters

Filters let you modify data that is being processed by the plugin. A filter callback receives a value, modifies it, and returns the modified value.

### 1. `lazy_load_for_comments_can_lazy_load`

This filter decides whether the comments should be lazy loaded for the current request. The plugin already checks the load method, whether the page is a single post, the minimum comment count, and the bot check — this filter lets you add your own conditions on top.

#### Parameters

* `can`: A boolean. Return `true` to lazy load the comments, or `false` to load them normally.

#### Example Usage

```php
add_filter( 'lazy_load_for_comments_can_lazy_load', 'my_disable_lazy_load' );

function my_disable_lazy_load( $can ) {
    // Never lazy load comments on the "contact" page.
    if ( is_page( 'contact' ) ) {
        return false;
    }

    return $can;
}
```

### 2. `lazy_load_for_comments_rendered_html`

This filter modifies the comments HTML returned by the REST API before it is sent to the browser and injected into the page.

#### Parameters

* `html`: The rendered comments HTML.
* `post`: The `WP_Post` object the comments belong to.

#### Example Usage

```php
add_filter( 'lazy_load_for_comments_rendered_html', 'my_append_comment_notice', 10, 2 );

function my_append_comment_notice( $html, $post ) {
    return $html . '<p class="comment-policy">All comments are moderated before publishing.</p>';
}
```

### 3. `lazy_load_for_comments_default_settings`

This filter modifies the plugin's default settings values. Addons can use it to change the fallback value of an existing setting.

#### Parameters

* `defaults`: An associative array of setting keys and their default values (`load_method`, `button_text`, `button_style`, `button_class`, `show_loader`, `minimum_count`, `disable_for_bots`).

#### Example Usage

```php
add_filter( 'lazy_load_for_comments_default_settings', 'my_default_settings' );

function my_default_settings( $defaults ) {
    // Use "On button click" as the default load method.
    $defaults['load_method'] = 'click';

    return $defaults;
}
```

### 4. `lazy_load_for_comments_capability`

This filter changes the user capability required to access and manage the plugin's settings page. The default capability is `manage_options`.

#### Parameters

* `capability`: The capability string.

#### Example Usage

```php
add_filter( 'lazy_load_for_comments_capability', 'my_custom_capability' );

function my_custom_capability( $capability ) {
    // Allow editors to manage the plugin settings.
    return 'edit_others_posts';
}
```

### 5. `lazy_load_for_comments_has_access`

This filter gives fine-grained control over whether the current user can manage the plugin and use its REST API. It runs after the capability check, so you can override the result for specific users.

#### Parameters

* `has_access`: A boolean. Return `true` to grant access, `false` to deny it.

#### Example Usage

```php
add_filter( 'lazy_load_for_comments_has_access', 'my_restrict_access' );

function my_restrict_access( $has_access ) {
    // Only allow user ID 1 to manage the plugin.
    return get_current_user_id() === 1;
}
```

::: info Need help?
If you think something is missing or need help extending Lazy Load for Comments, feel free to [contact us](https://duckdev.com/contact/).
:::
