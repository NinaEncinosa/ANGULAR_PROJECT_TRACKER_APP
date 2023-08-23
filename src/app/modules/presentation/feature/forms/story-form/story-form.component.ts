import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StoryService } from 'src/app/modules/core/services/story/story.service';
import { UserService } from 'src/app/modules/core/services/user/user.service';
import { User } from 'src/app/modules/models/user';

@Component({
  selector: 'app-story-form',
  templateUrl: './story-form.component.html',
  styleUrls: ['./story-form.component.scss']
})
export class StoryFormComponent {
  epicId!: string;
  myForm!: FormGroup;
  members!: User[];
  members$: Observable<User[]>;
  isEditing: boolean = false;
  selectedPoint!: number;
  
  constructor(
    private fb: FormBuilder, 
    private ss: StoryService,
    private us: UserService, 
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    this.epicId = router.url.split('?')[0].split('/').pop()!;
    this.members$ = us.getUsers();
    if (this.members$) {
      this.members$.subscribe((data) => {
        this.members = data;
      });
    }
  }

  ngOnInit() {
    if (this.isEditing) {
      this.selectedPoint = this.data.initialValues.points;
      this.myForm = this.fb.group({
        _id: new FormControl(this.data.initialValues._id),
        name: new FormControl(this.data.initialValues.name, [
          Validators.required,
          Validators.minLength(5)
        ]),
        description: new FormControl(this.data.initialValues.description),
        epic: new FormControl(this.epicId),
        owner: new FormControl(this.data.initialValues.owner),
        assignedTo: new FormControl(this.data.initialValues.assignedTo),
        points : new FormControl(this.data.initialValues.points),
        created: new FormControl(this.data.initialValues.created),
        due: new FormControl(this.data.initialValues.due),
        started: new FormControl(this.data.initialValues.started),
        finished: new FormControl(this.data.initialValues.finished),
        status: new FormControl(this.data.initialValues.status),
        icon: new FormControl(this.data.initialValues.icon),
      });
    } else {
      this.myForm = this.fb.group({
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(5)
        ]),
        description: new FormControl(''),
        epic: new FormControl(this.epicId),
        owner: new FormControl(''),
        assignedTo: new FormControl(''),
        points : new FormControl(''),
        created: new FormControl(new Date()),
        due: new FormControl(''),
        started: new FormControl(''),
        finished: new FormControl(''),
        status: new FormControl(''),
        icon: new FormControl(''),
      });
    }

    const createdControl = this.myForm.get('created');
    const dueControl = this.myForm.get('due');
    const startedControl = this.myForm.get('started');
    const finishedControl = this.myForm.get('finished');

    if (dueControl && createdControl) {
      dueControl.setValidators(dueDateValidator(createdControl));
      dueControl.updateValueAndValidity();
    }

    if (startedControl && createdControl) {
      startedControl.setValidators(startDateValidator(createdControl));
      startedControl.updateValueAndValidity();
    }

    if (finishedControl && startedControl) {
      finishedControl.setValidators(finishDateValidator(startedControl));
      finishedControl.updateValueAndValidity();
    }

  }

  onSubmit() {
    if (this.isEditing) {        
      this.ss.updateItem(this.myForm.value).subscribe();
    } else {
      this.ss.createItem(this.myForm.value).subscribe();
    }

  }

  toggleIsEditing() {
    this.isEditing = !this.isEditing;
  }  

}

export function dueDateValidator(creationDateControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const creationDate = creationDateControl.value;
    const dueDate = control.value;

    if (creationDate && dueDate && dueDate < creationDate) {
      return { dueDateInvalid: true };
    }
    
    return null;
  };
}

export function startDateValidator(creationDateControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const creationDate = creationDateControl.value;
    const startDate = control.value;

    if (creationDate && startDate && startDate < creationDate) {
      return { startDateInvalid: true };
    }
    
    return null;
  };
}

export function finishDateValidator(startDateControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const startDate = startDateControl.value;
    const finishDate = control.value;

    if (startDate && finishDate && finishDate < startDate) {
      return { finishDateInvalid: true };
    }
    
    return null;
  };
}