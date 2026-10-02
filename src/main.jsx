import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
//  import apiClient from './api/apiClient.js';
// import { getCarCases } from './api/carCasesApi.js';
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
// console.log('API base URL:', apiClient.defaults.baseURL);

// console.log(
//   'Example request URL:',
//   apiClient.getUri({ url: '/car-cases' })
// );
// apiClient
//   .get('https://localhost:44309/health')
//   .then((response) => {
//     console.log('API connection:', response.status, response.data);
//   })
//   .catch((error) => {
//     console.error('API connection failed:', error);
//   });
// getCarCases()
//   .then((carCases) => {
//     console.log('Car cases:', carCases);
//   })
//   .catch((error) => {
//     console.error('Loading car cases failed:', error);
//   });
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
