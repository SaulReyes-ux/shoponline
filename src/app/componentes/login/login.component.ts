import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';;
import { MessageService } from 'primeng/api';
import { AuthService } from '../../servicios/auth.service';
import { User } from '../../interfaces/auth';
import { error } from 'console';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm= this.fb.group({
    email: ['', [Validators.required,Validators.email]],
    password: ["", [
      Validators.required,
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
    ]],
  })

  constructor(private fb:FormBuilder, private authService:AuthService,
    private router:Router, private messageService:MessageService
    
  ){
    
  }

  get email(){
    return this.loginForm.controls['email'];
  }
  
  get password(){
    return this.loginForm.controls['password'];
  }


  login(){
    console.log('login')
    const {email, password} =this.loginForm.value;

    this.authService.getUserByEmail(email as string).subscribe(
      response=>{
        if(response.length> 0 && response[0].password===password){
          sessionStorage.setItem('email',email as string);
        this.router.navigate(['/home']);

        }else{
          this.messageService.add({severity:'error', summary:'Error', detail: 'Email o Contraseña Incorrecto'})
        }
      },
      error=>{
        this.messageService.add({severity:'error', summary:'Error', detail:'Email o Contraseña Incorrecto'})
      }
    )
  }
}
