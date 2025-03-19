import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import Store from './components/Redux/Store';
import { Router } from './Router';

function App() {
    return (
        <Provider store={Store}>
            <RouterProvider router={Router} />
        </Provider>
    );
}

export default App;




// // import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'
// import { RouterProvider } from 'react-router-dom'
// import './App.css'
// import { Provider } from 'react-redux'
// import Store from './components/Redux/Store'
// import { Router } from './Router'

// function App() {

//   return (
//     <>
//       <Provider store={Store}>
//         <RouterProvider router={Router} />
//       </Provider>
//     </>
//   )
// }

// export default App
