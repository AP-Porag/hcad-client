import './App.css'
import AppRoutes from './routes';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
function App() {
  return (
    <TooltipProvider>
        <Toaster richColors position="top-right" />
        <AppRoutes/>
    </TooltipProvider>
  );
}

export default App;
