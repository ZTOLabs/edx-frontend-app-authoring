import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from 'components/ui/sidebar';
import AppSidebar from './AppSidebar';

const AppLayout = () => (
  <SidebarProvider>
    <div className="tw-flex tw-flex-row tw-h-screen">
      <AppSidebar />
      <SidebarInset>
        <main className="tw-flex-1 tw-overflow-y-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </div>
  </SidebarProvider>

);

export default AppLayout;
