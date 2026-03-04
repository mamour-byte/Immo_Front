import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./Layouts/layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Property from "./pages/property";
import Contact from "./pages/Contact";
import Build from "./pages/Build";
import Admin from "./pages/Admin/AdminPropertiesDashboard";
import Login from "./pages/login";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
        {/* Layout global */}
        <Route path="/" element={<Layout />}>
          {/* Pages enfants */}
          <Route index element={<Home />} />          {/* page / */}
          <Route path="search" element={<Search />} /> {/* page /search */}
          <Route path="property/:id" element={<Property />} />       {/* page 404 */}
          <Route path="contact" element={<Contact />} />       {/* page 404 */}
          <Route path="build" element={<Build />} />       {/* page 404 */}
            <Route path="admin" element={<PrivateRoute><Admin /></PrivateRoute>} />       {/* page 404 */}
          <Route path="login" element={<Login />} />       {/* page 404 */}
      
        </Route>
      </Routes>
    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
