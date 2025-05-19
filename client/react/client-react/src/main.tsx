import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

if (CLIENT_ID) {
  createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  );
}


// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'
// import { GoogleOAuthProvider } from '@react-oauth/google'

// const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
// if (CLIENT_ID) {
//   createRoot(document.getElementById('root')!).render(
//     <GoogleOAuthProvider clientId={CLIENT_ID}>
//       <App />
//     </GoogleOAuthProvider>
//     // <StrictMode>
//     //   <App />
//     // </StrictMode>,
//   )
// }
