import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterLink } from '@angular/router';
import { EventsService } from '../../service/events/events.service';
import { Event } from '../../../interface/events';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-details.component.html',
  styleUrl: './view-details.component.css'
})
export class ViewDetailsComponent {

  eventId!:string
  eventDetails!:Event

  constructor(
    private router:ActivatedRoute,
    private eventsService:EventsService
  ) {
    
  }

  ngOnInit(): void {
    this.eventId = this.router.snapshot.paramMap.get('eventId') as string

    this.eventsService.getEventDetails(this.eventId).subscribe({
      next:(res)=>{
        this.eventDetails = res
        console.log(this.eventDetails);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

}
