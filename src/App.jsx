import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Layout from '../src/components/Layout.jsx';
import Landing from '../src/pages/Landing.jsx';
import Landing from '../src/pages/NotFound.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App