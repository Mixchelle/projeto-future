export const getBaseUrl = (): string => {
    return process.env.NEXT_PUBLIC_API_URL || "https://projeto-future-backend.onrender.com/";
  };