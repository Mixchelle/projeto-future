export const getBaseUrl = (): string => {
  console.log('oi')
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/";
  };
