// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetDocuments(filter) {
  const URL = !filter ? endpoints.documents.list : endpoints.documents.list(filter);

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const refreshDocuments = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    documents: data?.data?.documents || [],
    documentsLoading: isLoading,
    documentsError: error,
    documentsValidating: isValidating,
    documentsEmpty: !isLoading && !data?.data?.documents.length,
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
    documents: data?.data || [],
    documentsLoading: isLoading,
    documentsError: error,
    documentsValidating: isValidating,
    documentsEmpty: !isLoading && !data?.data?.length,
    refreshDocuments, // Include the refresh function separately
  };
}


export function useGetProperties() {
  const URL = endpoints.documents.properties;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  console.log(data);
  const refreshProperties = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    properties: data?.data || [],
    propertiesLoading: isLoading,
    propertiesError: error,
    propertiesValidating: isValidating,
    propertiesEmpty: !isLoading && !data?.data?.length,
    refreshProperties, // Include the refresh function separately
  };
}
