import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        canActivate: [guestGuard],
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
            },
            {
                path: 'forgot-password',
                loadComponent: () => import('./features/auth/forgot-password/forgot-password').then(m => m.ForgotPassword)
            },
            {
                path: 'callback',
                loadComponent: () => import('./features/auth/callback/callback').then(m => m.Callback)
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'home',
        loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayout),
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
            },
            {
                path: 'tasks',
                loadComponent: () => import('./features/tasks/tasks').then(m => m.Tasks)
            },
            {
                path: 'habits',
                loadComponent: () => import('./features/habits/habits').then(m => m.Habits)
            },
            {
                path: 'stats',
                loadComponent: () => import('./features/stats/stats').then(m => m.Stats)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/home/dashboard'
    }
];