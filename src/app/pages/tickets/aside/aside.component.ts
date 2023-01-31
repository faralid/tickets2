import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IMenuType} from "../../../models/menuType";
import {ITourTypeSelect} from "../../../models/tours";
import {TicketsService} from "../../../services/tickets/tickets.service";
import {MessageService} from "primeng/api";
import {SettingsService} from "../../../services/settings/settings.service";


@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent implements OnInit {
  menuTypes: IMenuType[];
  selectedMenuType: IMenuType;
  @Output() updateMenuType: EventEmitter<IMenuType> = new EventEmitter() ;

  tourTypes: ITourTypeSelect[] = [
    {label: 'Все', value: 'all'},
    {label: 'Одиночный', value: 'single'},
    {label: 'Групповой', value: 'multi'}
  ]
  constructor( private ticketService: TicketsService,
               private messageService: MessageService,
               private settingsService: SettingsService) { }

  ngOnInit(): void {

    this.menuTypes = [
      {type: 'custom', label : 'Обычное'},
      {type: 'extended', label : 'Расширенное'}
    ]

  }
  changeType(ev: {ev: Event, value: IMenuType}): void {
    console.log('ev', ev)
    this.updateMenuType.emit(ev.value);
  }
  changeTourType(ev:  {ev: Event, value: ITourTypeSelect}): void {
    this.ticketService.updateTour(ev.value)
  }
  selectDate(ev: string) {
    console.log('ev', ev)
    this.ticketService.updateTour({date:ev})
  }

  initRestError(): void {
    this.ticketService.getError().subscribe({
        next:(data)=> {
        },
        error: (err) => {
          this.messageService.add({severity:'error', summary:'Не удается получить данные от сервера', key:"server"});
          // console.log('err', err) ;
        }
      }
    )

  }

  initSettingsData(): void {
this.settingsService.loadUserSettingsSubject(
  {saveToken:false}
)
  }

}
