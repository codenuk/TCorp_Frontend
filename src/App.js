import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import FrontEnd from './js/route';

function App() {
  return (

    <div>
      <BrowserRouter>
        <FrontEnd />
      </BrowserRouter>
    </div>

  );
}

export default App;
