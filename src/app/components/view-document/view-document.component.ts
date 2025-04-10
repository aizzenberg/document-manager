import { Component, computed, effect, inject, NgZone } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import NutrientViewer from '@nutrient-sdk/viewer';
import { DocumentService, ErrorHandlerService } from '@services';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-view-document',
  imports: [MatIconModule],
  templateUrl: './view-document.component.html',
  styleUrl: './view-document.component.scss',
})
export class ViewDocumentComponent {
  private ngZone = inject(NgZone);
  private route = inject(ActivatedRoute);
  private documentService = inject(DocumentService);
  private errService = inject(ErrorHandlerService);

  routeParamMap = toSignal(this.route.paramMap);
  nutrientError = false;

  public documentRes = rxResource({
    request: () => ({ params: this.routeParamMap() }),
    loader: ({ request }) => {
      const documentId = request.params?.get('id');
      if (!documentId) {
        this.errService.handleError('Document id was not provided!');
        return throwError(() => new Error());
      }

      return this.documentService.getDocumentById(documentId);
    },
  });

  public documentUrl = computed(() => this.documentRes.value()?.fileUrl);

  constructor() {
    effect(() => {
      const url = this.documentUrl();

      if (!url) {
        return;
      }
      this.loadDocument(url);
    });
  }

  loadDocument(documentUrl: string) {
    this.ngZone.runOutsideAngular(() => {
      NutrientViewer.load({
        baseUrl: `${window.location.protocol}//${window.location.host}/assets/`,
        document: documentUrl,
        container: '#pdf-container',
        theme: 'DARK',
      }).catch((reason) => {
        this.nutrientError = true;
        this.errService.handleError(reason, 'NutrientViewer');
      });
    });
  }
}
