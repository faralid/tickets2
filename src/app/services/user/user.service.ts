import { Injectable } from '@angular/core';
import {IUser} from "../../models/users";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: IUser | null;
  private  token: string | null;

  constructor() { }

  getUser(): IUser| null {
   return this.user;
  };

  setUser(user: IUser):void {
   this.user = user ;
  };



  getToken(): string | null {
    return this.token;
  };

  setToken(token : string) : void {
    this.token = token;
  };


  setInStore(token: string) {
    window.localStorage.setItem('myToken' ,token)
  }
  getInStore(){
    return window.localStorage.getItem('myToken')
  }

  getTokenAll() {
    if(!this.token){
      return this.getInStore()
    }
    return this.token
  }

  removeUser():void{
    this.token = null;
    this.user= null;
    window.localStorage.removeItem('myToken')
  }

}

