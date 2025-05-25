import { Routes } from '@angular/router';

import { DocumentViewerPageComponent } from './document-viewer-page.component';

/** Page id param. */
export const PAGE_ID_PARAM = 'id';

/** Document routes. */
export const documentRoutes: Routes = [{ path: `:${PAGE_ID_PARAM}`, component: DocumentViewerPageComponent }];
