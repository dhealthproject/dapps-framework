# @dhealthdapps/backend

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![License](https://img.shields.io/badge/License-LGPL%203.0%20only-blue.svg)][license]
[![Discord](https://img.shields.io/badge/chat-on%20discord-green.svg)][discord]
[![In progress](https://img.shields.io/badge/Status-In%20progress-2b00ff.svg)](CONTRIBUTING.md#project-status)

dHealth dApps Backend with NestJS for [dHealth Network][parent-url].

- [Install notes](#install-notes)
- [Getting help](#getting-help)
- [Contributing](#contributing)
- [License](#license)

**NOTE**: The author(s) and contributor(s) of this package cannot be held responsible for any loss of money or for any malintentioned usage forms of this package. Please use this package with caution.

## Install notes

First make sure to setup your environment by copying the `.env-sample` file into a production equivalent `.env` file.

```bash
cp runtime/backend/.env-sample runtime/backend/.env
```

This software can be installed and deployed using **lerna**. Following commands are available:

```bash
# install all dependencies
lerna bootstrap

# build the vue software
lerna run build --stream --scope @dhealthdapps/backend

# test the vue software
lerna run test --stream --scope @dhealthdapps/backend

# serve/deploy the vue software
lerna run serve --stream --scope @dhealthdapps/backend
```

## Database management

```bash
npx typeorm migration:create migrations/StateUpdate
```

## Getting help

Use the following available resources to get help:

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
[issues]: https://github.com/dhealthproject/dapps-framework/issues
[discord]: https://discord.gg/P57WHbmZjk