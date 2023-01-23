import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PaymentsDashboard from "./components/PaymentsDashboard";
import Navbar from "./components/Navbar";
import PaymentsMonthForm from "./components/PaymentsMonthForm";

function App() {
  return (
    <>
      <Navbar brand="Pyments App" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PaymentsDashboard />} />
          <Route path="/create" element={<PaymentsMonthForm />} />
          <Route path="/editar" element={<PaymentsMonthForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
