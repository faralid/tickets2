import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription, take, takeUntil} from "rxjs";
import {ObservableExampleService} from "../../../services/testing/observable-example.service";
import {SettingsService} from "../../../services/settings/settings.service";
import {AuthService} from "../../../services/auth/auth.service";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user/user.service";
import {IUser} from "../../../models/users";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  //test!!!!!!!!!-----------------------------------------------------
  // private subjectScope: Subject<string>;
  // private subjectUnsubscribe: Subscription;

  //2---примеры с observable и Subject + pipe.take !!!!!!!!!-----------------------------------------------------
  // private settingsData: Subscription;
  //private settingsDataSubject: Subscription;

  private subjectForUnsubscribe = new Subject();
  user: IUser | null;
  newPsw: string;
  rptNewPsw: string;
  pswUser: string;

  constructor(private testing: ObservableExampleService,
              private settingsService: SettingsService,
              private authService: AuthService,
              private messageService: MessageService,
              private userService: UserService) {
  }


  ngOnInit(): void {

    //test!!!!!!!!!-----------------------------------------------------
    // const myObservable= this.testing.getObservable();
    // const unsubscribe=myObservable.subscribe((data)=>{
    //   console.log('observer data',data)
    // })
    // unsubscribe.unsubscribe();
    //
    // // присвоить в него результат вызова метода  ObservableExampleService getSubject
    // this.subjectScope=this.testing.getSubject() ;
    //
    //
    //
    // //подписаться на данные от subjectScope и вывести в консоли полученные данные
    // this.subjectUnsubscribe = this.subjectScope.subscribe((data)=>{
    //   console.log('data',data)
    // });
    //
    // // отправить данные с помощью subjectScope.next
    // this.subjectScope.next('данные')

    //2---примеры с observable и Subject + pipe.take !!!!!!!!!-----------------------------------------------------
    //setting data observable
// this.settingsData=this.settingsService.loadUserSettings().subscribe((data)=>{
// console.log('settingsData',data)
// })
// //setting data Subject
//     this.settingsDataSubject=this.settingsService.getSettingsSubjectObservable().pipe(take(1)).subscribe((data)=>{
//       console.log('settingsDataSubject',data)
//     })
    this.settingsService.loadUserSettings().pipe(takeUntil(this.subjectForUnsubscribe)).subscribe((data) => {
      console.log('settingsData', data)
    })
    this.settingsService.getSettingsSubjectObservable().pipe(takeUntil(this.subjectForUnsubscribe)).subscribe((data) => {
      console.log('settingsDataSubject', data)
    })

  }

  ngOnDestroy(): void {
    // this.subjectUnsubscribe .unsubscribe();
    // this.settingsData .unsubscribe()
    this.subjectForUnsubscribe.next(true);
    this.subjectForUnsubscribe.complete();
  }

  onPswChange(Ev: Event): void | boolean {
    const  user = <IUser>this.userService.getUser();
    if ( user.psw !== this.pswUser) {
      this.messageService.add({severity: 'error', summary: 'Неверно введен текущий пароль'});
    } else {
        if (this.newPsw !== this.rptNewPsw) {
        this.messageService.add({severity: 'error', summary: 'Новые пароли не совпадают'});
        console.log("this.newPsw", this.newPsw);
        console.log("this.rptNewPsw", this.rptNewPsw);
      } else {
        this.messageService.add({severity: 'success', summary: 'Новый пароль установлен'});
        user.psw = this.newPsw;
        this.userService.setUser(user);

        const userString = JSON.stringify(user);
        window.localStorage.setItem(user.login, userString);

        console.log("теперь пароль", user.psw);
        // в local storage заменить текущий пароль на новый?
        // ошибка - поля ввода всех паролей пустые ,а сервис говорит, что все ок, новые данные сохранены

      }
    }
  }

}
