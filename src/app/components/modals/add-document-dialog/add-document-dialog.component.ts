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
import { MatSelectModule } from '@angular/material/select';
import { DocumentStatus } from 'app/constants';
import { BaseDialogComponent } from '../base-dialog.component';

export interface AddDocumentOutput {
  name: string;
  status: DocumentStatus;
  file: File;
}

@Component({
  selector: 'app-add-document-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatProgressBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-document-dialog.component.html',
  styleUrl: './add-document-dialog.component.scss',
})
export class AddDocumentDialogComponent extends BaseDialogComponent<
  {},
  AddDocumentOutput
> {
  public form!: FormGroup<{
    name: FormControl<string>;
    status: FormControl<DocumentStatus>;
    file: FormControl<string>;
  }>;
  public selectedFile: File | null = null;
  private fb = inject(FormBuilder);

  constructor() {
    super();

    this.form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      status: ['' as DocumentStatus],
      file: ['', Validators.required],
    });

    effect(() => {
      if (this.isLoading()) {
        this.form.disable();
      }
    });
  }

  saveAsDraft(): void {
    this.form.patchValue({ status: 'DRAFT' });
    this.attatchFileAndEmitData();
  }

  sendToReview(): void {
    this.form.patchValue({ status: 'READY_FOR_REVIEW' });
    this.attatchFileAndEmitData();
  }

  /**
   * Replace file's path string with File object when closing the dialog
   */
  attatchFileAndEmitData() {
    const updatedFormValue = {
      ...this.form.value,
      file: this.selectedFile,
    } as AddDocumentOutput;

    this.emitData(updatedFormValue);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0] as File;
    if (!file) {
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
    if (!this.form.value.name) {
      this.form.patchValue({ name: file.name.split('.')[0] });
    }
    return;
  }
}
