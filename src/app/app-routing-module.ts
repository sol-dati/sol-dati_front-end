import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Project } from './features/project/project';
import { Home } from './features/home/home';
import { Fact } from './features/project/fact/fact';

const routes: Routes = [
  {path: '', component: Home},
  {path:'projects', component: Project},
  {path:'fact', component: Fact}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
