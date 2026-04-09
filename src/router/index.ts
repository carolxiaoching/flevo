import { createRouter, createWebHashHistory } from 'vue-router';
import { getToken } from '@/utils/auth';
import { messageStore, userStore } from '@/stores/index';

const routes = [
  {
    path: '/',
    name: 'layout',
    component: () => import('../views/front/LayoutView.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/front/HomeView.vue'),
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('../views/front/AboutView.vue'),
      },
      {
        path: 'contact',
        name: 'contact',
        component: () => import('../views/front/ContactView.vue'),
      },
      {
        path: 'qa',
        name: 'qa',
        component: () => import('../views/front/QAView.vue'),
      },
      {
        path: 'signin',
        name: 'signin',
        component: () => import('../views/front/SignInView.vue'),
      },
      {
        path: 'signup',
        name: 'signup',
        component: () => import('../views/front/SignUpView.vue'),
      },
      {
        path: 'reset-password',
        name: 'resetPassword',
        component: () => import('../views/front/ResetPassword.vue'),
      },
      {
        path: 'forget-password',
        name: 'forgetPassword',
        component: () => import('../views/front/ForgetPassword.vue'),
      },
      {
        path: 'recipes',
        name: 'recipes',
        component: () => import('../views/front/RecipesView.vue'),
      },
      {
        path: 'recipe/:id',
        name: 'recipe',
        component: () => import('../views/front/RecipeView.vue'),
      },
      {
        path: 'recipe-edit/:id',
        name: 'recipeEdit',
        component: () => import('../views/front/RecipeEditView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'user/:id',
        name: 'user',
        component: () => import('../views/front/UserView.vue'),
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('../views/front/SettingView.vue'),
      },
    ],
  },
  {
    path: '/:pathMath(.*)*',
    component: () => import('../views/NotFoundView.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  linkExactActiveClass: 'active',
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(to => {
  // 若無 token 且為需要登入的頁面，則轉址到登入頁面
  const userRef = userStore();
  const messageRef = messageStore();
  const token = getToken();

  if (to.meta.requiresAuth && token === '') {
    userRef.checkLogin();
    messageRef.pushMessage({
      style: 'danger',
      title: '您尚未登入',
      text: '請先登入後再進行操作',
    });
    router.push('/signIn');
  }
});

export default router;
