## Documentation
We want to keep it as easy as possible. So if you understand the principles of node, Framework7, Vue and Firebase well, you do not need much explanation for this Framework.

### External documentation
With support of the **Hello World App**, you will be able to build simple applications within minutes, but to build more complex applications, you have to study well the following documentation:
- **[npm and Node](https://docs.npmjs.com/getting-started/what-is-npm)** as development environment
- **[Vue](https://vuejs.org/)** to build reactive user interfaces
- **[Framework7](http://framework7.io/)** to realize native look and feel for iOS and Android
- **[Framework7-Vue components](https://github.com/nolimits4web/Framework7-Vue)** to code less and reach more (optional)
- **[Firebase](https://firebase.google.com/docs/web/setup)** as backend for authentication, database and file storage (optional)
- **[Standard JavaScript](http://standardjs.com/rules.html)** for cleaner code (optional)

### Console commands
In addtion to the common node console commands, you have the following ones available:
* `npm run dev` to start development server with live reload
* `npm run patch` to bump version to x.y.z+1 and build after bugfixing and improvement
* `npm run minor` to bump version to x.y+1.0 and build after adding new functionality
* `npm run major` to bump version to x+1.0.0 and build after breaking the backward-capability

### Configuration options
In the `package.json` file you could configure the following options:
* `title` which is used for the HTML title element
* `theme` standard theme, *ios* or *material* as option
* `lang` standard language, e.g. *en*
* `icons` icon libraries to be bundled
* `routes` routes with route as key and page to be rendered as value

### Variables to use from Vue $root object
* `$root.lang` keeps the application language (e.g. "en" or "de")
* `$root.user` keeps the user information (null or object with uid, email, displayName, photoUrl)
* `$root.theme` keeps the selected application theme ("ios" or "material")

### Deployment
Best practice is to upload the build folder to your web server root folder. Then create a file `.htaccess` in the root folder and put the following code in it and change the version according to your latest build:

  ```
  # Start rewrite engine
  RewriteEngine On

  # Here you specify the build version to be used (two times!)
  RewriteCond %{REQUEST_URI} !^/build-x.y.z/
  RewriteRule ^(.*)$ /build-x.y.z/$1 [L]

  # Forwarding to app home page if file not found
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^build-([0-9.]+)/(.*)?$ /#/$2 [R,L,NE] 
  ```
For updates, just upload the build folder and after completion change the version in the `.htaccess` 