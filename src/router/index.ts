import { createRouter, createWebHashHistory } from 'vue-router';
import { getToken, clearToken } from '@/utils/auth';
import { messageStore, userStore } from '@/stores/front';
import { apiCheckLoginStatus } from '@/api/admin/adminUsers';
import type { AppErrorResponse } from '@/types/common';

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
    path: '/admin-signin',
    name: 'adminSignin',
    component: () => import('../views/admin/AdminSignin.vue'),
  },
  {
    path: '/dashboard',
    component: () => import('../views/admin/DashboardLayout.vue'),
    meta: { requiresAdminAuth: true },
    children: [
      {
        path: '',
        name: 'overview',
        component: () => import('../views/admin/OverView.vue'),
      },
      {
        path: 'users',
        name: 'adminUsers',
        component: () => import('../views/admin/UsersView.vue'),
      },
      {
        path: 'user/:id',
        name: 'adminUserEdit',
        component: () => import('../views/admin/UserEditView.vue'),
      },
      {
        path: 'recipes',
        name: 'adminRecipes',
        component: () => import('../views/admin/RecipesView.vue'),
      },
      {
        path: 'recipe/:id',
        name: 'adminRecipeEdit',
        component: () => import('../views/admin/RecipeEditView.vue'),
      },
      {
        path: 'categories',
        name: 'adminCategories',
        component: () => import('../views/admin/CategoriesView.vue'),
      },
      {
        path: 'tags',
        name: 'adminTags',
        component: () => import('../views/admin/TagsView.vue'),
      },
      {
        path: 'images',
        name: 'adminImages',
        component: () => import('../views/admin/ImagesView.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
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

router.beforeEach(async to => {
  const token = getToken();
  const messageRef = messageStore();
  const { pushMessage } = messageRef;

  // 前台：使用 token 判斷是否登入
  if (to.meta.requiresAuth && token === '') {
    const userRef = userStore();
    userRef.checkLogin();
    pushMessage({
      style: 'danger',
      title: '您尚未登入',
      text: '請先登入後再進行操作',
    });
    router.push('/signin');
  }

  // 後台：打 API 驗證是否為管理員
  if (to.meta.requiresAdminAuth) {
    if (token === '') {
      router.push('/admin-signin');
      return;
    }

    try {
      await apiCheckLoginStatus();
    } catch (err) {
      clearToken();

      pushMessage({
        style: 'danger',
        title: '登入已失效',
        text: (err as AppErrorResponse).message || '登入已失效，請重新登入',
      });

      router.push('/admin-signin');
    }
  }
});

export default router;
