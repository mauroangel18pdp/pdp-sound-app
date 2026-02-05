import { supabase } from './supabase';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Dashboard from './modules/Dashboard/Dashboard';
import Agenda from './modules/Agenda/Agenda';
import Inventory from './modules/Inventory/Inventory';
import Gallery from './modules/Gallery/Gallery';
import Staff from './modules/Staff/Staff';

function App() {
  const [events, setEvents] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: agendaData } = await supabase.from('agenda').select('*');
    if (agendaData) setEvents(agendaData);

    const { data: invData } = await supabase.from('inventario').select('*');
    if (invData) setInventory(invData);
  };

  const addEvent = async (newEvent) => {
    const { data, error } = await supabase
      .from('agenda')
      .insert([{ titulo: newEvent.title, fecha: newEvent.date, descripcion: newEvent.description }])
      .select();
    if (!error && data) setEvents([...events, data[0]]);
  };

  const addItem = async (newItem) => {
    const { data, error } = await supabase
      .from('inventario')
      .insert([{ nombre: newItem.name, cantidad: newItem.quantity, estado: newItem.status }])
      .select();
    if (!error && data) setInventory([...inventory, data[0]]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard events={events} inventory={inventory} />} />
          <Route path="agenda" element={<Agenda events={events} onAddEvent={addEvent} />} />
          <Route path="inventory" element={<Inventory items={inventory} onAddItem={addItem} />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="staff" element={<Staff />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
