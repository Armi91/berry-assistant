import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { loggedInGuard } from './_guards/logged-in.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'u/chat',
    pathMatch: 'full',
  },
  {
    path: 'u',
    component: LayoutComponent,
    canActivate: [loggedInGuard],
    children: [
      {
        path: 'chat',
        loadChildren: () =>
          import('./chat/chat.module').then((m) => m.ChatModule),
      },
      {
        path: 'images',
        loadChildren: () =>
          import('./image-generation/image-generation.module').then(
            (m) => m.ImageGenerationModule
          ),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
