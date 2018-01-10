# Way of working

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

## Changes

For each change to App Framework code, please follow these steps:

1. Create an issue
   - Will be categorized as "new feature", "bug" or "improvement"
   - Should be discussed for new features
2. Create a branch
   - Should be named "feature-123", "fix-123" or "enhancement-123" where 123 is the issue number
3. Develop the solution
   - Update the postinstall routine to apply changes to previous versions
   - On variables change, check dependencies in source code
   - On file change, check dependencies in source code
4. Test the solution
   - On macOS / Windows / Linux after changes to *scripts* folder
   - On iOS / Android / Web after changes to *client* or *demo* folder
   - With a new / updated project after changes to the postinstall routine
5. Update the documentation
   - Features in file *README.md*
   - Documentation in folder *docs*
6. Commit the branch as a pull request

## Pull requests

For each new pull request, please follow these steps:

1. Verify the testing
   - Discuss findings in the pull request
2. Verify the documentation update
   - Discuss findings in the pull request
3. Merge the pull request and delete the branch
4. Add the issue in file *CHANGELOG.md* for the next version
6. Close the issue with reference to the pull request

## Releases

For each release, please follow these steps:

1. Build a new App Framework version and commit it to GitHub
   - Run `npm run patch` after bug-fixes and improvements (version bump to x.y.z+1)
   - Run `npm run minor` after adding new functionality (version bump to x.y+1.0)
   - Run `npm run major` after breaking backward-capability (version bump to x+1.0.0)
2. Update the version with release date in file *CHANGELOG.md* and commit it to GitHub
3. Publish to the [npm repository](https://www.npmjs.com/package/app-framework) with `npm publish`
4. Deploy new Demo App version
   - to Firebase hosting with `npm run firebase`
   - to Google Play Store, update all information before commit ([read documentation](deploy.md))
   - to Apple App Store, update all information before commit ([read documentation](deploy.md))
5. Update external documentation
   - [Framework7-Vue: Overview](https://v1.framework7.io/vue/)
   - [Framework7-Vue: Starter App Templates](https://v1.framework7.io/vue/templates.html)
6. Promote new version
