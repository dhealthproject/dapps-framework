# dHealth dApps Framework

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![License](https://img.shields.io/badge/License-LGPL%203.0%20only-blue.svg)][license]
[![Discord](https://img.shields.io/badge/chat-on%20discord-green.svg)][discord]

dHealth dApps Framework for [dHealth Network][parent-url].

- [Requirements](#requirements)
- [Dependencies](#dependencies)
- [Install notes](INSTALL.md)
- [Developer notes](#developer-notes)
- [Getting help](#getting-help)
- [Contributing](#contributing)
- [License](#license)

**NOTE**: The author(s) and contributor(s) of this package cannot be held responsible for any loss of money or for any malintentioned usage forms of this package. Please use this package with caution.

## Dependencies

This project is maintained with [**lerna**](https://lerna.js.org/) to permit joining multiple sub-projects together in one codebase. 

```
  - node v12+
  - lerna v4
```

## Developer notes

As a developer, you *may* install `lerna` globally on your machine with: `npm install -g lerna` ; or you can also use this package's local lerna installation using `npx lerna`.

Following command installs all sub-project dependencies:

```bash
lerna bootstrap
```

### Building packages

Using lerna instead of npm, scripts will run directly inside *all* packages (use `--parallel` for parallel execution). If using npm or yarn, use the scripts as provided in package.json.

```bash
lerna run build --stream
lerna run test --stream
lerna run docs --stream
```

Note that we recommend using the `--stream` flag to stream logs without delay.

### Running individual package scripts

e.g. If you want to run the `serve` script inside the `package.json` of `@dhealthdapps/backend`, use the following command:

```bash
# run in one package
npx lerna run serve --scope @dhealthdapps/backend

# or run in all packages
npx lerna run serve
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
[parent-url]: https://dhealth.network
[docs]: https://docs.dhealth.com
[issues]: https://github.com/dhealthproject/dapps-framework/issues
[discord]: https://discord.gg/P57WHbmZjk
