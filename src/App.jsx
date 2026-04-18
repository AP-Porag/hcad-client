import { useState } from 'react'
import './App.css'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import AppRoutes from "./routes";

function App() {
  return (
    <MantineProvider>
      <AppRoutes />
    </MantineProvider>
  );
}

export default App;