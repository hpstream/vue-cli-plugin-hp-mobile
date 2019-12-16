import deal from './deal.vue';
const components = [deal];

export default {
  install: function (Vue) {
    components.forEach(component => {
      Vue.component(component.name, component);
    });
  }
}
