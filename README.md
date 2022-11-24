# dHealth dApps Framework

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![License](https://img.shields.io/badge/License-LGPL%203.0%20only-blue.svg)][license]
[![Discord](https://img.shields.io/badge/chat-on%20discord-green.svg)][discord]
[![In progress](https://img.shields.io/badge/Status-In%20progress-2b00ff.svg)](CONTRIBUTING.md#project-status)

dHealth dApps Framework for [dHealth Network][parent-url].

- [Install notes](INSTALL.md)
- [Concepts](#concepts)
- [Developer notes](#developer-notes)
- [Getting help](#getting-help)
- [Contributing](#contributing)
- [License](#license)

**NOTE**: The author(s) and contributor(s) of this package cannot be held responsible for any loss of money or for any malintentioned usage forms of this package. Please use this package with caution.

## Concepts

This framework aims to make it easier to access dHealth Network features and to develop dApps with dHealth Network.

This software package includes multiple *libraries* and *runtimes* that can be configured separately and that can be extended and modified freely.

### Scopes

In the source code of this framework, you will find *several feature scopes* that are separately implemented and that can be enabled/disabled by configuration.

Following scopes are defined with their respective description:

| Scope | Documentation | Description |
| --- | --- | --- |
| `common` | [`AppModule`][docs-scopes-common] | Contains source code that is shared amongst *all* dApps. |
| `discovery` | [`DiscoveryModule`][docs-scopes-discovery] | Contains source code for the *discovery* of entities on dHealth Network, e.g. *Transactions*, *Accounts*, *Blocks*, etc. |
| `notifier` | [`NotifierModule`][docs-scopes-notifier] | Contains source code to enable maintenance *notifications* that are sent out per email to the team in the case of errors or warnings. |
| `payout` | [`PayoutModule`][docs-scopes-payout] | Contains source code for the *payout of tokens* on dHealth Network. Payouts can be configured to work with any *mosaic* on dHealth Network. |
| `processor` | [`ProcessorModule`][docs-scopes-processor] | Contains source code for the *processor* of entities on dHealth Network. The implementation stores *operations* after reading *transactions*. |
| `statistics` | [`StatisticsModule`][docs-scopes-statistics] | Contains source code for the *aggregate of data* related to a dApp. |

**CAUTION**: The above feature scopes *may* be modified in the near- to mid-future, as we are discovering more use for some of the listed feature scopes.

### Runtimes

Our **dapps-framework** comes with batteries included! In fact, this framework includes several so-called *runtimes* that can be configured independently and *libraries* that offer several focussed feature sets. Following are the currently available runtimes:

| Path | Package | Documentation | Description |
| --- | --- | --- | --- |
| [`runtime/backend`](./tree/main/runtime/backend#install-notes) | [`@dhealthdapps/backend`][npm-backend-nest] | [Reference documentation][docs-backend-nest] | A NestJS backend for development of dApps with dHealth Network. |
| [`runtime/dapp-frontend-vue`](./tree/main/runtime/dapp-frontend-vue#install-notes) | [`@dhealthdapps/frontend`][npm-frontend-vue] | [Reference documentation][docs-frontend-vue] | A VueJS frontend for development of dApps with dHealth Network. |

### Libraries

Our **dapps-framework** also includes re-usable *libraries* for Typescript and Javascript developers! These libraries offer several focussed feature sets. Following are the currently available libraries:

| Path | Package | Documentation | Description |
| --- | --- | --- | --- |
| [`libraries/contracts`](./tree/main/libraries/contracts#install-notes) | [`@dhealth/contracts`][npm-libs-contracts] | [Reference documentation][docs-libs-contracts] | A library for creating smart contracts compatible with this software package. |
| [`libraries/ui-components`](./tree/main/libraries/ui-components#install-notes) | [`@dhealth/components`][npm-libs-components] | [Reference documentation][docs-libs-components] | A library of Components available for re-use that feature some of the utilites as displayed on the Frontend Runtime. |

## Developer notes

As a developer, you *may* install `lerna` globally on your machine with: `npm install -g lerna` ; or you can also use this package's local lerna installation using `npx lerna`.

Following command installs all sub-project dependencies (local and remote):

```bash
lerna bootstrap
```

Please read the [INSTALL NOTES](INSTALL.md) to find out more about how to run this software in development and production environments.

### Building packages

Using lerna instead of npm, scripts will run directly inside *all* packages (use `--parallel` for parallel execution). If using npm or yarn, use the scripts as provided in package.json.

```bash
lerna run lint --stream
lerna run build --stream
lerna run test --stream
lerna run docs --stream
```

Note that we recommend using the `--stream` flag to stream logs without delay.
Note also that we recommend using the `--scope` argument using one of the following package identifiers to optimize the building and testing process:

- `@dhealth/contract`: Build, test or generate documentation for the Contracts library.
- `@dhealth/components`: Build, test or generate documentation for the Components library.
- `@dhealthdapps/backend`: Build, test or generate documentation for the Backend runtime.
- `@dhealthdapps/frontend`: Build, test or generate documentation for the Backend runtime.

i.e. Following commands are **recommended** and apply for developers that aim to build-, test- or generate documentation for this software package:

```bash
# Build, test and generate docs for Contracts Library
lerna run lint --stream --scope @dhealth/contracts
lerna run build --stream --scope @dhealth/contracts
lerna run test --stream --scope @dhealth/contracts
lerna run docs --stream --scope @dhealth/contracts

# Build, test and generate docs for Components Library
lerna run lint --stream --scope @dhealth/components
lerna run build --stream --scope @dhealth/components
lerna run test --stream --scope @dhealth/components
lerna run docs --stream --scope @dhealth/components

# Build, test and generate docs for Backend Runtime
lerna run lint --stream --scope @dhealthdapps/backend
lerna run build --stream --scope @dhealthdapps/backend
lerna run test --stream --scope @dhealthdapps/backend
lerna run docs --stream --scope @dhealthdapps/backend

# Build, test and generate docs for Frontend Runtime
lerna run lint --stream --scope @dhealthdapps/frontend
lerna run build --stream --scope @dhealthdapps/frontend
lerna run test --stream --scope @dhealthdapps/frontend
lerna run docs --stream --scope @dhealthdapps/frontend
```

### Running individual package scripts

e.g. If you want to run the `serve` script inside the `package.json` of `@dhealthdapps/backend`, use the following command:

```bash
# run in one package
lerna run serve --scope @dhealthdapps/backend --stream

# or run in all packages
lerna run serve --stream
```

## Getting help

Use the following available resources to get help:

- [Framework Documentation][docs-framework]
- [dHealth Documentation][docs]
- Join the community on [Discord][discord] 
- If you found a bug, [open a new issue][issues]

## Contributing

Contributions are welcome and appreciated. 
Check [CONTRIBUTING](CONTRIBUTING.md) for information on how to contribute.

## License

Copyright 2022-present [dHealth Network][parent-url], All rights reserved.

Licensed under the [LGPL v3.0](LICENSE)

[license]: https://opensource.org/licenses/LGPL-3.0
[parent-url]: https://dhealth.com
[docs]: https://docs.dhealth.com
[docs-framework]: https://dhealthproject.github.io/dapps-framework/
[issues]: https://github.com/dhealthproject/dapps-framework/issues
[discord]: https://discord.gg/P57WHbmZjk
[npm-libs-contracts]: https://www.npmjs.com/package/@dhealth/contracts
[npm-libs-components]: https://www.npmjs.com/package/@dhealth/components
[npm-frontend-vue]: https://www.npmjs.com/package/@dhealthdapps/frontend
[npm-backend-nest]: https://www.npmjs.com/package/@dhealthdapps/backend
[docs-libs-contracts]: https://dhealthproject.github.io/dapps-framework/libraries/contracts/docs/
[docs-libs-components]: https://dhealthproject.github.io/dapps-framework/libraries/ui-components/docs/
[docs-frontend-vue]: https://dhealthproject.github.io/dapps-framework/runtime/dapp-frontend-vue/docs/
[docs-backend-nest]: https://dhealthproject.github.io/dapps-framework/runtime/backend/docs/
[docs-scopes-common]: https://dhealthproject.github.io/dapps-framework/runtime/backend/docs/classes/AppModule.html
[docs-scopes-discovery]: https://dhealthproject.github.io/dapps-framework/runtime/backend/docs/classes/DiscoveryModule.html
[docs-scopes-notifier]: https://dhealthproject.github.io/dapps-framework/runtime/backend/docs/classes/NotifierModule.html
[docs-scopes-payout]: https://dhealthproject.github.io/dapps-framework/runtime/backend/docs/classes/PayoutModule.html
[docs-scopes-processor]: https://dhealthproject.github.io/dapps-framework/runtime/backend/docs/classes/ProcessorModule.html
[docs-scopes-statistics]: https://dhealthproject.github.io/dapps-framework/runtime/backend/docs/classes/StatisticsModule.html
