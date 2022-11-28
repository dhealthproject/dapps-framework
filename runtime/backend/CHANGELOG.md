# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.5.0][0.5.0] - 24-Nov-2022

#### Added

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
- [@dhealthdapps/backend] fix: update leaderboards to use sub-sum routine with array

#### Changed

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

## [0.4.0][0.4.0] - 19-Oct-2022

#### Added

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

#### Changed

- [@dhealthdapps/backend] refactor(api): move activities and webhooks to processor scope
- [@dhealthdapps/backend] refactor: extract Mongo* types to common/types
- [@dhealthdapps/backend] refactor: update statistics aggregation timings
- [@dhealthdapps/backend] refactor: use runOnInit in Cronjob, add more logs
- [@dhealthdapps/backend] docs: add missing documentation
- [@dhealthdapps/backend] docs(common): add param & result descriptions in BasicOAuthDriver.ts & HttpRequestHandler.ts
- [@dhealthdapps/backend] config: add provider api_url configuration
- [@dhealthdapps/backend] feat(common): query healthy nodes from network-api in NetworkService when none of the configured nodes is healthy
- [@dhealthdapps/backend] test: add/modify tests to improve coverage

#### Fixed

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

## [0.3.1][0.3.1] - 12-Sep-2022

#### Added

- [@dhealthdapps/backend] fix: remove debug source code in authentication and add logging for transactions discovery
- [@dhealthdapps/backend] feat(routes): add API namespace `/oauth/:provider` for authorization
- [@dhealthdapps/backend] test(routes): add unit tests for oauth controller
- [@dhealthdapps/backend] feat(api): add generic getAccessToken implementation
- [@dhealthdapps/backend] feat(api): add implementation for OAuth authorization and callback, add account_integrations
- [@dhealthdapps/backend] test(api): add unit tests for OAuthService and AuthService

#### Changed

- [@dhealthdapps/backend] refactor(api): use secure httpOnly cookies, add config fields for CORS and URLs

#### Fixed

- [@dhealthdapps/backend] fix: remove debug source code in authentication and add logging for transactions discovery

## [0.3.0][0.3.0] - 01-Sep-2022

#### Added

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

- [@dhealthdapps/backend] refactor: set transactions discovery at core of accounts
- [@dhealthdapps/backend] refactor: add helper methods to NetworkService, add @todo and hints on missing unit tests

#### Fixed

- [@dhealthdapps/backend] fix: run account discovery every 2 minutes and add transaction query by mode

## [0.2.0][0.2.0] - 13-Jul-2022

#### Added

- [@dhealthdapps/backend] refactor(database): improve schemas, fix schedulers/commands, update QueryService functionality
- [@dhealthdapps/backend] refactor(base): improve Queryable and Documentable concerns
- [@dhealthdapps/backend] feat(base): add config, add migrations, draft auth challenge
- [@dhealthdapps/backend] feat(base): implement transactions discovery, refactor accounts discovery, add global mocks for test suites
- [@dhealthdapps/backend] test(base): unify and globalize required mocks, add more relevant unit tests
- [@dhealthdapps/backend] feat(base): add Commands and Schedulers logic, rewrite DiscoverAccounts
- [@dhealthdapps/backend] feat(common): add JwT authentication module draft

## [0.1.0][0.1.0] - 19-Jun-2022

#### Added

- [@dhealthdapps/backend] feat(backend): add @dhealthdapps/backend in runtime
- [@dhealthdapps/backend] test: add and update tests for accounts discovery, network and state services
- [@dhealthdapps/backend] fix(tests): fix NetworkService connection necessity, fix unit tests usage of any keyword
- [@dhealthdapps/backend] fix: fix mongo connection payload with authSource and use mongo:latest image
- [@dhealthdapps/backend] refactor: refactor nest software with per-scope modules
- [@dhealthdapps/backend] refactor: add implementation for schedulers enabled through scopes and more refactor (types)


[0.5.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.4.0..v0.5.0
[0.4.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.3.0..v0.4.0
[0.3.1]: https://github.com/dhealthproject/dapps-framework/compare/v0.3.0..v0.3.1
[0.3.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.2.0..v0.3.0
[0.2.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.1.0..v0.2.0
[0.1.0]: https://github.com/dhealthproject/dapps-framework/releases/tag/v0.1.0
