// install
Vue.use(window.dHealthComponents.default);

// use in templates
new Vue({
  el: '#app',
  template: '<DappTokenAmount />',
});

// or use programmatically
console.log(window.dHealthComponents.DappTokenAmount);