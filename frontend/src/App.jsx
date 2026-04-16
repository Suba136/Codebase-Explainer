import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Layout from '../src/components/Layout.jsx';
import Landing from '../src/pages/Landing.jsx';
import NotFound from '../src/pages/NotFound.jsx';
import Ingest from '../src/components/Ingest.jsx';
import GetRepo from '../src/components/GetRepo.jsx';
import Orient from '../src/components/Orient.jsx';
import Complexity from '../src/components/Complexity.jsx';
import DataModel from '../src/components/DataModel.jsx';
import Report from '../src/components/Report.jsx';
import Chat from '../src/components/Chat.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/ingest" element={<Ingest />} />
          <Route path="/get-repo" element={<GetRepo />} />
          <Route path="/orient" element={<Orient />} />
          <Route path="/complexity" element={<Complexity />} />
          <Route path="/data-model" element={<DataModel />} />
          <Route path="/report" element={<Report />} />
          <Route path="/chat" element={<Chat />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App