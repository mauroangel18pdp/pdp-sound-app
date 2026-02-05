import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Typography, Box } from '@mui/material';

import Dashboard from './modules/Dashboard/Dashboard';
import Agenda from './modules/Agenda/Agenda';
import Inventory from './modules/Inventory/Inventory';
import Gallery from './modules/Gallery/Gallery';
import Staff from './modules/Staff/Staff';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="staff" element={<Staff />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
