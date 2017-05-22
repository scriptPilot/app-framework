# State restoration

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

After an application switch or closure, the application state may be reset. This means, if your user changed the page or tab, scrolled, opened modals, put in some data before - everything will be gone.

App Framework has an automatic state restoration on each application restart, to let your users continue with the same application state they have had before they left the application.

This restoration includes the following elements:

- URL history per view
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
