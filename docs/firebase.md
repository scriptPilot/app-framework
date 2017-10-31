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

- `this.$fireAuth` - Shortlink to `window.firebase.auth`
- `this.$user`- Null or object (uid, email, name, photo)
- `this.$fireDB` - Shortlink to `window.firebase.database().ref`
- `this.$fireStore` - Shortlink to `window.firebase.storage().ref`

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

If you set `deployDevRulesOnTesting: true`, on each test command (`npm run dev`, `npm run ios` and `npm run android`), the *firebase-database.json* and *firebase-storage.txt* files are deployed to your devFirebase project.

## Firebase sign out

It is quite easy to sign out a user with App Framework from Firebase:

`<f7-button @click="$root.$signOut()">Sign out</f7-button>`

## Example

Common task: Keep some local data in sync with Firebase

```
<template>
  <f7-page>
    <f7-block>{{$db('someLocalData')}}</f7-block>
  </f7-page>
</template>
<script>
  export default {
    created() {
      this.$fireDB('someDataAtFirebase').on('value', (snap) => {
        this.$db('someLocalData', snap.val())
      })
    }
  }
</script>
```
