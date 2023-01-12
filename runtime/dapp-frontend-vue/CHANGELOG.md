# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.6.0][0.6.0] - 12-Jan-2022

#### Added

- [@dhealthdapps/frontend] fix: update translation markup, fix unused type
- [@dhealthdapps/frontend] feat(api): add referral code forwarding for LoginScreen
- [@dhealthdapps/frontend] fix(screens): add dynamic values to transactions page
- [@dhealthdapps/frontend] fix: replace  for , frontend improvements
- [@dhealthdapps/frontend] fix(screens): update fetch access token params for login screen
- [@dhealthdapps/frontend] fix: update websocket environment and add BACKEND_DOMAIN variable
- [@dhealthdapps/frontend] fix: update websocket connection url
- [@dhealthdapps/frontend] feat(test): improve base gateway tests, add auth gateway tests
- [@dhealthdapps/frontend] feat(test): add basegateway tests
- [@dhealthdapps/frontend] feat(widgets): trying to enable connection with backend
- [@dhealthdapps/frontend] feat(state): add activity module, add activity service, set up fetching activities on the frontend
- [@dhealthdapps/frontend] feat(screens): add activities screen, add select component
- [@dhealthdapps/frontend] fix(tests): update click-outside directive and add mock
- [@dhealthdapps/frontend] feat(widgets): remove script tag from index
- [@dhealthdapps/frontend] fix(widgets): fix segment configuration, add test analytics events
- [@dhealthdapps/frontend] feat(widgets): add basic segment snippet

#### Changed

- [@dhealthdapps/frontend] refactor: update websocket implementation
- [@dhealthdapps/frontend] feat(widgets): remove script tag from index
- [@dhealthdapps/frontend] fix: update websocket environment and add BACKEND_DOMAIN variable
- [@dhealthdapps/frontend] feat(api): add referral code forwarding for LoginScreen

#### Fixed

- [@dhealthdapps/frontend] fix(screens): restore terms and conditions, privacy policy screens
- [@dhealthdapps/frontend] fix(screens): add latest text for terms and conditions
- [@dhealthdapps/frontend] fix(screens): add displaying values on legal template from json
- [@dhealthdapps/frontend] fix(screens): add legal json for related screens
- [@dhealthdapps/frontend] fix(widgets):  fix query param for leader board widget
- [@dhealthdapps/frontend] fix(screens): update styles for stats component, update icons for dropdown, change fit to activ names
- [@dhealthdapps/frontend] fix(screens): fix of checkbox position on legal pages
- [@dhealthdapps/frontend] fix(kernel): add translation parameters, fix translation markup, add referral unlock info
- [@dhealthdapps/frontend] fix(screens): add use of statistics store for ACTIV balanceand top activities
- [@dhealthdapps/frontend] fix(screens): add fallback message for an empty data
- [@dhealthdapps/frontend] fix(screens): add correct pointer to amount value
- [@dhealthdapps/frontend] fix(screens): add dynamic value for assets in transactions history page
- [@dhealthdapps/frontend] fix(screens): remove gradient on desktop, update gradient for mobile
- [@dhealthdapps/frontend] fix(screens): remove gradient overlay from desktop onboarding screens
- [@dhealthdapps/frontend] fix(screens): update of onboarding images
- [@dhealthdapps/frontend] fix(widgets): remove setInterval from the frontend
- [@dhealthdapps/frontend] fix(widgets): fix socket url
- [@dhealthdapps/frontend] fix(widgets): lint fix, test error fix
- [@dhealthdapps/frontend] fix(widgets): fix of referral widget text, fix of header margin on settings page
- [@dhealthdapps/frontend] fix(widgets): referral input placeholders fix
- [@dhealthdapps/frontend] fix(widgets): dropdown styles and logic update
- [@dhealthdapps/frontend] fix(screens): lint fixes, add test for the computed
- [@dhealthdapps/frontend] fix(widgets): add strava urls for dashboard screen
- [@dhealthdapps/frontend] fix(widgets): add appstore/playmarket urls for login screen
- [@dhealthdapps/frontend] fix(widgets): display login button on mobile, update padding for stats

## [0.5.5][0.5.5] - 24-Nov-2022

#### Added

- [@dhealthdapps/frontend] feat(widgets): add statistics component, top activities component, global scss media queries configuration
- [@dhealthdapps/frontend] feat(screens): apply global media mixin
- [@dhealthdapps/frontend] feat(widgets): add fix for tooltip bug, moved texts to i18n translations
- [@dhealthdapps/frontend] feat(state): made translations getter available globally
- [@dhealthdapps/frontend] feat(widgets): add share popup
- [@dhealthdapps/frontend] fix(widgets): apply navigator share for mobile
- [@dhealthdapps/frontend] feat(tests): add new tests for the frontend
- [@dhealthdapps/frontend] feat(tests): add component tests
- [@dhealthdapps/frontend] feat(tests): add component tests
- [@dhealthdapps/frontend] feat(tests): add ui popup tests
- [@dhealthdapps/frontend] fix(i18n): move onboarding, loginscreen translations to en.json
- [@dhealthdapps/frontend] fix(i18n): move dashboard to json
- [@dhealthdapps/frontend] fix(i18n): move translations to separate json files
- [@dhealthdapps/frontend] fix(i18n): move static text to json
- [@dhealthdapps/frontend] fix: linter and ReferralInput syntax error
- [@dhealthdapps/frontend] fix(widgets): add format amount method for components
- [@dhealthdapps/frontend] fix(state): add fetching of config from the backend, state props
- [@dhealthdapps/frontend] tests: update existing test for formatAmount check
- [@dhealthdapps/frontend] fix: remove debug, update config

#### Changed

- [@dhealthdapps/frontend] style: remove commented code
- [@dhealthdapps/frontend] fix(screens): use fetchchallenge to fix reload state
- [@dhealthdapps/frontend] fix(screens): restored before destroy hook
- [@dhealthdapps/frontend] refactor(api): update statistics and leaderboards discovery with referral merge
- [@dhealthdapps/frontend] feat(api): read authentication registry from config

#### Fixed

- [@dhealthdapps/frontend] fix(api): access token refresh does not contain remote identifier
- [@dhealthdapps/frontend] fix(state): remove mock of leaderboard items, add correct font family for stats
- [@dhealthdapps/frontend] fix(style): linter issues
- [@dhealthdapps/frontend] fix(deps): added module declaration
- [@dhealthdapps/frontend] fix(widgets): hide modal screen in modal after successful login
- [@dhealthdapps/frontend] fix(widgets): dashboard state changes and remove mock from leaderboard
- [@dhealthdapps/frontend] fix(style): lint applied lint fixes
- [@dhealthdapps/frontend] fix(screens): add footer to authorized screens, remove address from top of dashboard, dashboard address undefined fix
- [@dhealthdapps/frontend] fix(widgets): add setting real ref code to input, remove ref code after being used
- [@dhealthdapps/frontend] fix(tests): header compilation error fix
- [@dhealthdapps/frontend] fix(tests): update component inputs and setters
- [@dhealthdapps/frontend] fix: update class property type
- [@dhealthdapps/frontend] fix(tests): add missing mock for auth/getAuthRegistry
- [@dhealthdapps/frontend] fix: update app metadata and linter

## [0.4.0][0.4.0] - 19-Oct-2022

#### Added

- [@dhealthdapps/frontend] feat(screens): add strava integration CTA
- [@dhealthdapps/frontend] feat(screens): add integration screen, settings page, remove local integration logic
- [@dhealthdapps/frontend] feat(widgets): update dashboard widget's endpoint
- [@dhealthdapps/frontend] fix(widgets): fix import for Snackbar, apply lint fixes
- [@dhealthdapps/frontend] feat(screens): add onboarding page, restyle login, add components
- [@dhealthdapps/frontend] feat(screens): add popup component, add popups for login, refCode
- [@dhealthdapps/frontend] feat(widgets): add lint, popup fixes, small improvements
- [@dhealthdapps/frontend] feat(widgets): remove extra field from referral popup
- [@dhealthdapps/frontend] test(screens): fix LoginScreen unit tests and imports
- [@dhealthdapps/frontend] feat(screens): add onboarding page, restyle login, add components
- [@dhealthdapps/frontend] feat(screens): add popup component, add popups for login, refCode
- [@dhealthdapps/frontend] feat(screens): add settings screen with remove integration logic
- [@dhealthdapps/frontend] feat(widgets): header styles adjustments
- [@dhealthdapps/frontend] feat(screens): add restyled dashboard
- [@dhealthdapps/frontend] feat(api): add toast event
- [@dhealthdapps/frontend] feat(screens):  add dashboard mobile styling
- [@dhealthdapps/frontend] feat(widgets): settings page styling, old unit tests fix
- [@dhealthdapps/frontend] feat(screens): add doccomments
- [@dhealthdapps/frontend] test: add unit tests for components, rename hamburgerbutton component
- [@dhealthdapps/frontend] feat(widgets): add console error fix for translations, uibutton event rename
- [@dhealthdapps/frontend] feat(widgets): add mobile menu approved styling
- [@dhealthdapps/frontend] feat(state): add leaderboard module to store
- [@dhealthdapps/frontend] feat(widgets): add leaderboarditem component, get /leaderboard api call, leaderboard confirmed styling
- [@dhealthdapps/frontend] style: add border to user avatar if exists
- [@dhealthdapps/frontend] style: add correct header config, fix of mobile styling

#### Changed

- [@dhealthdapps/frontend] refactor: move snackbar config to store, uses i18n

#### Fixed

- [@dhealthdapps/frontend] fix(tests): fix unit test failing
- [@dhealthdapps/frontend] fix: linter issues
- [@dhealthdapps/frontend] fix: merge issues and tests fix
- [@dhealthdapps/frontend] fix(i18n): add change of translations key in data, fix of integrations displaying
- [@dhealthdapps/frontend] fix(style): add fix for button displaying, lint fixes
- [@dhealthdapps/frontend] fix(screens): redirect after provider authorization
- [@dhealthdapps/frontend] fix(widgets): displaying logo on desktop, add disconnect wallet button
- [@dhealthdapps/frontend] fix(widgets): title display on mobile, close menu on route change
- [@dhealthdapps/frontend] fix(widgets): add proper format for an address, remove tabs from quick stats
- [@dhealthdapps/frontend] fix(widgets): set quick stats values to 0
- [@dhealthdapps/frontend] fix(widgets): add error handling for get leaderboard, no-items fallback, create current-user mock
- [@dhealthdapps/frontend] fix(widgets): fix leaderboard item vertical padding
- [@dhealthdapps/frontend] fix: source code file case and missing documentation
- [@dhealthdapps/frontend] fix(widgets): add fixes for typos, comments, remove imports

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


[0.6.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.5.5..v0.6.0
[0.5.5]: https://github.com/dhealthproject/dapps-framework/compare/v0.4.0..v0.5.5
[0.4.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.3.0..v0.4.0
[0.3.1]: https://github.com/dhealthproject/dapps-framework/compare/v0.3.0..v0.3.1
[0.3.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.2.0..v0.3.0
[0.2.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.1.0..v0.2.0
[0.1.0]: https://github.com/dhealthproject/dapps-framework/releases/tag/v0.1.0
