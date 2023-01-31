import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ICustomTourLocation, INearestTour, ITour, ITourLocation} from "../../../models/tours";
import {ActivatedRoute} from "@angular/router";
import {TicketsStorageService} from "../../../services/tiсketstorage/tiсketstorage.service";
import {IUser} from "../../../models/users";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user/user.service";
import {TicketsService} from "../../../services/tickets/tickets.service";
import {forkJoin, fromEvent, Subscription} from "rxjs";

@Component({
  selector: 'app-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss']
})
export class TicketItemComponent implements OnInit, AfterViewInit, OnDestroy {
  ticket: ITour | undefined;
  user: IUser | null;
  userForm: FormGroup;

  ticketSearchValue: string;
  nearestTours: ICustomTourLocation[];
  tourLocation: ITourLocation[];

  @ViewChild('ticketSearch') ticketSearch: ElementRef;
  searchTicketSub: Subscription;
  ticketRestSub: Subscription;
  searchTypes = [1,2,3];

  constructor(private route: ActivatedRoute,
              private ticketStorage: TicketsStorageService,
              private userService: UserService,
              private ticketService: TicketsService) {
  }

  ngOnInit(): void {

    this.user = this.userService.getUser();

    // init form group
    this.userForm = new FormGroup({
      firstName: new FormControl("", {validators: Validators.required}),
      lastName: new FormControl("", [Validators.required, Validators.minLength(2)]),
      cardNumber: new FormControl(this.user?.cardNumber),
      birthDay: new FormControl(),
      age: new FormControl(''),
      citizen: new FormControl()
    });

    // get nearest tour
    forkJoin([this.ticketService.getNearestTours(), this.ticketService.getLocationList()]).subscribe((data) => {
        // console.log('data', data);
      this.tourLocation = data[1];
        this.nearestTours = this.ticketService.transformData(data[0], data[1]);
      }
    );


    // params
    const routeIdParam = this.route.snapshot.paramMap.get('id'); //for route
    const queryIdParam = this.route.snapshot.queryParamMap.get('id');

    const paramValueId = routeIdParam || queryIdParam;
    if (paramValueId) {
      const ticketStorage = this.ticketStorage.getStorage();
      this.ticket = ticketStorage.find((el) => el.id === paramValueId);
    }

  }


  ngAfterViewInit(): void {
// this.userForm.controls["cardNumber"].setValue(this.user?.cardNumber);

    const fromEventObserver = fromEvent(this.ticketSearch.nativeElement, 'keyup');
    this.searchTicketSub = fromEventObserver.subscribe((ev: any) => {
      this.initSearchTour();
    });
  }

  onSubmit(): void {
  };

  selectDate(ev: Event): void {
  };


  ngOnDestroy(): void {
    this.searchTicketSub.unsubscribe();
  }

  initSearchTour(): void {
    const emptyInput = (<HTMLInputElement | null>document.querySelector('.searchInput'));
    //
    if (emptyInput?.value === '') {
      forkJoin([this.ticketService.getNearestTours(), this.ticketService.getLocationList()]).subscribe((data) => {
          this.tourLocation = data[1];
            this.nearestTours = this.ticketService.transformData(data[0], data[1]);
          }
        );
    } else {

    //генерируем рандомное число
    const type = Math.floor(Math.random() * this.searchTypes.length);
    // отписываемся если предыдущий сеанс не завершен
    if (this.ticketRestSub && !this.searchTicketSub.closed) {
      this.ticketRestSub.unsubscribe();
    }
    this.ticketRestSub = this.ticketService.getRandomNearestEvent(type).subscribe((data) => {
      this.nearestTours = this.ticketService.transformData([data] , this.tourLocation);
    });
  }
}
  initTour(): void{
const userData=this.userForm.getRawValue();
const postData={...this.ticket, ...userData};
    // console.log(postData, "postData");
    // console.log(this.userForm.getRawValue(), "this.userForm.getRawValue()");
    this.ticketService.sendTourData(postData).subscribe()

  }

}
