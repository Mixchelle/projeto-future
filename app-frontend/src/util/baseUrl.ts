export const getBaseUrl = (): string => {
  console.log('oi')
    return process.env.NEXT_PUBLIC_API_URL ||  "http://ip172-18-0-24-cvvud2i91nsg00dfnr2g-8000.direct.labs.play-with-docker.com/";
  };
