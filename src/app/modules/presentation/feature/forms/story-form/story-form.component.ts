import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/api-rest/services/auth.service';
import { StoryService } from 'src/app/modules/core/services/story/story.service';
import { UserService } from 'src/app/modules/core/services/user/user.service';
import { User } from 'src/app/modules/models/user';
import { dateLessThan } from '../validation/date.validation';

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
  selectedUsers: User[] = [];


  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder, 
    private ss: StoryService,
    private us: UserService, 
    private as: AuthService, 
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
    const ownerId = this.as.getUserId();
    if (this.isEditing) {
      let icon = this.data.initialValues.icon;
      if(this.data.initialValues.icon === null){
        icon = '';
      }
      
      this.us.getUsersByIds(this.data.initialValues.assignedTo).subscribe(
        users  => {
          this.selectedUsers = users
        }
      ) 
      this.myForm = this.fb.group({
        _id: new FormControl(this.data.initialValues._id),
        name: new FormControl(this.data.initialValues.name, [
          Validators.required,
          Validators.minLength(5)
        ]),
        description: new FormControl(this.data.initialValues.description),
        epic: new FormControl(this.data.initialValues.epic),
        owner: new FormControl(this.data.initialValues.owner),
        assignedTo: new FormControl(this.data.initialValues.assignedTo),
        points : new FormControl(this.data.initialValues.points),
        created: new FormControl(this.data.initialValues.created),
        due: new FormControl(this.data.initialValues.due),
        started: new FormControl(this.data.initialValues.started),
        finished: new FormControl(this.data.initialValues.finished),
        status: new FormControl(this.data.initialValues.status),
        icon: new FormControl(icon),
      },{ validators: 
        [dateLessThan('created', 'due'),
        dateLessThan('created', 'started'),
        dateLessThan('created', 'finished'),
        dateLessThan('started', 'finished')]});
    } else {
      this.myForm = this.fb.group({
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(5)
        ]),
        description: new FormControl(''),
        epic: new FormControl(this.epicId),
        owner: new FormControl(ownerId),
        assignedTo: new FormControl(''),
        points : new FormControl(1),
        created: new FormControl(new Date().setHours(0,0,0,0)),
        due: new FormControl(''),
        started: new FormControl(''),
        finished: new FormControl(''),
        status: new FormControl(''),
        icon: new FormControl(''),
      },{ validators: 
        [dateLessThan('created', 'due'),
        dateLessThan('created', 'started'),
        dateLessThan('created', 'finished'),
        dateLessThan('started', 'finished')]});
    }
    this.myForm.get('status')?.valueChanges.subscribe((value) => {
      this.setDates(value);
    }
    );
  }

  onSubmit() {

    if (this.isEditing) {      
      this.ss.updateItem(this.myForm.value).subscribe({
        next: () => {
          //este get es para que my-stories refresque
          if (this.epicId == 'my-stories') {
            this.ss.getAllItems().subscribe();
          }
          //este get es para cuando vengo desde my-projects >... a la lista de stories
          else{
            this.ss.getItems(this.epicId).subscribe();
          }         
          this.snackBar.open('Story updated successfully', 'Close', {
            duration: 5000,
          });
        }
      });      
    } else {
      this.ss.createItem(this.myForm.value).subscribe({
        next: () => {
          this.ss.getItems(this.epicId).subscribe();
          this.snackBar.open('Story created successfully', 'Close', {
            duration: 5000,
          });
        }
      });
    }
  }

  //los valores de started y finished se cargan segun cuando clickea el usuario en el status
  setDates(status: string) {
    if (status == 'todo') {
      this.myForm.get('started')?.reset();
      this.myForm.get('finished')?.reset();
    }
    if (status == 'running') {
      this.myForm.get('started')?.setValue(new Date().setHours(0,0,0,0));
      this.myForm.get('finished')?.reset();
    }
    if (status == 'done') {
      this.myForm.get('finished')?.setValue(new Date().setHours(0,0,0,0));
    }
  }

  toggleIsEditing() {
    this.isEditing = !this.isEditing;
  }  

  onIconSelected(icon: string): void {
    this.myForm.get('icon')?.setValue(icon);
  }

  remove(user: any): void {
    const index = this.selectedUsers.indexOf(user);
    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
      this.myForm.get('assignedTo')?.setValue(this.selectedUsers.map(user => user._id));
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedUser = event.option.value;
    if (!this.selectedUsers.includes(selectedUser)) {
      this.selectedUsers.push(selectedUser);
      this.myForm.get('assignedTo')?.setValue(this.selectedUsers.map(user => user._id));
    }
  }

}