import { useEffect, useState } from "react";
import { CreateInquiryPayload, createInquiry, getInquiries } from "@/api/crm";
import { Inquiry } from "@/types/erp";

export function useInquiries() {
  const [data, setData] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadInquiries() {
      try {
        setIsLoading(true);
        setError(null);

        const inquiries = await getInquiries();

        if (isMounted) {
          setData(inquiries);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to load inquiries"),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInquiries();

    return () => {
      isMounted = false;
    };
  }, []);

  async function addInquiry(payload: CreateInquiryPayload) {
    try {
      setIsCreating(true);
      setError(null);

      const newInquiry = await createInquiry(payload, data.length);

      setData((currentData) => [newInquiry, ...currentData]);

      return newInquiry;
    } catch (err) {
      const normalizedError =
        err instanceof Error ? err : new Error("Failed to create inquiry");

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
    addInquiry,
  };
}
