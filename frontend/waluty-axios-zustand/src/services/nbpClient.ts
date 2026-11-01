import axios from 'axios';

export const nbpApi = axios.create({
  baseURL: 'https://api.nbp.pl/api',
  // Czekaj maksymalnie 10 s. 
  // Po tym czasie Axios ją przerwie i żądanie zakończy się błędem
  timeout: 10000,
  headers: {
    // Przez nagłówek wskazujemy format odpowiedzi
    // W tym przypadku json
    Accept: 'application/json',
  },
});

nbpApi.interceptors.request.use((config) => {
  console.log('NBP request:', config.url);
  return config;
});