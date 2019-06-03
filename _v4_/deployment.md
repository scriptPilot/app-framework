# Deployment

## Firebase

### Preparation

1. Run `npm install --save-dev firebase-tools` to install the Firebase CLI locally.
2. Run `npx firebase init` to initialize the project for Firebase.
   - Choose Firebase Hosting
   - Set public directory to: `build/pwa`
   - Configure as single-page app: `yes`
   - Overwrite index file: `no`

You find the detailed documentation at https://firebase.google.com/docs/cli.

### Testing

Run `npx firebase serve --only hosting` to run the PWA locally.

### Deployment

Run `npx firebase deploy --only hosting` to deploy the PWA to Firebase Hosting.   
