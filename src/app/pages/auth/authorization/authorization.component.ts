import { Component, OnInit, OnDestroy } from '@angular/core';
import {IUser} from "../../../models/users";
import {AuthService} from "../../../services/auth/auth.service";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user/user.service";

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})

export class AuthorizationComponent implements OnInit,OnDestroy {

  loginText='Логин';
  pswText='Пароль';
  login: string;
  psw: string;
  selectedValue: boolean ;
  cardNumber: string;
  authTextButton: string;

  constructor (private authService: AuthService ,
               private messageService: MessageService,
               private router: Router,
               private userService: UserService) { }

  ngOnInit(): void {
    // console.log('init');
    this.authTextButton="Авторизоваться";
  }

  ngOnDestroy(): void  {
    // console.log('destroy');
  }

  vipStatusSelected():void {
  }

  onAuth (ev: Event):void {
    const authUser: IUser = {
      psw: this.psw,
      login: this.login,
      cardNumber: this.cardNumber
    }
    if (this.authService.checkUser(authUser)){
      this.userService.setUser(authUser);
      this.userService.setToken('set-private-token');
      this.userService.setInStore('SAVE-private-token');


      this.router.navigate(['tickets/tickets-list'])
    } else {
      this.messageService.add({severity:'error', summary:'Неверно введены данные'});
       }


  }

}
