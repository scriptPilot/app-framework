# Firebase backend

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

App Framework is well-prepared to use [Firebase](https://firebase.google.com/) as a backend provider.

Configuration file:

```
firebase: {
  apiKey: "AIzaSyAvzTiqd9fKR-h47Uxl4iXwqSMU1VjGdII",           // Required for Firebase initialization
  authDomain: "app-framework-9045a.firebaseapp.com",           // Leave blank to disable auth service
  databaseURL: "https://app-framework-9045a.firebaseio.com",   // Leave blank to disable database service
  storageBucket: "app-framework-9045a.appspot.com",            // Leave blank to disable storage service
  projectId: "app-framework-9045a",                            // Required for Firebase hosting
  allowEmailLogin: true,                                       // true or false
  allowEmailRegistration: true                                 // true or false
}
```

Disabling a service will reduce the build size.

You can use Firebase in any Vue hook `created` or later:

- `window.firebase` - Firebase application instance
- `this.$root.user` or window.user - Null or object (uid, email, name, photo)
- `this.$root.db(...)` or `window.db(...)` - Shortlink to `window.firebase.database().ref(...)`
- `this.$root.store(...)` or `window.store(...)` - Shortlink to `window.firebase.storage().ref(...)`
- `this.$root.timestamp` or `window.timestamp` - Shortlink to `window.database.ServerValue.TIMESTAMP`

To test your Firebase rules in development, you have the chance to configure a devFirebase project:

```
devFirebase: {
  deployDevRulesOnTesting: false,
  apiKey: "AIzaSyBL0Xxsc-jFZ2BnmQV08T4O9B56HJVpwXk",          
  authDomain: "dev-app-framework.firebaseapp.com",
  databaseURL: "https://dev-app-framework.firebaseio.com",
  storageBucket: "dev-app-framework.appspot.com",
  projectId: "dev-app-framework",
  allowEmailLogin: true,
  allowEmailRegistration: true
}
```

If you set `deployDevRulesOnTesting: true`, on each test command (`npm run dev`, `npm run ios` and `npm run android`), the *database-rules.json* and *storage-rules.txt* files are deployed to your devFirebase project.
