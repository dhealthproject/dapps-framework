# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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


[0.3.1]: https://github.com/dhealthproject/dapps-framework/compare/v0.3.0..v0.3.1
[0.3.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.2.0..v0.3.0
[0.2.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.1.0..v0.2.0
[0.1.0]: https://github.com/dhealthproject/dapps-framework/releases/tag/v0.1.0
