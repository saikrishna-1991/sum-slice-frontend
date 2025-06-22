import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { Toaster } from "@/components/ui/toaster";

import LoginPage from './pages/Login/Login';
import DashboardPage from './pages/Dashboard/Dashboard';
import Signup from './pages/Signup/Signup';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Header from './components/Header/Header';
import AdministrationPage from './pages/Administration/AdminPage';
import SystemAdministrationLayout from './components/Administration/System/Layout';
import SystemAdministratorPage from './components/Administration/System/System';
import UsersPage from './components/Administration/System/Users';
import RolesAndPrivilegesPage from './components/Administration/System/RolesandPrivileges';
import PrivilegesPage from './components/Administration/System/privileges';
import ApplicationAdminLayout from './components/Administration/Application/Layout';
import ApplicationDashboardPage from './components/Administration/Application/DashBoard';
import FeeTypePage from './components/Administration/Application/FeeType';
import DivisionSetupPage from './components/Administration/Application/DivisonSetup';
import PerformancePage from './components/Administration/Application/Performance';
import DealTypePage from './components/Administration/Application/DealType';
import VolumeTierSetupsPage from './components/Administration/Application/VolumeTyreSetups';
import TerritoriesPage from './components/Administration/Application/territories/territories';
import SystemFunctionalLayout from './components/Administration/Functional/Layout';
import LookupPage from './components/Administration/Functional/lookup';
import StringRepositoryPage from './components/Administration/Functional/string-repository';
import ApprovalRulePage from './components/Administration/Functional/approval-rule';
import NotificationsPage from './components/Administration/Functional/notifications';
import ServicesPage from './components/Administration/Functional/services';
import ExtensionPage from './components/Administration/Functional/extension';
import CustomFunctionsPage from './components/Administration/Functional/custom-functions';
import SectionsPage from './components/Administration/Functional/sections';

function App() {
  const location = useLocation();

  // Define routes where Header should NOT appear
  const hideHeaderRoutes = ['/', '/signup', '/forgot-password'];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/administration" element={<AdministrationPage />} />

        {/* 👇 System Administration with nested layout */}
        <Route path="/administration/system" element={<SystemAdministrationLayout />}>
          <Route index element={<SystemAdministratorPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesAndPrivilegesPage />} />
          <Route path="privileges" element={<PrivilegesPage />} />
        </Route>
        <Route path="/administration/application" element={<ApplicationAdminLayout />}>
          <Route index element={<ApplicationDashboardPage />} />
          <Route path="fee-type" element={<FeeTypePage />} />
          <Route path="division-setup" element={<DivisionSetupPage />} />
          <Route path="performance" element={<PerformancePage />} />
          <Route path="deal-type" element={<DealTypePage />} />
          <Route path="volume-tier-setups" element={<VolumeTierSetupsPage />} />
          <Route path="territories" element={<TerritoriesPage />} />
        </Route>
        <Route path="/administration/functional" element={<SystemFunctionalLayout />}>
          {/* <Route index element={<SystemAdministratorPage />} /> */}
          <Route path="lookup" element={<LookupPage />} />
          <Route path="string-repository" element={<StringRepositoryPage />} />
          <Route path="approval-rule" element={<ApprovalRulePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="extension" element={<ExtensionPage />} />
          <Route path="custom-functions" element={<CustomFunctionsPage />} />
          <Route path="sections" element={<SectionsPage />} />
        </Route>
      </Routes>

      {/* Toaster for toast notifications */}
      <Toaster />
    </>
  );
}

export default App;
