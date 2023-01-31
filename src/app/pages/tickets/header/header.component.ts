import {Component, Input, OnDestroy, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {MenuItem} from "primeng/api";
import {UserService} from "../../../services/user/user.service";
import {IUser} from "../../../models/users";
import {IMenuType} from "../../../models/menuType";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  items: MenuItem[];
  time: Date;
  user: IUser | null;
  private timeInterval: number;
  private settingsActive = false;

  @Input() menuType: IMenuType;

  constructor(private userService: UserService) {
  }


  ngOnInit(): void {

    this.items = [
      {
        label: 'Билеты',
        routerLink: ['tickets-list']
      },
      {
        label: 'Выйти',
        routerLink: ['/auth'],
        command: (click) => {
        this.userService.removeUser()
        }
      },
    ];
    this.timeInterval = window.setInterval(() => {
      this.time = new Date();
    }, 1000)
    this.user = this.userService.getUser();

  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      window.clearInterval(this.timeInterval);
    }
  }
  ngOnChanges(ev: SimpleChanges): void {
    this.settingsActive = this.menuType?.type === "extended";
    this.items = this.initMenuItems();
  }

  initMenuItems(): MenuItem[] {
    return [
      {
        label: 'Билеты',
        routerLink: ['tickets-list']
      },
      {
        label: 'Настройки',
        routerLink: ['settings'],
        visible: this.settingsActive
      },
      {
        label: 'Выйти',
        routerLink: ['/auth']
      },

    ];
  }

}

