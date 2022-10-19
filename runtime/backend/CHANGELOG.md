# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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


[0.4.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.3.0..v0.4.0
[0.3.1]: https://github.com/dhealthproject/dapps-framework/compare/v0.3.0..v0.3.1
[0.3.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.2.0..v0.3.0
[0.2.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.1.0..v0.2.0
[0.1.0]: https://github.com/dhealthproject/dapps-framework/releases/tag/v0.1.0
