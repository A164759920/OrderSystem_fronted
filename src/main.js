// Vue 组件
import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// Custom 组件
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

Vue.config.productionTip = false;

Vue.directive("sticky", {
  inserted(el, binding) {
    const rect = el.getBoundingClientRect();
    const originTop = rect.top + window.pageYOffset;
    const originLeft = rect.left + window.pageXOffset;
    if (!binding.value.top) {
      binding.value.top = 0;
    }
    const paddingTop = binding.value.top || 0; //吸顶偏移量
    const paddingBottom = binding.value.bottom;
    window.stickyScrollCallback = () => {
      if (window.pageYOffset > originTop - paddingTop) {
        //使用模板字符串拼接
        //模板字符串拼接css
        if (binding.value.isVertical === false) {
          el.style.cssText = `     
          position: fixed;
          left: ${originLeft}px;
          top: ${paddingTop}px;
          bottom:${paddingBottom}px;
          transition: all 0.5s ease-in-out`;
        }
      } else {
        el.style.cssText = ``;
      }
    }; //监听scroll事件
    window, addEventListener("scroll", window.stickyScrollCallback);
  },
  unbind() {
    window.removeEventListener("scroll", window.stickyScrollCallback);
  },
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
