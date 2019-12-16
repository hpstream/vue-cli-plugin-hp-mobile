import VueTouch from './VueTouch';
Vue.directive("tap", {
  bind: function (el, binding) {
    // console.log(binding);
    new VueTouch(el, binding, "tap");
  }
});
Vue.directive("swipe", {
  bind: function (el, binding) {
    new VueTouch(el, binding, "swipe");
  }
});
Vue.directive("swipeleft", {
  bind: function (el, binding) {
    new VueTouch(el, binding, "swipeleft");
  }
});
Vue.directive("swiperight", {
  bind: function (el, binding) {
    new VueTouch(el, binding, "swiperight");
  }
});
Vue.directive("swipedown", {
  bind: function (el, binding) {
    new VueTouch(el, binding, "swipedown");
  }
});
Vue.directive("swipeup", {
  bind: function (el, binding) {
    new VueTouch(el, binding, "swipeup");
  }
});
Vue.directive("longtap", {
  bind: function (el, binding) {
    new VueTouch(el, binding, "longtap");
  }
});