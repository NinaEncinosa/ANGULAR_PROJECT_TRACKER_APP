import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EpicService } from 'src/app/modules/core/services/epic/epic.service';

@Component({
  selector: 'app-epic-form',
  templateUrl: './epic-form.component.html',
  styleUrls: ['./epic-form.component.scss']
})
export class EpicFormComponent implements OnInit {
  projectId!: string;
  myForm!: FormGroup;
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private es: EpicService, 
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.projectId = router.url.split('?')[0].split('/').pop()!;
  }

  ngOnInit() {
    if (this.isEditing) {
      this.myForm = this.fb.group({
        _id: new FormControl(this.data.initialValues._id),
        name: new FormControl(this.data.initialValues.name, Validators.required),
        icon: new FormControl(this.data.initialValues.icon),
        description: new FormControl(this.data.initialValues.description),
        project: new FormControl(this.projectId),
      });
    } else {
      this.myForm = this.fb.group({
        name: new FormControl('', Validators.required),
        icon: new FormControl(''),
        description: new FormControl(''),
        project: new FormControl(this.projectId),
      });
    }
  }

  onSubmit() {
    if (this.isEditing) {    
      this.es.updateItem(this.myForm.value).subscribe();
    } else {
      this.es.createItem(this.myForm.value).subscribe();
    }

  }

  toggleIsEditing() {
    this.isEditing = !this.isEditing;
  }  

}
