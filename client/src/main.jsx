// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import App from './App';
// import './design/animations.css';
// import './design/globals.css';
// import './index.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//       <Toaster
//         position="bottom-right"
//         toastOptions={{
//           duration: 4000,
//           style: {
//             background: '#0C1428',
//             color: '#E8EDF8',
//             border: '1px solid rgba(126,255,245,0.12)',
//             fontFamily: "'Satoshi', sans-serif",
//             fontSize: '14px',
//             borderRadius: '10px',
//           },
//           success: { iconTheme: { primary: '#C8FF57', secondary: '#0C1428' } },
//           error:   { iconTheme: { primary: '#FF3CAC', secondary: '#0C1428' } },
//         }}
//       />
//     </BrowserRouter>
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';   // keep this — Tailwind base styles are here

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0C1428',
            color: '#E8EDF8',
            border: '1px solid rgba(126,255,245,0.12)',
            fontFamily: "'Satoshi', sans-serif",
            fontSize: '14px',
            borderRadius: '10px',
          },
          success: {
            iconTheme: { primary: '#C8FF57', secondary: '#0C1428' },
          },
          error: {
            iconTheme: { primary: '#FF3CAC', secondary: '#0C1428' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);