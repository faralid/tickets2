import { Component, OnInit } from '@angular/core';
import {MessageService} from "primeng/api";
import {IUser} from "../../../models/users";
import {AuthService} from "../../../services/auth/auth.service";
import {ConfigService} from "../../../services/config/config.service";


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent implements OnInit {
  login: string;
  psw: string;
  pswRepeat: string;
  email: string;
  cardNumber: string;

  saveUserLocalStore: [login: string,
  psw: string] ;
  showUserCard: boolean ;

  constructor(private messageService: MessageService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.showUserCard=ConfigService.config.useUserCard
  }

  registration(ev: Event):void|boolean{
if (this.psw !== this.pswRepeat){
  this.messageService.add({severity:'error', summary:'Пароли не совпадают'});
  return false;
}
const userObj: IUser = {
  psw: this.psw,
  cardNumber: this.cardNumber,
  login: this.login,
  email: this.email
}
if (!this.authService.isUserExists(userObj)){
  this.authService.setUser(userObj);
  if (this.saveUserLocalStore) {
    const objUserJSString = JSON.stringify(userObj);
    window.localStorage.setItem(userObj.login, objUserJSString);
  }
  this.messageService.add({severity:'success', summary:'Регистрация прошла успешно'});
} else {
  this.messageService.add({severity:'warn', summary:'Пользователь уже зарегистрирован'});
}

  }


}

