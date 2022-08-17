import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { StartScreen } from './components/StartScreen'
import { Question } from './components/Question';

import './App.css';
// import { useEffect, useState } from 'react';
// import CountryInterface from './interfaces/Country.interface';

function App() {
  
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={<StartScreen />}>
          </Route>
          <Route
            path='/start'
            element={<Question />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
