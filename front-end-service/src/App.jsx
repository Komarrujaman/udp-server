import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  console.log("token : ", token) // or sessionStorage, depending on where you store it
  return token !== null; // or check if the token is valid
};

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={isAuthenticated() ? <Navigate to="/dashboard/home" replace /> : <Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

export default App;
