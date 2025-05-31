// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetPropertyTypes() {
  const URL = endpoints.propertyType.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  console.log('data', data);
  const refreshPropertyTypes = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    propertyTypes: data?.data || [],
    propertyTypesLoading: isLoading,
    propertyTypesError: error,
    propertyTypesValidating: isValidating,
    propertyTypesEmpty: !isLoading && !data?.data?.length,
    refreshPropertyTypes, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetPropertyType(propertyTypeId) {
  const URL = propertyTypeId ? [endpoints.propertyType.details(propertyTypeId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      propertyType: data?.data,
      propertyTypeLoading: isLoading,
      propertyTypeError: error,
      propertyTypeValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
