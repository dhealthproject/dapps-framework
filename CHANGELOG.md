# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.3.1][0.3.1] - 12-Sep-2022

#### Added

- [framework] chore(docs): prepare source code for distribution of reference documentation
- [framework] chore(config): add BACKEND_URL, FRONTEND_URL environment variables in sample
- [@dhealth/components] feat(widgets): add dynamic SVG graphics for transaction parts
- [@dhealth/components] feat(widgets): add transaction graphic for transfer
- [@dhealth/components] feat(widgets): add base transaction graphic implementation
- [@dhealth/components] feat(widgets): add namespace graphics components
- [@dhealth/components] feat(widgets): add component DappAddressAliasTransaction
- [@dhealth/components] feat(widgets): add transaction graphics to exports
- [@dhealth/components] feat(base): create Helper class with RGB conversion helpers
- [@dhealth/components] feat(widgets): add MosaicIcon as a graphic component, refactor with DappGraphicComponent
- [@dhealth/components] feat(widgets): add DappMosaicAliasTransaction component
- [@dhealth/components] feat(widgets): add DappAddCircle component
- [@dhealth/components] feat(widgets): add DappMosaicDefinitionTransaction component
- [@dhealth/components] feat(graphics): Add DappEditCircle as a graphic component
- [@dhealth/components] feat(widgets): add DappMosaicSupplyChangeTransaction component
- [@dhealth/components] feat(widgets): add DappTransferTransaction component
- [@dhealth/components] feat(base): bind custom events for exported components
- [@dhealth/components] feat(widgets): add DappTitleBar component
- [@dhealthdapps/backend] feat(routes): add API namespace `/oauth/:provider` for authorization
- [@dhealthdapps/backend] test(routes): add unit tests for oauth controller
- [@dhealthdapps/backend] feat(api): add generic getAccessToken implementation
- [@dhealthdapps/backend] feat(api): add implementation for OAuth authorization and callback, add account_integrations
- [@dhealthdapps/backend] test(api): add unit tests for OAuthService and AuthService
- [@dhealthdapps/frontend] feat(elements): add first draft of navigation
- [@dhealthdapps/frontend] feat(elements): add mobile navigation, fix carousel display on mobile

#### Changed

- [@dhealth/components] refactor(widgets): update widget names for consistency
- [@dhealthdapps/frontend] refactor(base): use signed cookies (removes js-cookies), fix redirection flow with routes
- [@dhealthdapps/backend] refactor(api): use secure httpOnly cookies, add config fields for CORS and URLs
- [@dhealthdapps/backend] refactor(api): add OAuthDriver abstraction, move OAuth config to config/oauth.ts

#### Fixed

- [@dhealth/components] fix(widgets): update DappAccountAvatar to use correct checksum
- [@dhealth/components] fix(docs): update documentation and fix unused imports
- [@dhealth/components] fix(review): apply comments and review (#21)
- [@dhealth/components] fix(test): update import path for refactored graphics widgets
- [@dhealth/components] fix(build): apply linter with last changes
- [@dhealth/components] fix(review): apply comments and reviews from PR (#24)
- [@dhealth/components] fix(test): update import path for refactored graphics widgets, fix DappMosaicIcon warning
- [@dhealth/components] fix(build): apply linter with last changes
- [@dhealth/components] fix(review): apply comments and reviews from PR (#24)
- [@dhealth/components] fix(test): update import path for refactored graphics widgets, fix DappMosaicIcon warning
- [@dhealth/components] fix(review): apply comments and reviews from PR (#30)
- [@dhealth/components] fix(widgets): add DappContractOperation component, fix DappTransferTransaction, fix linter/docs
- [@dhealth/components] fix(build): add props initialization
- [@dhealth/components] fix(build): dispatch base emit if not web component
- [@dhealthdapps/backend] fix: remove debug source code in authentication and add logging for transactions discovery
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

- [framework] docs: add updated contributing notes (project status) and update changelogs
- [framework] chore(build): map system uid, remove redundant environment config, use serve:prod for frontend
- [framework] chore(build): fix runtime/dapp-frontend-vue to use custom .env
- [@dhealth/components] build: add correct order for imports and code style in DappMosaic
- [@dhealth/components] feat(elements): add DappInput and DappMosaic form components
- [@dhealth/components] build: add web component wrapper as a library
- [@dhealth/components] feat(elements): add export of components as web components
- [@dhealth/contracts] fix(api): facade contract classes use public inputs and parameters
- [@dhealth/contracts] fix(build): use relative path to permit node integrations
- [@dhealth/contracts] deps: update version for first canary and update js-joda
- [@dhealth/contracts] feat(contracts): add facade methods to access contract signature and payload
- [@dhealth/contracts] test(factories): add unit tests for Contract.fromTransaction and Factory.createFromX
- [@dhealth/contracts] feat(factories): add implementation for createFromTransaction, refactor error handling
- [@dhealth/contracts] docs(base): adapt markup for all classes to correctly display after running typedoc
- [@dhealth/contracts] test(contracts): add unit tests for dHealthNetwork connection parameters
- [@dhealth/contracts] build(docs): default to named exports to fix generation of docs
- [@dhealth/contracts] test(contracts): add unit tests for contract Earn, Referral and Welcome
[framework] docs: add new scopes to @dhealth/contracts
- [@dhealth/contracts] test(base): add initial unit tests for Contract abstraction layer and Auth contract.
- [@dhealth/contracts] feat(contracts): add initial contracts implementation for Auth, Earn, Referral and Welcome.
- [@dhealth/contracts] feat(buffers): add contract buffer classes that prepare binary payloads using JSON, each contract payload is split into header and body.
- [@dhealth/contracts] feat(types): add exported types for contract parameterization and generic dHealth Network connection.
- [@dhealth/contracts] chore(package): add base structure for Contracts Library.
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
- [@dhealthdapps/backend] docs(config): add relevant documentation for config files, add authentication registries, post-refactor accounts fixes
- [@dhealthdapps/backend] feat(routes): add namespace for API with /transactions to search transactions
- [@dhealthdapps/backend] docs(api): update nestjs/swagger properties descriptions and set /api namespace for API reference
- [@dhealthdapps/backend] docs: apply typedoc declaration reference with COMMON, DISCOVERY, WORKER labels, add some missing methods/classes
- [@dhealthdapps/backend] refactor: make AccountsModule (without routes) a common module, update auth module to use DTO classes
- [@dhealthdapps/backend] perf: add mongo indexes, required fields and improve mongo query handling
- [@dhealthdapps/backend] chore: add data folder for database persistence
- [@dhealthdapps/backend] test: add more unit tests for transactions discovery
- [@dhealthdapps/backend] feat(base): add support for mongoose FilterQuery and promise delegation in NetworkService
- [@dhealthdapps/backend] config: update dApp info, add database test
- [@dhealthdapps/backend] feat(scopes): enable processor scope for operations, add per-schema fillDTO, add enabled routes for operations
- [@dhealthdapps/backend] feat(routes): add BaseDTO base class for Transferable DTOs
- [@dhealthdapps/backend] chore(deps): use next distribution tag for @dhealth/contracts
- [@dhealthdapps/backend] chore(package): set correct executable in configuration
- [@dhealthdapps/backend] feat(scopes): add draft implementation of operations processor (contracts)
- [@dhealthdapps/backend] feat(routes): add /auth/refresh functionality, apply linter changes, update Transaction and Account database schema pre-processor features, update AuthService implementation
- [@dhealthdapps/backend] fix(common): update recent challenge discovery to use Factory of @dhealth/contracts

#### Changed

- [@dhealth/components] refactor: improve perf for web components
- [@dhealthdapps/frontend] refactor: split dashboard screen implementation into components
- [@dhealthdapps/frontend] refactor: move carousel into separate component
- [@dhealthdapps/backend] refactor: set transactions discovery at core of accounts
- [@dhealthdapps/backend] refactor: add helper methods to NetworkService, add @todo and hints on missing unit tests

#### Fixed

- [@dhealth/components] fix(test): add utf-8-validate and bufferutil externals fill, DappMosaic code style
- [@dhealthdapps/frontend] fix(widgets): components rename
- [@dhealthdapps/frontend] fix: add backendService in LoginScreen and remove vue.config fetch mock
- [@dhealthdapps/frontend] fix(screens): adapt carousel image display
- [@dhealthdapps/frontend] fix(routes): restore termsofservice route
- [@dhealthdapps/backend] fix: run account discovery every 2 minutes and add transaction query by mode

## [0.2.0][0.2.0] - 13-Jul-2022

#### Added

- [@dhealth/components] feat(widgets): Add DappAccountCard as a widget component
- [@dhealth/components] feat(graphics): Add DappAccountAvatar as a graphic component
- [@dhealth/components] feat(fields): Add DappMessage as a field component
- [@dhealth/components] feat(fields): Add DappDate as a field component
- [@dhealth/components] feat(texts): Add DappTitle as a texts component
- [@dhealth/components] test(controls): Add unit test for @click handler to DappButton
- [@dhealth/components] feat(controls): Add @click handler to DappButton
- [@dhealth/components] refactor(graphics): Update style names to be unique for DappIcon component
- [@dhealth/components] test(graphics): Add unit tests for DappIcon
- [@dhealth/components] feat(graphics): Add DappIcon as a graphics component
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
- [@dhealthdapps/backend] refactor(database): improve schemas, fix schedulers/commands, update QueryService functionality
- [@dhealthdapps/backend] refactor(base): improve Queryable and Documentable concerns
- [@dhealthdapps/backend] feat(base): add config, add migrations, draft auth challenge
- [@dhealthdapps/backend] feat(base): implement transactions discovery, refactor accounts discovery, add global mocks for test suites
- [@dhealthdapps/backend] test(base): unify and globalize required mocks, add more relevant unit tests
- [@dhealthdapps/backend] feat(base): add Commands and Schedulers logic, rewrite DiscoverAccounts
- [@dhealthdapps/backend] feat(common): add JwT authentication module draft

## [0.1.0][0.1.0] - 19-Jun-2022

#### Added

- [framework] chore(package): add scoped scripts for subprojects (library, frontend, backend)
- [framework] chore(package): add components library `@dhealth/components`
- [framework] chore(package): add internal `@dhealth/components` through lerna
- [framework] chore(package): add runtime for VueJS frontend `@dhealthdapps/frontend`
- [framework] chore(package): add runtime for NestJS backend `@dhealthdapps/backend`
- [framework] docs: add installation notes in `INSTALL.md` for production and development
- [framework] docs: add relevant `CHANGELOG.md` commit types, scopes and messages guidelines
- [@dhealth/components] chore(build): add SCSS build, TailWind and PostCSS commands
- [@dhealth/components] feat(fonts): add custom font Plus Jakarta Sans and base fonts overwrite with TailWind
- [@dhealth/components] chore(build): add dHealth Design System colors and support for nested classes with PostCSS/SCSS
- [@dhealth/components] feat(base): add custom Tailwind classes and implements ActionButton
- [@dhealth/components] chore(deps): add @dhealth libraries and lodash
- [@dhealth/components] chore(deps): downgrades vue to v2.6.x for stability reasons
- [@dhealth/components] chore(deps): upgrades webpack to v5 for unit testing functionality
- [@dhealth/components] test: adds relevant tests for DappButton
- [@dhealth/components] docs(api): adds example usage with install method
- [@dhealth/components] feat(widgets): add implementation for DappQR base component
- [@dhealthdapps/frontend] chore(config): apdates base module configuration needs
- [@dhealthdapps/frontend] fix(kernel): add working AppKernel implementation for vue2
- [@dhealthdapps/frontend] chore(config): updates base module configuration needs
- [@dhealthdapps/frontend] chore(package): formats readme, adds correct iconset, fixes wording
- [@dhealthdapps/frontend] feat(theme): adds tailwindcss@3.0.x and moves assets to resources/
- [@dhealthdapps/backend] feat(backend): add @dhealthdapps/backend in runtime
- [@dhealthdapps/backend] test: add and update tests for accounts discovery, network and state services
- [@dhealthdapps/backend] fix(tests): fix NetworkService connection necessity, fix unit tests usage of any keyword
- [@dhealthdapps/backend] fix: fix mongo connection payload with authSource and use mongo:latest image
- [@dhealthdapps/backend] refactor: refactor nest software with per-scope modules
- [@dhealthdapps/backend] refactor: add implementation for schedulers enabled through scopes and more refactor (types)


[0.3.1]: https://github.com/dhealthproject/dapps-framework/compare/v0.3.0..v0.3.1
[0.3.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.2.0..v0.3.0
[0.2.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.1.0..v0.2.0
[0.1.0]: https://github.com/dhealthproject/dapps-framework/releases/tag/v0.1.0
