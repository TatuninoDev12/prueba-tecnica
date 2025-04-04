import { Navigate, Route, Routes } from "react-router";
import Home from "../pages/Home";
export const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      {/* al momento de navegar a una ruta no definida, redirige a la pagina principal */}
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};
