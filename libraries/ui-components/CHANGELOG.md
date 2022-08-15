# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## 0.3.0 - Unreleased

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


[0.2.0]: https://github.com/dhealthproject/dapps-framework/compare/v0.1.0..v0.2.0
[0.1.0]: https://github.com/dhealthproject/dapps-framework/releases/tag/v0.1.0
