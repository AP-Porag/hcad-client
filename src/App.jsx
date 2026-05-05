import { useState } from 'react'
import './App.css'
import AppRoutes from './routes';
import { TooltipProvider } from "@/components/ui/tooltip";
function App() {
  return (
    <TooltipProvider>
      <AppRoutes/>
    </TooltipProvider>
  );
}

export default App;