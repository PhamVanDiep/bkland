import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { route } from './user.routing';
import { CreateMainPostComponent } from './create-main-post/create-main-post.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { LoadingService } from 'src/app/core/services/loading.service';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  declarations: [
    CreateMainPostComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    DropdownModule,
    RippleModule
  ],
  providers: [
    MessageService,
    LoadingService
  ]
})
export class UserModule { }
