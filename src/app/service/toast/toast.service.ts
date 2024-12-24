import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }


  showSuccess(message:string){
    toast.success(message,{
      duration:3000
    })
  }

  showError(message:string){
    toast.error(message,{
      duration:3000
    })
  }

  showWarning(message:string){
    toast.warning(message,{
      duration:3000
    })
  }
}
