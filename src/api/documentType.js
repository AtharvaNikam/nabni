// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetDocumentTypes() {
  const URL = endpoints.documentType.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  console.log('data', data);
  const refreshDocumentTypes = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    documentTypes: data?.data || [],
    documentTypesLoading: isLoading,
    documentTypesError: error,
    documentTypesValidating: isValidating,
    documentTypesEmpty: !isLoading && !data?.data?.length,
    refreshDocumentTypes, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetDocumentType(documentTypeId) {
  const URL = documentTypeId ? [endpoints.documentType.details(documentTypeId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      documentType: data?.data,
      documentTypeLoading: isLoading,
      documentTypeError: error,
      documentTypeValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
