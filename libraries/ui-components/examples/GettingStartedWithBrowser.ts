// install
Vue.use(window.dHealthComponents.default);

// use in templates
new Vue({
  el: '#app',
  template: '<TokenAmount />',
});

// or use programmatically
console.log(window.dHealthComponents.TokenAmount);