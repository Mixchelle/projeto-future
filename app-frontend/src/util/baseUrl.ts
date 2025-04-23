export const getBaseUrl = (): string => {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  }; 