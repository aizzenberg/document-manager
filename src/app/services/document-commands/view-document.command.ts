import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Document } from 'types/api-schema';
import { DocumentAction, DocumentCommand } from './base';

@Injectable({
  providedIn: 'root',
})
export class ViewDocumentCommand implements DocumentCommand {
  relatedAction: DocumentAction = {
    type: 'VIEW',
    label: 'View Document',
    icon: 'visibility',
  };

  private router = inject(Router);

  isAvailable(): boolean {
    return true; // True, because it's a default action which is available for each document
  }

  execute(document: Document): Observable<boolean> {
    this.router.navigate(['/document', document.id]);
    return of(false);
  }
}
