# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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


[0.2.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.1.0..v0.2.0
[0.1.0]: https://github.com/dhealthproject/dapps-framework/releases/tag/v0.1.0
