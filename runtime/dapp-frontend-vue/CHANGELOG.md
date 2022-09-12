# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.3.1][0.3.1] - 12-Sep-2022

#### Added

- [@dhealthdapps/frontend] feat(elements): add first draft of navigation
- [@dhealthdapps/frontend] feat(elements): add mobile navigation, fix carousel display on mobile

#### Changed

- [@dhealthdapps/frontend] refactor(base): use signed cookies (removes js-cookies), fix redirection flow with routes

### Fixed

- [@dhealthdapps/frontend] fix(elements): fix display of user details for guests
- [@dhealthdapps/frontend] fix(widgets): create generic list component
- [@dhealthdapps/frontend] fix(elements): fix styles of friend list
- [@dhealthdapps/frontend] fix(screens): remove onboarding page, move pages to /pages folder, update paths
- [@dhealthdapps/frontend] fix(screens): restore disconnect wallet
- [@dhealthdapps/frontend] fix(screens): fix views rebase
- [@dhealthdapps/frontend] fix(build): add correct style imports
- [@dhealthdapps/frontend] fix(style): remove hover color for login QR
- [@dhealthdapps/frontend] fix(build): fix linter for mobile navigation changes

## [0.3.0][0.3.0] - 01-Sep-2022

#### Added

- [@dhealthdapps/frontend] docs: apply review comments and document properties
- [@dhealthdapps/frontend] review: add relevant source code documentation
- [@dhealthdapps/frontend] feat(app): add settings entry for auth token, add route guard
- [@dhealthdapps/frontend] feat(kernel): add pre-render-completion loader, add axios)
- [@dhealthdapps/frontend] review(screens): apply review comments, add unit tests
- [@dhealthdapps/frontend] feat(screens): add generation of transaction in mobile app for qr code
- [@dhealthdapps/frontend] feat(screens): add draft for onboarding page to start authentication
- [@dhealthdapps/frontend] chore(package): add PWA precache for entrypoint
- [@dhealthdapps/frontend] test: added global mocks for sdk and qr lib, working unit tests
- [@dhealthdapps/frontend] test(build): use jest for unit tests and add global mocks
- [@dhealthdapps/frontend] test: add functional SCSS imports during unit tests runtime
- [@dhealthdapps/frontend] feat(app): add implementation of login functionality
- [@dhealthdapps/frontend] docs: add relevant source code documentation
- [@dhealthdapps/frontend] feat(screens): add first draft of dashboard screen
- [@dhealthdapps/frontend] feat(screens): add first draft of vertically split screen
- [@dhealthdapps/frontend] feat(screens): add login screen layout, svg to tag conversion, header config
- [@dhealthdapps/frontend] feat(screens): add first draft of login screen
- [@dhealthdapps/frontend] refactor: adapt authentication, add documentation, remove dead code, implement store draft, add dApp config
- [@dhealthdapps/frontend] build: update Dockerfile to remove redundant command execution, small refactor in HttpRequestHandler
- [@dhealthdapps/frontend] refactor(app): add Vuex store, use environment variables with .env, adapt log-in functionality and refactor BackendService/AuthService/ProfileService

#### Changed

- [@dhealthdapps/frontend] refactor: split dashboard screen implementation into components
- [@dhealthdapps/frontend] refactor: move carousel into separate component

#### Fixed 

- [@dhealthdapps/frontend] fix(widgets): components rename
- [@dhealthdapps/frontend] fix: add backendService in LoginScreen and remove vue.config fetch mock
- [@dhealthdapps/frontend] fix(screens): adapt carousel image display
- [@dhealthdapps/frontend] fix(routes): restore termsofservice route

## [0.2.0][0.2.0] - 13-Jul-2022

#### Added

- [@dhealthdapps/frontend] chore(build): align webpack build configuration
- [@dhealthdapps/frontend] deps: add @dhealth/sdk and @dhealth/qr-library and fix onboarding
- [@dhealthdapps/frontend] test: added tests for Translations.ts
- [@dhealthdapps/frontend] test(base): added tests for Card.d.ts, AppKernel.ts
- [@dhealthdapps/frontend] feat(screens): named interface with capital letter
- [@dhealthdapps/frontend] feat(screens): fixed getTransactionRequest test error
- [@dhealthdapps/frontend] test(screens): updated tests for Onboarding screen
- [@dhealthdapps/frontend] feat(screens): applied comments from prev PR, added tests
- [@dhealthdapps/frontend] feat(screens): removed empty tests, moved component imports under //internal dependencies
- [@dhealthdapps/frontend] test(screens): added draft unit tests for Onboarding
- [@dhealthdapps/frontend] feat(screens): fixed generating transaction in mobile app for qr code
- [@dhealthdapps/frontend] feat(screens): fixed error with QR code in mobile app
- [@dhealthdapps/frontend] feat(screens): removed createTransactionRequest to .ts file
- [@dhealthdapps/frontend] feat(screens): added draft of onboarding page
- [@dhealthdapps/frontend] feat(screens): fixed error with QR code in mobile app

## [0.1.0][0.1.0] - 19-Jun-2022

#### Added

- [@dhealthdapps/frontend] chore(config): updates base module configuration needs
- [@dhealthdapps/frontend] fix(kernel): add working AppKernel implementation for vue2
- [@dhealthdapps/frontend] chore(config): updates base module configuration needs
- [@dhealthdapps/frontend] chore(package): formats readme, adds correct iconset, fixes wording
- [@dhealthdapps/frontend] feat(theme): adds tailwindcss@3.0.x and moves assets to resources/


[0.3.1]: https://github.com/dhealthproject/dapps-framework/compare/v0.3.0..v0.3.1
[0.3.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.2.0..v0.3.0
[0.2.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.1.0..v0.2.0
[0.1.0]: https://github.com/dhealthproject/dapps-framework/releases/tag/v0.1.0
