import { createBrowserRouter } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { AuditSelection } from './pages/AuditSelection';
import { Questionnaire } from './pages/Questionnaire';
import { Results } from './pages/Results';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage
  },
  {
    path: '/dashboard',
    Component: Dashboard
  },
  {
    path: '/audit-selection',
    Component: AuditSelection
  },
  {
    path: '/questionnaire',
    Component: Questionnaire
  },
  {
    path: '/results',
    Component: Results
  }
]);
