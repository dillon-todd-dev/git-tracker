import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { UserButton } from '@clerk/nextjs';
import AppSidebar from '@/app/_components/app-sidebar';

type Props = {
  children: React.ReactNode;
};

const ProtectedDashboard = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='m-2 w-full'>
        <div className='flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar p-2 px-4 shadow'>
          {/* <SearchBar /> */}
          <div className='ml-auto'></div>
          <UserButton />
        </div>
        <div className='h-4'></div>
        {/* main content */}
        <div className='h-[calc(100vh-6rem)] overflow-y-scroll rounded-md border border-sidebar-border bg-sidebar p-4 shadow'>
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default ProtectedDashboard;
