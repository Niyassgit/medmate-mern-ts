import { useState, useEffect } from "react";

const useFetchItem = <T,>(fetchFn: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchFn();
        setData(result);
      } catch (error: unknown) {
        setError((error as {message:string})?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchFn]);

  return { data, setData, loading, error };
};

export default useFetchItem;
