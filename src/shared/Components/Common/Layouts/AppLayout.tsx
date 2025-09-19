import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/shared/Components/ui/sidebar';

import AppSidebar from './AppSidebar';

const AppLayout = () => (
  <div className="tw-flex tw-flex-row tw-h-screen tw-w-screen">
    <AppSidebar />
    <Outlet />
  </div>
);

const Wrapper = () => (
  <SidebarProvider
    style={
      {
        '--sidebar-width': 'calc(352px)',
        '--header-height': 'calc(var(--spacing) * 12)',
      } as React.CSSProperties
    }
  >
    <AppLayout />
  </SidebarProvider>
);

export default Wrapper;
