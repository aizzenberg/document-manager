import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DocumentStatus } from 'app/constants';
import { DocumentViewModel } from 'types/api-schema';
import { BaseDialogComponent, DialogData } from '../base-dialog.component';

interface ChangeStatusDialogData extends DialogData {
  document: DocumentViewModel;
}

@Component({
  selector: 'app-change-status-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './change-status-dialog.component.html',
  styleUrl: './change-status-dialog.component.scss',
})
export class ChangeStatusDialogComponent extends BaseDialogComponent<
  ChangeStatusDialogData,
  DocumentStatus
> {
  selectedStatus: DocumentStatus | null = null;

  onStatusSelected(status: DocumentStatus): void {
    this.emitData(status);
    this.selectedStatus = status;
  }
}
