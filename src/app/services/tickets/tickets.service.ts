import {Injectable} from '@angular/core';
import {filter, map, Observable, Subject} from "rxjs";
import {ICustomTourLocation, INearestTour, ITour, ITourLocation, ITourTypeSelect} from "../../models/tours";
import {TicketsRestService} from "../rest/tickets-rest.service";

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  private ticketSubject = new Subject<ITourTypeSelect>();

  constructor(private ticketsServiceRest: TicketsRestService) {
  }


  getTickets(): Observable<ITour[]> {
    return this.ticketsServiceRest.getTickets().pipe(map(
      (value) => {
        const singleTours = value.filter((el) => el.type === 'single');
        return value.concat(singleTours);
      }
    ));
  }

// 1 вариант доступа к Observable
  readonly ticketType$ = this.ticketSubject.asObservable();

// 2 вариант доступа к Observable
//
//   getTicketTypeObservable(): Observable<ITourTypeSelect> {
//     return this.ticketSubject.asObservable();
//   }

  updateTour(type: ITourTypeSelect): void {
    this.ticketSubject.next(type);
  }

  getError() {
    return this.ticketsServiceRest.getRestError()
  }

  getNearestTours(): Observable<INearestTour[]> {
    return this.ticketsServiceRest.getNearestTours();
  }

  getLocationList(): Observable<ITourLocation[]> {
    return this.ticketsServiceRest.getLocationList();
  }

  transformData(data : INearestTour[], country: ITourLocation[]): ICustomTourLocation[] {
    const newTicketData: ICustomTourLocation[] = [];
    data.forEach((el) => {
      const newEl = <ICustomTourLocation>{...el}; // не понимаю эту строчку, что тут делается?
      newEl.country = <ICustomTourLocation>country.find((country) => el.locationId === country.id) || {};
      newTicketData.push(newEl);
    });
    return newTicketData;
  }

  getRandomNearestEvent(type: number): Observable<INearestTour> {
    return this.ticketsServiceRest.getRandomNearestEvent(type);
  }

  sendTourData(data:any): Observable<any>{
    return this.ticketsServiceRest.sendTourData(data);

}

}
