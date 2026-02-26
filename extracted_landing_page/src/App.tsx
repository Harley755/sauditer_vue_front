import { RouterProvider } from 'react-router';
import { AuditProvider } from './contexts/AuditContext';
import { router } from './routes';

export default function App() {
  return (
    <AuditProvider>
      <RouterProvider router={router} />
    </AuditProvider>
  );
}