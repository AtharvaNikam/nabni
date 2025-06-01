// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetDocuments() {
  const URL = endpoints.documents.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const refreshDocuments = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    documents: data?.data?.data || [],
    documentsLoading: isLoading,
    documentsError: error,
    documentsValidating: isValidating,
    documentsEmpty: !isLoading && !data?.data?.length,
    refreshDocuments, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetDocument(documentsId) {
  const URL = documentsId ? [endpoints.documents.details(documentsId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      documents: data?.data,
      documentsLoading: isLoading,
      documentsError: error,
      documentsValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetExtractedDocumentData(id) {
  const URL = endpoints.documents.extractedData(id);
  console.log(URL);

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  console.log(data);
  const refreshDocuments = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    documents: data?.data?.extracted_data_json || [],
    documentsLoading: isLoading,
    documentsError: error,
    documentsValidating: isValidating,
    documentsEmpty: !isLoading && !data?.data?.length,
    refreshDocuments, // Include the refresh function separately
  };
}
