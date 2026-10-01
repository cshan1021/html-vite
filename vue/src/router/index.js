// vue\src\router\index.js
import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import HomePage from '@/features/home/HomePage.vue';
import BoardList from '@/features/board/ListPage.vue';
import BoardDetail from '@/features/board/DetailPage.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: HomePage,
      },
      {
        path: 'board',
        name: 'BoardList',
        component: BoardList,
      },
{
        path: 'board/:id',
        name: 'BoardDetail',
        component: BoardDetail,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;