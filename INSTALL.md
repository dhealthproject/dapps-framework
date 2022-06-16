# Install notes for dHealth dApps Framework

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![License](https://img.shields.io/badge/License-LGPL%203.0%20only-blue.svg)][license]
[![Discord](https://img.shields.io/badge/chat-on%20discord-green.svg)][discord]

dHealth dApps Framework for [dHealth Network][parent-url].

## Getting started

### Dependencies

This project is maintained with [**lerna**](https://lerna.js.org/) to permit joining multiple sub-projects together in one codebase. 

```
  - node v12+
  - lerna v4
```

You can install lerna globally using `npm install -g lerna@4.0.0`.

### Install

Following command installs the **dapp-framework**:

```bash
lerna bootstrap
```

### Runtimes

Our **dapps-framework** comes with batteries included! In fact, this framework includes several so-called *runtimes* that can be configured independently. Following are the currently available runtimes:

| Path | Package | Description |
| --- | --- | --- |
| [`runtime/backend`](./tree/main/runtime/backend#developer-notes) | `@dhealthdapps/backend` | A NestJS backend for development of dApps with dHealth Network. |
| [`runtime/dapp-frontend-vue`](./tree/main/runtime/dapp-frontend-vue#developer-notes) | `@dhealthdapps/frontend` | A VueJS frontend for development of dApps with dHealth Network. |

### Development server

#### Getting started with a development server

You can start a full development server using the following command:

```bash
docker-compose -f runtime/backend/docker-compose.yml up --build -d
```

The development server's API runs on port `9229` and the mongodb instances uses port `27017` (default).

#### Running Mongo as a background process (Optional)

Developers may also start the mongo container as a stand-alone background process:

```bash
docker-compose -f runtime/backend/docker-compose.yml mongodb -d
```

#### Using lerna to create faster builds (Optional)

Using `lerna`, starting a development server can be done \[faster\] using the following command:

```bash
lerna run serve --stream --scope @dhealthdapps/frontend

# Note that the following needs a running mongo server (locally)
lerna run serve --stream --scope @dhealthdapps/backend
```

Alternatively, you can use the helper NPM scripts that are provided in the root package.json:

```bash
npm run serve:app

# Note that the following needs a running mongo server (locally)
npm run serve:api
```

Note that the above two processes are **long-running processes** that *watch* individual file changes and rebuilds packages accordingly.

You can also run the *build* and *test* scripts individually without serving the compiled software:

```bash
lerna run build --stream --scope @dhealthdapps/frontend
lerna run build --stream --scope @dhealthdapps/backend
```

## Getting help

Use the following available resources to get help:

- [dHealth Documentation][docs]
- Join the community on [Discord][discord] 
- If you found a bug, [open a new issue][issues]

## License

Copyright 2022-present [dHealth Network][parent-url], All rights reserved.

Licensed under the [LGPL v3.0](LICENSE)

[license]: https://opensource.org/licenses/LGPL-3.0
[parent-url]: https://dhealth.network
[docs]: https://docs.dhealth.com
[issues]: https://github.com/dhealthproject/dapps-framework/issues
[discord]: https://discord.gg/P57WHbmZjk