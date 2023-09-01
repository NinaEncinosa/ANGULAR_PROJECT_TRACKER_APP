import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/modules/core/services/task/task.service';
import { dateLessThan } from '../validation/date.validation';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit{
  myForm!: FormGroup;
  storyId!: string;
  isEditing: boolean = false;

  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder, 
    private router: Router, 
    private ts: TaskService, 
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.storyId = router.url.split('?')[0].split('/').pop()!;
   
  }

  ngOnInit() {
    if(this.isEditing){
      this.myForm = this.fb.group({
        _id: new FormControl(this.data.initialValues._id),
        name: new FormControl(this.data.initialValues.name, [
          Validators.required,
          Validators.minLength(5)
        ]),
        description: new FormControl(this.data.initialValues.description, Validators.minLength(10)),
        story: new FormControl(this.storyId),
        created: new FormControl(new Date(this.data.initialValues.created).setHours(0,0,0,0)),
        due: new FormControl(this.data.initialValues.due),
        done: new FormControl(this.data.initialValues.done),
      }, { validators: dateLessThan('created', 'due') });
    }else{
      this.myForm = this.fb.group({
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(5)
        ]),
        description: new FormControl('', Validators.minLength(10)),
        story: new FormControl(this.storyId),
        created: new FormControl(new Date().setHours(0,0,0,0)),
        due: new FormControl(''),
        done: new FormControl(false),
      }, { validators: dateLessThan('created', 'due') });
    }
  }

  onSubmit() {
    if (this.isEditing) {  
      this.ts.updateItem(this.myForm.value).subscribe({
        next: () => {
          this.ts.getItems(this.storyId).subscribe();
          this.snackBar.open('Task updated successfully', 'Close', {
            duration: 5000,
          });
        }
      });
    } else {
      this.ts.createItem(this.myForm.value).subscribe({
        next: () => {
          this.ts.getItems(this.storyId).subscribe();
          this.snackBar.open('Task created successfully', 'Close', {
            duration: 5000,
          });
        }
      });
    }
  }

  toggleIsEditing() {
    this.isEditing = !this.isEditing;
  }  
}