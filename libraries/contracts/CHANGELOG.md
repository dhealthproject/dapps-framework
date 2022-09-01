# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.3.0][0.3.0] - 01-Sep-2022

#### Added

- [@dhealth/contracts] chore(package): add base structure for Contracts Library.
- [@dhealth/contracts] feat(types): add exported types for contract parameterization and generic dHealth Network connection.
- [@dhealth/contracts] feat(buffers): add contract buffer classes that prepare binary payloads using JSON, each contract payload is split into header and body.
- [@dhealth/contracts] feat(contracts): add initial contracts implementation for Auth, Earn, Referral and Welcome.
- [@dhealth/contracts] test(base): add initial unit tests for Contract abstraction layer and Auth contract.
- [@dhealth/contracts] test(contracts): add unit tests for contract Earn, Referral and Welcome
- [@dhealth/contracts] build(docs): default to named exports to fix generation of docs
- [@dhealth/contracts] test(contracts): add unit tests for dHealthNetwork connection parameters
- [@dhealth/contracts] docs(base): adapt markup for all classes to correctly display after running typedoc
- [@dhealth/contracts] feat(factories): add implementation for createFromTransaction, refactor error handling
- [@dhealth/contracts] test(factories): add unit tests for Contract.fromTransaction and Factory.createFromX
- [@dhealth/contracts] feat(contracts): add facade methods to access contract signature and payload
- [@dhealth/contracts] deps: update version for first canary and update js-joda
- [@dhealth/contracts] fix(build): use relative path to permit node integrations
- [@dhealth/contracts] fix(api): facade contract classes use public inputs and parameters


[0.3.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.2.0..v0.3.0
