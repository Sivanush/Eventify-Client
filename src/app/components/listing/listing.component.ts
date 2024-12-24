import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Event } from '../../../interface/events';
import { EventsService } from '../../service/events/events.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterLink],
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.css'
})
export class ListingComponent {


  events:Event[] = []
  filteredEvents: Event[] = []; 
  filters = {
    date: '',
    location: '',
    audience: ''
  };

  uniqueLocations: string[] = [];
  uniqueAudiences: string[] = [];

  constructor(private eventService:EventsService) {
    
  }

  ngOnInit(): void {
    this.eventService.getAllEvents().subscribe({
     next:(res)=>{
      this.events = res
      this.filteredEvents = res
      this.uniqueLocations = [...new Set(res.map(event => event.location))];
      this.uniqueAudiences = [...new Set(res.flatMap(event => event.audiences))];
     }
    })
  }

  applyFilters(): void {
    const filters = {
      date: this.filters.date,
      location: this.filters.location,
      audience: this.filters.audience,
    };

    this.eventService.getFilteredEvents(filters).subscribe({
      next:(res)=>{
        this.events = res;
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }
}
