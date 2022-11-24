# @dhealth/components

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![License](https://img.shields.io/badge/License-LGPL%203.0%20only-blue.svg)][license]
[![Discord](https://img.shields.io/badge/chat-on%20discord-green.svg)][discord]
[![In progress](https://img.shields.io/badge/Status-In%20progress-2b00ff.svg)](CONTRIBUTING.md#project-status)

Components library for dApps Development with [dHealth Network][parent-url].

- [Install notes](#install-notes)
- [Getting help](#getting-help)
- [Contributing](#contributing)
- [License](#license)

**NOTE**: The author(s) and contributor(s) of this package cannot be held responsible for any loss of money or for any malintentioned usage forms of this package. Please use this package with caution.

## Install notes

This library can be installed in your Javascript or Typescript project using `npm install @dhealth/components`.

### Getting started with Vue

If you are developing a Vue software, note that you must register the components by installing the plugin on the Vue app instance.

```typescript
// examples/GettingStartedWithVue.ts

// import
import { createApp } from 'vue'
import App from './App.vue'
import plugin from '@dhealth/components';

// install
createApp(App)
  .use(plugin)
  .mount("#app");
```

#### Use in Vue templates

```typescript
// examples/UseInVueTemplates.ts

// use in templates
import { DappTokenAmount } from '@dhealth/components';
new Vue({
  el: '#app',
  components: { DappTokenAmount },
  template: '<DappTokenAmount />'
});
```

### Getting started with other software

If you are developing a PWA / Browser application or mobile software, you may use the UMD bundle to leverage the features of this library.

Note: the following example uses Vue in-browser, this can be replaced by any other framework and libraries including React, React Native, Angular, amongst many others.

```typescript
// examples/GettingStartedWithBrowser.ts

// install
Vue.use(window.dHealthComponents.default);

// use in templates
new Vue({
  el: '#app',
  template: '<DappTokenAmount />',
});

// or use programmatically
console.log(window.dHealthComponents.DappTokenAmount);
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
[parent-url]: https://dhealth.network
[docs]: https://docs.dhealth.com
[docs-framework]: https://dhealthproject.github.io/dapps-framework/
[issues]: https://github.com/dhealthproject/dapps-framework/issues
[discord]: https://discord.gg/P57WHbmZjk
