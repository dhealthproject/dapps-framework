# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.5.0][0.5.0] - 24-Nov-2022

#### Added

- [@dhealth/components] chore: update to alpha version
- [@dhealth/contracts] feat(contracts): add asset and amount to Earn contract
- [@dhealth/contracts] feat(api): TransactionParameters now includes recipientAddress, maxFee and deadline
- [@dhealth/contracts] feat(contracts): add contracts for Burn, Handshake and Consent operations
- [@dhealth/contracts] feat(api): add exports for Burn, Consent and Handshake contracts
- [@dhealthdapps/backend] feat(api): enable integrations query by remote 
- [@dhealthdapps/backend] feat(api): add activity data processing
- [@dhealthdapps/backend] test: add unit tests for OAuthService.callProviderAPI
- [@dhealthdapps/backend] feat(database): add database migrations implementation
- [@dhealthdapps/backend] feat(routes): add statistics endpoint
- [@dhealthdapps/backend] feat(api): add relevant documentation for events, add OnActivityDownloaded
- [@dhealthdapps/backend] feat(scopes): add payout scope implementation draft with ActivityPayouts
- [@dhealthdapps/backend] config: add earn contract discovery source
- [@dhealthdapps/backend] test(api): add tests for PreparePayouts and BroadcastPayouts
- [@dhealthdapps/backend] feat(api): add updatePayoutSubject implementation for payout state updates
- [@dhealthdapps/backend] feat(api): update payout amount formula, add unit tests and document
- [@dhealthdapps/backend] perf(api): add broadcast limit, adjust formula given E=0
- [@dhealthdapps/backend] test(api): add unit test for broadcastable payouts query
- [@dhealthdapps/backend] feat(database): add data field to schema
- [@dhealthdapps/backend] refactor(api): update implementation for UserAggregation and StatisticsModule with routes
- [@dhealthdapps/backend] test(schedulers): add relevant unit tests in Statistics scope
- [@dhealthdapps/backend] feat(common): add monitoring configs, log service and relevant classes/types
- [@dhealthdapps/backend] test: add & update tests for LogService
- [@dhealthdapps/backend] feat(common): create LogModule and allow LogService to be injectable as well as to be created using constructor
- [@dhealthdapps/backend] fix(tests): delta with payouts merge, fixes jest open handles, mocks winston
- [@dhealthdapps/backend] refactor(schedulers): add DiscoveryCommand.getNextSource, add booster assets
- [@dhealthdapps/backend] test(schedulers): add unit tests for refactored DiscoveryCommand.getNextSource
- [@dhealthdapps/backend] feat(database): add ref code generating to db on login
- [@dhealthdapps/backend] fix(frontend): place ref code as param instead of query, add ref code to login request
- [@dhealthdapps/backend] feat(database): add storing referred by value
- [@dhealthdapps/backend] feat(database): add querying by refcode and referredby
- [@dhealthdapps/backend] feat(database): rename ref code to referral code in db, generate random string 8 characters
- [@dhealthdapps/backend] feat(database): add referral code migration
- [@dhealthdapps/backend] config: update dapp config, monitoring config & add transport config
- [@dhealthdapps/backend] feat(common): add alerts event emission to LogService
- [@dhealthdapps/backend] feat: add notifier scope, use event emitter for alerts
- [@dhealthdapps/backend] refactor: add level to AlertEvent and update AlertNotifier
- [@dhealthdapps/backend] test: add unit tests for notifier scope
- [@dhealthdapps/backend] docs(notifier): add index files in notifier scope
- [@dhealthdapps/backend] refactor: add LeaderboardsModule export to classes.ts
- [@dhealthdapps/backend] refactor(api): update event emitter injection, now only in LogModule and WebHooksModule
- [@dhealthdapps/backend] fix(api): update mailer configuration
- [@dhealthdapps/backend] refactor(api): update to import LogModule and inject LogService
- [@dhealthdapps/backend] fix(api): error handling in BaseCommand to forward-throw
- [@dhealthdapps/backend] fix(tests): add unit tests for new controller
- [@dhealthdapps/backend] feat(routes): add get config route
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

- [framework] feat(api): apply review for social platform integrations
- [@dhealth/components] fix(build): tests built using webpack, fonts linter issue
- [@dhealth/components] fix(types): export external types
- [@dhealthdapps/backend] refactor(api): update Strava data discovery and update onActivityCreated
- [@dhealthdapps/backend] refactor(api): add tests for OAuth implementation, add CipherService, add mongo operations
- [@dhealthdapps/backend] fix(common): remove accidentally commited file
- [@dhealthdapps/backend] refactor(api): implement entity definition for OAuth entities (profile, activity)
- [@dhealthdapps/backend] test(api): improve consistency on unit test labels, add payout unit tests
- [@dhealthdapps/backend] chore(build): make db reset script explicit
- [@dhealthdapps/backend] refactor(database): add fields isManual and sufferScore for more analysis
- [@dhealthdapps/backend] fix(schedulers): add aggregate logic to user aggregation scheduler
- [@dhealthdapps/backend] fix(services): add nest error fix
- [@dhealthdapps/backend] fix(config): decoupled earn asset in assets config
- [@dhealthdapps/backend] fix(schedulers): discover assets use discovery.sources
- [@dhealthdapps/backend] fix(database): change of random generating params
- [@dhealthdapps/backend] feat(api): add social config and route to the backend
- [@dhealthdapps/backend] refactor(api): finalize referral update for merge
- [@dhealthdapps/backend] refactor(api): update monitoring implementation with error log, update statistics
- [@dhealthdapps/backend] refactor: change log service usage, inject event emitter
- [@dhealthdapps/backend] refactor: update log service context in main.ts
- [@dhealthdapps/backend] refactor: add event emitter to user aggregation & payout scheduler
- [@dhealthdapps/backend] fix(tests): add relevant ConfigController test, fix BaseCommand
- [@dhealthdapps/backend] refactor(config): update configuration feed, fix log context
- [@dhealthdapps/backend] tests: add logging context and generic parameters
- [@dhealthdapps/backend] fix: make auth.registries obligatory
- [@dhealthdapps/frontend] fix: linter issues
- [@dhealthdapps/frontend] style: remove commented code
- [@dhealthdapps/frontend] fix(screens): use fetchchallenge to fix reload state
- [@dhealthdapps/frontend] fix(screens): restored before destroy hook
- [@dhealthdapps/frontend] refactor(api): update statistics and leaderboards discovery with referral merge
- [@dhealthdapps/frontend] feat(api): read authentication registry from config

#### Fixed

- [@dhealthdapps/backend] fix(api): Strava query parameters compatibility
- [@dhealthdapps/backend] fix(api): Strava /oauth/token fields compatibility
- [@dhealthdapps/backend] fix(api): event propagation of activity slugidentifier
- [@dhealthdapps/backend] fix(api): update OAuth implementation to store timestamps in milliseconds (driver dependent)
- [@dhealthdapps/backend] fix(schedulers): fix type error
- [@dhealthdapps/backend] fix(database): update referral migration
- [@dhealthdapps/backend] fix(api): update payouts broadcast and fix leaderboard unit tests
- [@dhealthdapps/backend] fix: use of dapp configuration in authentication
- [@dhealthdapps/backend] test: fix all failed unit tests
- [@dhealthdapps/backend] refactor: fix lint
- [@dhealthdapps/backend] test: fix failed tests
- [@dhealthdapps/backend] fix: update leaderboards to use sub-sum routine with array
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

## [0.4.0][0.4.0] - 19-Oct-2022

#### Added

- [@dhealth/components] feat(elements): add new sizes to DappIcon component
- [@dhealth/components] feat(elements): add DappDirectionTriangle and DappAccountDetails components
- [@dhealth/components] style(elements): update DappAccountDetails to use full width
- [@dhealth/components] feat(elements): create DappTitleBar as a header component
- [@dhealth/components] feat(elements): create DappNavigation as a header component
- [@dhealth/components] feat(elements): create DappNavigationItem as a graphic component
- [@dhealth/components] feat(elements): add drawer for DappNavigation, update responsive view
- [@dhealth/components] test(elements): add unit tests for DappNavigation
- [@dhealth/components] feat(elements): add information section and additional information slot to drawer
- [@dhealthdapps/backend] feat(common): add assets configuration and discovery from transactions
- [@dhealthdapps/backend] feat(api): add assets discovery and re-org API endpoints
- [@dhealthdapps/backend] feat(api): standardize query format for API, fix accounts&assets discovery
- [@dhealthdapps/backend] api(database): set Account and Transaction fields readonly
- [@dhealthdapps/backend] api(database): update all remaining document fields to readonly
- [@dhealthdapps/backend] docs(api): add documentation for DatabaseConfig
- [@dhealthdapps/backend] feat(scopes): solve discovery dependency in processor
- [@dhealthdapps/backend] test(api): add implementation tests and update unit tests
- [@dhealthdapps/backend] test(api): add unit tests for AssetSchema and apply transaction schema changes
- [@dhealthdapps/backend] config(base): update subscription and webhook URL config
- [@dhealthdapps/backend] test(routes): add unit tests for oauth controller
- [@dhealthdapps/backend] feat(routes): add post /activities andpoint
- [@dhealthdapps/backend] test(routes): add hooksservice unit tests
- [@dhealthdapps/backend] docs(api): add correct type to DTO fields
- [@dhealthdapps/backend] feat(api): refactor webhooks implementation and add activities
- [@dhealthdapps/backend] test(api): add unit tests for WebHooksService implementation
- [@dhealthdapps/backend] feat(routes): add /activities GET endpoint
- [@dhealthdapps/backend] test(api): add unit tests for activities features
- [@dhealthdapps/backend] test(api): add updated unit tests for /me endpoint
- [@dhealthdapps/backend] test(api): add unit test fix for getIntegrations
- [@dhealthdapps/backend] feat(api): add collectionName in all Documentables
- [@dhealthdapps/backend] feat(api): add implementation for QueryService.union
- [@dhealthdapps/backend] test(api): add unit tests for QueryService.union
- [@dhealthdapps/backend] feat(api): add implementation for AssetsService.formatMosaicId with unit tests
- [@dhealthdapps/backend] feat(api): add MongoQueryOperation and MongoQueryPipeline
- [@dhealthdapps/backend] feat(schedulers): add scheduler to discover blocks in discovery scope
- [@dhealthdapps/backend] feat(scopes): add statistics scope, leaderboard routes, services and schedulers
- [@dhealthdapps/backend] docs(api): fix versioning and add some more documentation
- [@dhealthdapps/backend] test(api): add unit test for asset existence
- [@dhealthdapps/backend] feat(scopes): add statistics scope, leaderboard routes, services and schedulers
- [@dhealthdapps/backend] test(api): add unit tests for DiscoverBlocks scheduler and statistics scope
- [@dhealthdapps/backend] docs: add index files for scopes and their sub-directories
- [@dhealthdapps/backend] docs: add missing usage examples in common scope
- [@dhealthdapps/backend] docs: document database schema consistently
- [@dhealthdapps/backend] feat(api): add OAuthService.callProviderAPI with access token refresh, add event OnActivityCreated
- [@dhealthdapps/backend] feat: add types to map data provider API responses
- [@dhealthdapps/backend] feat(base): add implementation for OnActivityCreatedListener
- [@dhealthdapps/backend] refactor(common): add DappHelpers implementation in common scope
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

- [@dhealth/components] refactor: move DappTitleBar to header elements
- [@dhealthdapps/backend] refactor(api): move activities and webhooks to processor scope
- [@dhealthdapps/backend] refactor: extract Mongo* types to common/types
- [@dhealthdapps/backend] refactor: update statistics aggregation timings
- [@dhealthdapps/backend] refactor: use runOnInit in Cronjob, add more logs
- [@dhealthdapps/backend] docs: add missing documentation
- [@dhealthdapps/backend] docs(common): add param & result descriptions in BasicOAuthDriver.ts & HttpRequestHandler.ts
- [@dhealthdapps/backend] config: add provider api_url configuration
- [@dhealthdapps/backend] feat(common): query healthy nodes from network-api in NetworkService when none of the configured nodes is healthy
- [@dhealthdapps/backend] test: add/modify tests to improve coverage
- [@dhealthdapps/frontend] refactor: move snackbar config to store, uses i18n

#### Fixed

- [@dhealth/components] fix(review): update components and tests after rebase
- [@dhealthdapps/backend] fix(routes):  apply requested changes
- [@dhealthdapps/backend] fix(routes): place activities controller and service into proper module
- [@dhealthdapps/backend] fix(docs): added doccoments for classes and methods
- [@dhealthdapps/backend] fix: update unit tests and ProfileDTO
- [@dhealthdapps/backend] fix: export of StateData
- [@dhealthdapps/backend] fix: dependency injection of Nest modules
- [@dhealthdapps/backend] fix: update configuration for pagination in discovery schedulers
- [@dhealthdapps/backend] fix(db): update Transaction and Account fields, use formatMosaicId in discovery
- [@dhealthdapps/backend] fix: update types and indexes in Statistics, fix unit test
- [@dhealthdapps/backend]: fix(test): update unit tests initialization for leaderboards
- [@dhealthdapps/backend] fix: create swagger document before applying helmet to allow swagger page to display with http scheme
- [@dhealthdapps/backend] fix(docs): fix exports in classes.ts for documentation
- [@dhealthdapps/backend] fix: remove main module from documentation
- [@dhealthdapps/backend] fix(docs): remove worker main module and fix linter issues
- [@dhealthdapps/backend] fix(scopes): update nest module dependencies
- [@dhealthdapps/backend] fix(docs): remove unnecessary internal type
- [@dhealthdapps/backend] fix(test): fix WebHooksController dependencies injection
- [@dhealthdapps/backend] fix: transaction discovery requires discoveredAt
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


[0.5.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.4.0..v0.5.0
[0.4.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.3.0..v0.4.0
[0.4.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.3.0..v0.4.0
[0.3.1]: https://github.com/dhealthproject/dapps-framework/compare/v0.3.0..v0.3.1
[0.3.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.2.0..v0.3.0
[0.2.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.1.0..v0.2.0
[0.1.0]: https://github.com/dhealthproject/dapps-framework/releases/tag/v0.1.0
