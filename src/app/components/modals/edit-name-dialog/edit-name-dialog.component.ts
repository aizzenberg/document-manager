import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Document } from 'types/api-schema';
import { BaseDialogComponent, DialogData } from '../base-dialog.component';

interface EditNameDialogData extends DialogData {
  document: Document;
}

@Component({
  selector: 'app-edit-name',
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatProgressBarModule,
  ],
  templateUrl: './edit-name-dialog.component.html',
  styleUrl: './edit-name-dialog.component.scss',
})
export class EditNameDialogComponent extends BaseDialogComponent<
  EditNameDialogData,
  string
> {
  form!: FormGroup<{ name: FormControl<string> }>;
  private readonly fb = inject(FormBuilder);

  constructor() {
    super();

    this.form = this.fb.nonNullable.group({
      name: [this.data.document.name, Validators.required],
    });

    effect(() => {
      if (this.isLoading()) {
        this.form.disable();
      }
    });
  }

  onSaveClick(): void {
    if (this.form.valid) {
      this.emitData(this.form.value.name);
    }
  }
}
