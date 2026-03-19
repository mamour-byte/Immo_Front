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
import { Analytics } from "@vercel/analytics/next";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        {/* Initialisation Vercel Analytics */}
        <Analytics />
        
        {/* Ton bootstrap / route tracker custom */}
        <AnalyticsUserBootstrap />
        <AnalyticsRouteTracker />
        
        <Routes>
          {/* Layout global */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="property/:id" element={<Property />} />
            <Route path="contact" element={<Contact />} />
            <Route path="build" element={<Build />} />
            <Route path="dashboard" element={<PrivateRoute roles={['ADMIN','AGENT']}><Dashboard /></PrivateRoute>} />
            <Route path="admin" element={<PrivateRoute roles={['ADMIN']}><Dashboard /></PrivateRoute>} />
            <Route path="admin/properties" element={<PrivateRoute roles={['ADMIN']}><Dashboard /></PrivateRoute>} />
            <Route path="account" element={<PrivateRoute roles={['USER','AGENT','ADMIN']}><Account /></PrivateRoute>} />
            <Route path="agent/apply" element={<AgentApply />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}