import Vue from "vue";
import VueRouter from "vue-router";
// 导入主视图
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";

// 导入子视图
import Order from "@/components/Order.vue";
import Manage from "@/components/Manage.vue";
import AnalyseData from "@/components/AnalyseData.vue";

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const routes = [
  {
    path: "/home",
    name: "home",
    component: HomeView,
    children: [
      {
        path: "/",
        redirect: "/home/order",
      },
      {
        path: "order",
        component: Order,
      },
      {
        path: "analyse",
        component: AnalyseData,
      },
      {
        path: "manage",
        component: Manage,
      },
    ],
  },
  {
    path: "/login",
    name:"login",
    component: LoginView,
  },
  {
    path: "/register",
    name:"register",
    component: RegisterView,
  },
];

// 路由守卫配置



const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
