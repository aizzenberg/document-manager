import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BaseDialogComponent, DialogData } from '../base-dialog.component';

interface ConfirmationDialogData extends DialogData {
  message: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressBarModule,
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent extends BaseDialogComponent<
  ConfirmationDialogData,
  boolean
> {}
