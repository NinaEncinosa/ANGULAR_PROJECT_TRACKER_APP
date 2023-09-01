import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ProjectService } from 'src/app/modules/core/services/project/project.service';
import { UserService } from 'src/app/modules/core/services/user/user.service';
import { User } from 'src/app/modules/models/user';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
})
export class ProjectFormComponent implements OnInit{
  myForm!: FormGroup;
  members: User[] = [];
  members$: Observable<User[]>;
  isEditing: boolean = false;
  isMobile: boolean = false;
  selectedUsers: User[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder, 
    private ps: ProjectService, 
    private us: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any) 
    {

    this.members$ = us.getUsers();
    if (this.members$) {
      this.members$.subscribe((data) => {
        this.members = data;
      });
    }    
  }

  ngOnInit() {
    
    if (this.isEditing) {   
      let icon = this.data.initialValues.icon;
      if(this.data.initialValues.icon === null){
        icon = '';
      } 
      this.us.getUsersByIds(this.data.initialValues.members).subscribe(
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
        icon: new FormControl(icon),
        description: new FormControl(this.data.initialValues.description),
        members: new FormControl(this.data.initialValues.members, Validators.required),
      });
    } else { 
      this.myForm = this.fb.group({
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(5)
        ]),
        icon: new FormControl(''),
        description: new FormControl(''),
        members: new FormControl('', Validators.required),
      });
    }
  }

  onSubmit() {
    if (this.isEditing) {    
      this.ps.updateItem(this.myForm.value).subscribe({
        next: () => {
          this.ps.getAllItems();
          this.snackBar.open('Project updated successfully', 'Close', {
            duration: 5000,
          });
        }
      }
      );
    } else {
      this.ps.createItem(this.myForm.value).subscribe({
        next: () => {
         this.ps.getAllItems();
          this.snackBar.open('Project created successfully', 'Close', {
            duration: 5000,
          });
        }
      }
      );
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
      this.myForm.get('members')?.setValue(this.selectedUsers.map(user => user._id));
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedUser = event.option.value;
    if (!this.selectedUsers.includes(selectedUser)) {
      this.selectedUsers.push(selectedUser);
      this.myForm.get('members')?.setValue(this.selectedUsers.map(user => user._id));
    }
  }

}
