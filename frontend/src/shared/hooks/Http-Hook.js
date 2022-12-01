import { useState, useCallback, useEffect, useRef } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      try {
        setIsLoading(true);
        const httpAbortController = new AbortController();
        activeHttpRequests.current.push(httpAbortController);
        const response = await fetch(url, {
          method: method,
          body,
          headers,
          signal: httpAbortController.signal,
        });
        const data = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (abrtCtrl) => abrtCtrl !== httpAbortController
        );

        if (!response.ok) {
          throw new Error(data.message);
        }
        setIsLoading(false);
        return data;
      } catch (error) {
        setIsLoading(false);
        setError(error.message);
        throw error;
      }
    },
    []
  );
  const clearErrorHandler = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((httpAbortController) =>
        httpAbortController.abort()
      );
    };
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
    clearErrorHandler,
  };
};
