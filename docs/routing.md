# Routing

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

App Framework completes and checks the *app/routes.json* file automatically on any test or build command for you. To disable the completion, set `completeRoutesFile: false` in the configuration file.

App Framework supports all possibilities for nested routing, described [for Framework7-Vue](http://v1.framework7.io/vue/navigation-router.html).

You have to take care for the following rules when you name your *pages/ ... .vue* files:

- Lowercase and hyphen-type: `your-new-page.vue` (allowed: [0-9a-z-])
- An underscore indicates tab routes: `your-new-page_tab1.vue`
- Two underscores indicates alternate tab routes: `your-new-page_tab1_alternate.vue`

Pages in sub folders *pages/sub-folder/... .vue* are supported. Sub folders do not have any impact to the route structure but let your organize your page components better.

As an example, if you have the following page components:

- *pages/tabs.vue*
- *pages/tabs_tab1.vue*
- *pages/tabs_tab2.vue*
- *pages/tabs_tab2_alternate.vue*
- *pages/tabs_tab3.vue*

*App Framework* generates the following routes:

```
{
 "path": "/tabs/",
 "component": "tabs.vue",
 "tabs": [
   {
     "path": "/tab1/",
     "tabId": "tab1",
     "component": "tabs_tab1.vue"
   },
   {
     "path": "/tab2/",
     "tabId": "tab2",
     "component": "tabs_tab2.vue",
     "routes": [
       {
         "path": "/alternate/",
         "component": "tabs_tab2_alternate.vue"
       }
     ]
   },
   {
     "path": "/tab3/",
     "tabId": "tab3",
     "component": "tabs_tab3.vue"
   }
 ]
}
```

For dynamic routes, you have to add them manually to the *routes.json* file. Example:

```
{
 "path": "/flexible-routing/blog/:blogId/post/:postId/",
 "component": "flexible-routing.vue"
}
```

To protect routes and require user authentication before, just add `login: true` as a property. Example:

```
{
 "path": "/tabs/",
 "component": "tabs.vue",
 "login": true,
 "tabs": [
   {
     "path": "/tab1/",
     "tabId": "tab1",
     "component": "tabs_tab1.vue"
   },
   {
     "path": "/tab2/",
     "tabId": "tab2",
     "component": "tabs_tab2.vue",
     "login": true
   },
   {
     "path": "/tab3/",
     "tabId": "tab3",
     "component": "tabs_tab3.vue"
   }
 ]
}
```

In the example above, */tabs/* and */tabs/tab2/* require login, */tabs/tab1/* and */tabs/tab3/* not.

## Login protection for all pages

You can save time and enable login protection for all pages in the *app/config.json* file with `loginRequiredForAllPages: true`.

## Workarounds

To solve Framework7 / Framework7-Vue behavior:

- Load two flexible routes after another: https://github.com/scriptPilot/app-framework/issues/597
- Avoid multiple pages in DOM with non-linear navigation: https://github.com/scriptPilot/app-framework/issues/632
