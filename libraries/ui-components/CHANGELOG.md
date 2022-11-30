# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.5.4][0.5.4] - 24-Nov-2022

#### Added

- [@dhealth/components] chore: update to alpha version

#### Changed

- [@dhealth/components] fix(build): tests built using webpack, fonts linter issue
- [@dhealth/components] fix(types): export external types

## [0.4.0][0.4.0] - 19-Oct-2022

#### Added

- [@dhealth/components] feat(elements): add new sizes to DappIcon component
- [@dhealth/components] feat(elements): add DappDirectionTriangle and DappAccountDetails components
- [@dhealth/components] style(elements): update DappAccountDetails to use full width
- [@dhealth/components] feat(elements): create DappTitleBar as a header component
- [@dhealth/components] feat(elements): create DappNavigation as a header component
- [@dhealth/components] feat(elements): create DappNavigationItem as a graphic component
- [@dhealth/components] feat(elements): add drawer for DappNavigation, update responsive view
- [@dhealth/components] test(elements): add unit tests for DappNavigation
- [@dhealth/components] feat(elements): add information section and additional information slot to drawer

#### Changed

- [@dhealth/components] refactor: move DappTitleBar to header elements

#### Fixed

- [@dhealth/components] fix(review): update components and tests after rebase

## [0.3.1][0.3.1] - 12-Sep-2022

#### Added

- [@dhealth/components] feat(widgets): add dynamic SVG graphics for transaction parts
- [@dhealth/components] feat(widgets): add transaction graphic for transfer
- [@dhealth/components] feat(widgets): add base transaction graphic implementation
- [@dhealth/components] feat(widgets): add namespace graphics components
- [@dhealth/components] feat(widgets): add component DappAddressAliasTransaction
- [@dhealth/components] feat(widgets): add transaction graphics to exports
- [@dhealth/components] feat(base): create Helper class with RGB conversion helpers
- [@dhealth/components] feat(widgets): add MosaicIcon as a graphic component, refactor with DappGraphicComponent
- [@dhealth/components] feat(widgets): add DappMosaicAliasTransaction component
- [@dhealth/components] feat(widgets): add DappAddCircle component
- [@dhealth/components] feat(widgets): add DappMosaicDefinitionTransaction component
- [@dhealth/components] feat(widgets): Add DappEditCircle as a graphic component
- [@dhealth/components] feat(widgets): add DappMosaicSupplyChangeTransaction component
- [@dhealth/components] feat(widgets): add DappTransferTransaction component
- [@dhealth/components] feat(base): bind custom events for exported components
- [@dhealth/components] feat(widgets): add DappTitleBar component

#### Changed

- [@dhealth/components] refactor(widgets): update widget names for consistency
- [@dhealthdapps/frontend] refactor(base): use signed cookies (removes js-cookies), fix redirection flow with routes

#### Fixed

- [@dhealth/components] fix(widgets): update DappAccountAvatar to use correct checksum
- [@dhealth/components] fix(docs): update documentation and fix unused imports
- [@dhealth/components] fix(review): apply comments and review (#21)
- [@dhealth/components] fix(test): update import path for refactored graphics widgets
- [@dhealth/components] fix(build): apply linter with last changes
- [@dhealth/components] fix(review): apply comments and reviews from PR (#24)
- [@dhealth/components] fix(test): update import path for refactored graphics widgets, fix DappMosaicIcon warning
- [@dhealth/components] fix(build): apply linter with last changes
- [@dhealth/components] fix(review): apply comments and reviews from PR (#24)
- [@dhealth/components] fix(test): update import path for refactored graphics widgets, fix DappMosaicIcon warning
- [@dhealth/components] fix(review): apply comments and reviews from PR (#30)
- [@dhealth/components] fix(widgets): add DappContractOperation component, fix DappTransferTransaction, fix linter/docs
- [@dhealth/components] fix(build): add props initialization
- [@dhealth/components] fix(build): dispatch base emit if not web component

## [0.3.0][0.3.0] - 01-Sep-2022

#### Added

- [@dhealth/components] build: add correct order for imports and code style in DappMosaic
- [@dhealth/components] feat(elements): add DappInput and DappMosaic form components
- [@dhealth/components] build: add web component wrapper as a library
- [@dhealth/components] feat(elements): add export of components as web components

#### Changed

- [@dhealth/components] refactor: improve perf for web components

#### Fixed

- [@dhealth/components] fix(test): add utf-8-validate and bufferutil externals fill, DappMosaic code style

## [0.2.0][0.2.0] - 13-Jul-2022

#### Added

- [@dhealth/components] feat(widgets): Add DappAccountCard as a widget component
- [@dhealth/components] feat(graphics): Add DappAccountAvatar as a graphic component
- [@dhealth/components] feat(fields): Add DappMessage as a field component
- [@dhealth/components] feat(fields): Add DappDate as a field component
- [@dhealth/components] feat(texts): Add DappTitle as a texts component
- [@dhealth/components] test(controls): Add unit test for @click handler to DappButton
- [@dhealth/components] feat(controls): Add @click handler to DappButton
- [@dhealth/components] refactor(graphics): Update style names to be unique for DappIcon component
- [@dhealth/components] test(graphics): Add unit tests for DappIcon
- [@dhealth/components] feat(graphics): Add DappIcon as a graphics component

## [0.1.0][0.1.0] - 19-Jun-2022

#### Added

- [@dhealth/components] chore(build): adds SCSS build, TailWind and PostCSS commands
- [@dhealth/components] feat(fonts): adds custom font Plus Jakarta Sans and base fonts overwrite with TailWind
- [@dhealth/components] chore(build): adds dHealth Design System colors and support for nested classes with PostCSS/SCSS
- [@dhealth/components] feat(base): adds custom Tailwind classes and implements ActionButton
- [@dhealth/components] chore(deps): adds @dhealth libraries and lodash
- [@dhealth/components] chore(deps): downgrades vue to v2.6.x for stability reasons
- [@dhealth/components] chore(deps): upgrades webpack to v5 for unit testing functionality
- [@dhealth/components] test: adds relevant tests for DappButton
- [@dhealth/components] docs(api): adds example usage with install method
- [@dhealth/components] feat(widgets): add implementation for DappQR base component


[0.5.4]: https://github.com/dhealthproject/dapps-framework/compare/v0.4.0..v0.5.4
[0.4.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.3.0..v0.4.0
[0.3.1]: https://github.com/dhealthproject/dapps-framework/compare/v0.3.0..v0.3.1
[0.3.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.2.0..v0.3.0
[0.2.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.1.0..v0.2.0
[0.1.0]: https://github.com/dhealthproject/dapps-framework/releases/tag/v0.1.0
