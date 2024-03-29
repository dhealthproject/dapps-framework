# Install notes for dHealth dApps Framework

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![License](https://img.shields.io/badge/License-LGPL%203.0%20only-blue.svg)][license]
[![Discord](https://img.shields.io/badge/chat-on%20discord-green.svg)][discord]

dHealth dApps Framework for [dHealth Network][parent-url].

- [Getting started](#getting-started)
- [Dependencies](#dependencies)
- [Production server](#production)
- [Development server](#development)
- [Getting help](#getting-help)
- [License](#license)

<a name="caution-experimental"></a>
**NOTE**: This software package is still experimental and we *do not recommend* to use the source code in production environment.

**NOTE**: The author(s) and contributor(s) of this package cannot be held responsible for any loss of money or for any malintentioned usage forms of this package. Please use this package with caution.

## Getting started

### Dependencies

This project is maintained with [**lerna**](https://lerna.js.org/) to permit joining multiple sub-projects together in one codebase. 

```
  - node v16+ (stable LTS)
  - lerna v4
```

You can install lerna globally using `npm install -g lerna@4.0.0`.

Following command installs the **dapp-framework** dependencies:

```bash
lerna bootstrap
```

## <a name="production"></a>Production server

We recommend using our **docker images** to run dHealth dApps that are powered by the dHealth dApps Framework.

Following commands can be used to deploy a production environment:

```bash
docker-compose up --build -d
lerna run serve --stream --scope @dhealthdapps/frontend
```

**Caution:** As mentioned [here](#caution-experimental), this software is still **experimental** and we do not recommend running production environments with the *alpha* versions of the software.

## <a name="development"></a>Development server

#### Running a development server

You can start a full development server using the following command:

```bash
docker-compose up --build -d
```

The development server's API runs on port `9229` and the mongodb instances uses port `27017` (default).

#### Running Mongo as a background process (Optional)

Developers may also start the mongo container as a stand-alone background process:

```bash
docker-compose up mongodb -d
```

#### Using lerna to create faster builds (Optional)

Using `lerna`, starting a development server can be done \[faster\] using the following command:

```bash
# Starting a VueJS frontend development server
lerna run serve --stream --scope @dhealthdapps/frontend

# Stating a NestJS backend development server
# Note that the following needs a running mongo server (locally)
# Note also that you must create a `.env` file in the root folder
cp runtime/backend/.env-sample runtime/backend/.env
lerna run serve --stream --scope @dhealthdapps/backend
```

Note that the above two processes are **long-running processes** that *watch* individual file changes and rebuilds packages accordingly.

#### Compiling and testing the software

You can also run the *build* and *test* scripts individually without serving the compiled software:

```bash
# Compiling and testing the components library
lerna run build --stream --scope @dhealth/components
lerna run test --stream --scope @dhealth/components

# Compiling and testing the VueJS frontend
lerna run build --stream --scope @dhealthdapps/frontend
lerna run test --stream --scope @dhealthdapps/frontend

# Compiling and testing the NestJS backend
cp runtime/backend/.env-sample runtime/backend/.env
lerna run build --stream --scope @dhealthdapps/backend
lerna run test --stream --scope @dhealthdapps/backend
```

## Getting help

Use the following available resources to get help:

- [Framework Documentation][docs-framework]
- [dHealth Documentation][docs]
- Join the community on [Discord][discord] 
- If you found a bug, [open a new issue][issues]

## License

Copyright 2022-present [dHealth Network][parent-url], All rights reserved.

Licensed under the [LGPL v3.0](LICENSE)

[license]: https://opensource.org/licenses/LGPL-3.0
[parent-url]: https://dhealth.com
[docs]: https://docs.dhealth.com
[docs-framework]: https://dhealthproject.github.io/dapps-framework/
[issues]: https://github.com/dhealthproject/dapps-framework/issues
[discord]: https://discord.gg/P57WHbmZjk
