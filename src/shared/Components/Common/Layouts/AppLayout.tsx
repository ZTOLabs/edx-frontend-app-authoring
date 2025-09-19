import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider, useSidebar } from '@/shared/Components/ui/sidebar';

import { cn } from 'shared/lib/utils';
import AppSidebar from './AppSidebar';
import ChatBoxContainer from './Chatbox/ChatBoxContainer';

const AppLayout = () => {
  const { open } = useSidebar();
  return (
    <div className="tw-flex tw-flex-row tw-h-screen tw-w-screen">
      <AppSidebar />
      <SidebarInset
        className={cn(
          'tw-bg-gradient-to-r tw-from-[#FBFAFF] tw-to-[#ECE9FE]',
          'tw-p-3 tw-gap-3',
          'tw-flex !tw-flex-row',
          open ? 'tw-pr-3' : 'tw-pr-0',
        )}
      >
        <Outlet />
        <ChatBoxContainer />
      </SidebarInset>
    </div>
  );
};

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
