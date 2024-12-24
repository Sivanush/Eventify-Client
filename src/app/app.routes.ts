import { Routes } from '@angular/router';
import { CreateComponent } from './components/create/create.component';
import { ListingComponent } from './components/listing/listing.component';
import { ViewDetailsComponent } from './components/view-details/view-details.component';

export const routes: Routes = [
    {
        path:'create',
        component:CreateComponent
    },
    {
        path:'listing',
        component:ListingComponent
    },
    {
        path:'event/:eventId',
        component:ViewDetailsComponent
    },
    {
        path:'',
        pathMatch:'full',
        redirectTo:'listing'
    }
];
