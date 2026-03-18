import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./Layouts/layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Property from "./pages/property";
import Contact from "./pages/Contact";
import Build from "./pages/Build";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/login";
import PrivateRoute from "./components/PrivateRoute";
import AgentApply from "./pages/AgentApply";
import Account from "./pages/Account";
import AnalyticsRouteTracker from "./components/AnalyticsRouteTracker";
import AnalyticsUserBootstrap from "./components/AnalyticsUserBootstrap";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AnalyticsUserBootstrap />
        <AnalyticsRouteTracker />
        <Routes>
        {/* Layout global */}
        <Route path="/" element={<Layout />}>
          {/* Pages enfants */}
          <Route index element={<Home />} />          {/* page / */}
          <Route path="search" element={<Search />} /> {/* page /search */}
          <Route path="property/:id" element={<Property />} />       {/* page 404 */}
          <Route path="contact" element={<Contact />} />       {/* page 404 */}
          <Route path="build" element={<Build />} />       {/* page 404 */}
            <Route path="dashboard" element={<PrivateRoute roles={['ADMIN','AGENT']}><Dashboard /></PrivateRoute>} />
            {/* Aliases (compatibilitÃ©) */}
            <Route path="admin" element={<PrivateRoute roles={['ADMIN']}><Dashboard /></PrivateRoute>} />
            <Route path="admin/properties" element={<PrivateRoute roles={['ADMIN']}><Dashboard /></PrivateRoute>} />
            <Route path="account" element={<PrivateRoute roles={['USER','AGENT','ADMIN']}><Account /></PrivateRoute>} />
            <Route path="agent/apply" element={<AgentApply />} />
          <Route path="login" element={<Login />} />       {/* page 404 */}
      
        </Route>
      </Routes>
    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
