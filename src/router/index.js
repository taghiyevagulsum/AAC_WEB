import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import SignUpPage from '../views/SignUpPage.vue'
import AACInterface from '../views/AACInterface.vue'

console.log('Creating router...');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpPage
    },
    {
      path: '/aac',
      name: 'aac',
      component: AACInterface
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(`Navigating to: ${to.fullPath}`);
  next();
});

console.log('Router created.');

export default router
