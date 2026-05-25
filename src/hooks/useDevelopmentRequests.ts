import { useCallback, useEffect, useState } from "react";
import {
  CreateDevelopmentRequestPayload,
  createDevelopmentRequest,
  getDevelopmentRequests,
} from "@/api/productDevelopment";
import { DevelopmentRequest } from "@/types/productDevelopment";

export function useDevelopmentRequests() {
  const [data, setData] = useState<DevelopmentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadDevelopmentRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const requests = await getDevelopmentRequests();

      setData(requests);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to load development requests"),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        setIsLoading(true);
        setError(null);

        const requests = await getDevelopmentRequests();

        if (isMounted) {
          setData(requests);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to load development requests"),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  async function addDevelopmentRequest(
    payload: CreateDevelopmentRequestPayload,
  ) {
    try {
      setIsCreating(true);
      setError(null);

      const newRequest = await createDevelopmentRequest(payload, data.length);

      setData((currentData) => [newRequest, ...currentData]);

      return newRequest;
    } catch (err) {
      const normalizedError =
        err instanceof Error
          ? err
          : new Error("Failed to create development request");

      setError(normalizedError);
      throw normalizedError;
    } finally {
      setIsCreating(false);
    }
  }

  return {
    data,
    isLoading,
    isCreating,
    error,
    addDevelopmentRequest,
    refreshDevelopmentRequests: loadDevelopmentRequests,
  };
}
