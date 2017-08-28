# State restoration

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

After an application switch or closure, the application state may be reset. This means, if your user changed the page or tab, scrolled, opened modals, put in some data before - everything will be gone.

App Framework has an automatic state restoration on each application restart, to let your users continue with the same application state they have had before they left the application.

This restoration includes the following elements:

- URL history per view (requires unique class or ID attribute per view)
- Selected tabs (requires unique ID attribute per page)
- Scroll positions
- Side panels
- Action sheets (requires unique ID attribute)
- Login screens (requires unique ID attribute)
- Pickers (requires unique ID attribute)
- Popups (requires unique ID attribute)
- Form inputs (requires unique form ID attribute and unique NAME attributes per form)
- Focus on form input (requires unique form ID attribute and unique NAME attributes per form)
- Page component data

The state is not restored for standard modals, popovers and code-generated modals.

If you use `v-model` on an input, the state will be restored by page component data, you can use a name attribute to restore the form focus, but it is not required in this case to restore form input.

## URL history per view

With App Framework > 1.9.0. and configuration setting `restoreHistory: false`, only the last URL per view will be restored.

This solves issues where pages have been loaded several times in the DOM.

But you have to take care now to assign a `href` or `back-link-url` property to each backlink, as described in the Framework7-Vue documentation for [links](http://framework7.io/vue/link.html) or [navbars](http://framework7.io/vue/navbar.html).

## Page component data

With App Framework > 1.11.0 you can disable the page component data restoration with `restoreComponentData: false` in the configuration file.
