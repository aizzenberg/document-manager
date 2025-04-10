import { SortDirection } from '@angular/material/sort';
import {
  GetDocumentsParams,
  JwtPayload,
  SortableColumn,
} from '../types/api-schema';

interface WithSort {
  sort?: `${SortableColumn},${SortDirection}`;
}


/**
 * This function adapts the client-side document list parameters to the format expected by the backend API
 * for sorting. Specifically, it takes separate 'sortBy' and 'sortDirection' parameters from the client
 * and transforms them into a single 'sort' parameter in the format "sortBy,sortDirection".
 * It also omits the original 'sortBy' and 'sortDirection' properties from the output.
 *
 * @param params The client-side parameters for fetching documents, which may include 'sortBy' and 'sortDirection'.
 * @returns An object containing all the original parameters except 'sortBy' and 'sortDirection',
 * with an added 'sort' property if both 'sortBy' and 'sortDirection' were provided.
 */
export function transformSortParams(
  params: GetDocumentsParams
): Omit<GetDocumentsParams, 'sortBy' | 'sortDirection'> & WithSort {
  const { sortBy, sortDirection, ...rest } = params;
  const newConfig: Omit<GetDocumentsParams, 'sortBy' | 'sortDirection'> &
    WithSort = { ...rest };

  if (sortBy && sortDirection) {
    newConfig.sort = `${sortBy},${sortDirection}`;
  }

  return newConfig;
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const payloadJsonStr = atob(parts[1]);
    return JSON.parse(payloadJsonStr);
  } catch (error) {
    console.error('Error decoding JWT payload:', error);
    return null;
  }
}
