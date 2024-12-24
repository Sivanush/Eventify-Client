import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Event } from '../../../interface/events';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http:HttpClient) { }

  private apiUrl = environment.serverUrl


  createEvent(formData:Event):Observable<Event>{
    return this.http.post<Event>(`${this.apiUrl}/create`,formData)
  }

  getAllEvents():Observable<Event[]>{
    return this.http.get<Event[]>(`${this.apiUrl}/events`)
  }

  getFilteredEvents(filters: any): Observable<Event[]> {
    let params = new HttpParams();

    if (filters.date) {
      params = params.set('date', filters.date);
    }
    if (filters.location) {
      params = params.set('location', filters.location);
    }
    if (filters.audience) {
      params = params.set('audience', filters.audience);
    }

    return this.http.get<Event[]>(`${this.apiUrl}/events-filtered`, { params });
  }

  getEventDetails(eventId:string):Observable<Event>{
    return this.http.get<Event>(`${this.apiUrl}/event/${eventId}`)
  }
}
