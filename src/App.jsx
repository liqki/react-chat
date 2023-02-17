import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, []);

  return loading ? (
    <div className="h-screen w-screen bg-gradient-to-tr from-cyan-400 to-pink-400" />
  ) : (
    <>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login register={false} />} />
        <Route path="/register" element={<Login register={true} />} />
      </Routes>
    </>
  );
}

export default App;
