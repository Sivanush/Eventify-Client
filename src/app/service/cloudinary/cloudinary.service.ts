import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';


interface cloudinaryResponse{
  url:string
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  constructor(private http: HttpClient) { }

  private cloudName = environment.CLOUDINARY_CLOUD_NAME 
  private uploadPreset = environment.CLOUDINARY_UPLOAD_PRESET 


  uploadImages(files:File[]){
    return forkJoin(files.map((file)=> this.uploadImage(file)))
  }

  private uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset); 
    
    return this.http.post<cloudinaryResponse>(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, formData).pipe(
      map(res=>res.url)
    )
  }
}
