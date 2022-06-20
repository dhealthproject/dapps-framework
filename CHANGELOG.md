# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.1.0][0.1.0] - 19-Jun-2022

#### Added

- [framework] chore(package): add scoped scripts for subprojects (library, frontend, backend)
- [framework] chore(package): add components library `@dhealth/components`
- [framework] chore(package): add internal `@dhealth/components` through lerna
- [framework] chore(package): add runtime for VueJS frontend `@dhealthdapps/frontend`
- [framework] chore(package): add runtime for NestJS backend `@dhealthdapps/backend`
- [framework] docs: add installation notes in `INSTALL.md` for production and development
- [framework] docs: add relevant `CHANGELOG.md` commit types, scopes and messages guidelines
- [@dhealth/components] chore(build): add SCSS build, TailWind and PostCSS commands
- [@dhealth/components] feat(fonts): add custom font Plus Jakarta Sans and base fonts overwrite with TailWind
- [@dhealth/components] chore(build): add dHealth Design System colors and support for nested classes with PostCSS/SCSS
- [@dhealth/components] feat(base): add custom Tailwind classes and implements ActionButton
- [@dhealth/components] chore(deps): add @dhealth libraries and lodash
- [@dhealth/components] chore(deps): downgrades vue to v2.6.x for stability reasons
- [@dhealth/components] chore(deps): upgrades webpack to v5 for unit testing functionality
- [@dhealth/components] test: adds relevant tests for DappButton
- [@dhealth/components] docs(api): adds example usage with install method
- [@dhealth/components] feat(widgets): add implementation for DappQR base component
- [@dhealthdapps/frontend] chore(config): apdates base module configuration needs
- [@dhealthdapps/frontend] fix(kernel): add working AppKernel implementation for vue2
- [@dhealthdapps/frontend] chore(config): updates base module configuration needs
- [@dhealthdapps/frontend] chore(package): formats readme, adds correct iconset, fixes wording
- [@dhealthdapps/frontend] feat(theme): adds tailwindcss@3.0.x and moves assets to resources/
- [@dhealthdapps/backend] feat(backend): add @dhealthdapps/backend in runtime
- [@dhealthdapps/backend] test: add and update tests for accounts discovery, network and state services
- [@dhealthdapps/backend] fix(tests): fix NetworkService connection necessity, fix unit tests usage of any keyword
- [@dhealthdapps/backend] fix: fix mongo connection payload with authSource and use mongo:latest image
- [@dhealthdapps/backend] refactor: refactor nest software with per-scope modules
- [@dhealthdapps/backend] refactor: add implementation for schedulers enabled through scopes and more refactor (types)


[0.1.0]: https://github.com/dhealthproject/dapps-framework/releases/tag/v0.1.0
