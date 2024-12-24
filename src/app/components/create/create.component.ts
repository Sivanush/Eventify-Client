import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CloudinaryService } from '../../service/cloudinary/cloudinary.service';
import { EventsService } from '../../service/events/events.service';
import { ToastService } from '../../service/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {


  eventForm!: FormGroup
  imageFiles: File[] = [];
  imagePreviews: string[] = [];
  isUploading: boolean = false;
  audiences: string[] = [];
  tomorrowDate!: string

  constructor(
    private fb: FormBuilder,
    private cloudinaryService: CloudinaryService,
    private eventService: EventsService,
    private toastService: ToastService,
    private router:Router
  ) {

  }

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      date: [new Date().toISOString().split('T')[0], [Validators.required, this.dateValidator()]],
      time: ['12:30', [Validators.required]],
      location: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      audiences: [[], Validators.required],
      details: ['', [Validators.required, Validators.minLength(10),Validators.maxLength(1000)]],
    });

  }

  dateValidator() {
    return (control: AbstractControl) => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
  
      if (selectedDate < today) {
        return { dateInvalid: true }; 
      }
      return null; 
    };
  }
  

  addAudience(event: any) {
    let value = event.target.value.trim();
  
    value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  
    if (this.audiences.includes(value)) {
      this.toastService.showWarning(value + ' Already Exists');
      event.target.value = ''; 
      return;
    }
  
    if (value) {
      this.audiences.push(value);
      event.target.value = ''; 
    }
  
    event.preventDefault(); 
  }
  

  removeAudience(index: number) {
    this.audiences.splice(index, 1);
  }

  async onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;

    this.imageFiles = Array.from(files)
    this.imagePreviews = []

    for (const file of this.imageFiles) {
      let reader = new FileReader()
      let preview = await new Promise<string>((res) => {
        reader.onload = () => res(reader.result as string)
        reader.readAsDataURL(file)
      })

      this.imagePreviews.push(preview)
    }
  }


  removeImage(index: number) {
    this.imageFiles.splice(index, 1)
    this.imagePreviews.splice(index, 1)
  }

  onSubmit() {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched()
    } else {
      this.isUploading = true

      const time24 = this.eventForm.get('time')?.value;
      const timeWithPeriod = this.convertTo12HourFormat(time24);

      const formData = {
        ...this.eventForm.value,
        time: timeWithPeriod,
      };
      
      if (this.imageFiles.length > 0) {


        this.cloudinaryService.uploadImages(this.imageFiles).subscribe({
          next: (res) => {
            formData.images = res

            this.eventService.createEvent(formData).subscribe({
              next: (res) => {
                console.log(res);
                this.toastService.showSuccess('Event created Successfully')
                this.router.navigate(['/event',res.eventId])
              }
            })
          },
          error: (err) => {
            console.error(err);
            this.toastService.showError('Something went wrong')
          },
          complete: () => {
            this.isUploading = false
          }
        })
      } else {

        this.eventService.createEvent(formData).subscribe({
          next: (res) => {
            console.log(res);
            this.toastService.showSuccess('Event created Successfully')
            this.router.navigate(['/event',res.eventId])
          },
          error: (err) => {
            console.error(err);
            this.toastService.showError('Something went wrong')
          },
          complete: () => {
            this.isUploading = false
          }
        })
      }


    }
  }

  convertTo12HourFormat(time: string) {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute < 10 ? '0' + minute : minute} ${period}`;
  }

}
