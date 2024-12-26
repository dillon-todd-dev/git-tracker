'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Bot,
  CreditCard,
  LayoutDashboard,
  Plus,
  Presentation,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Q&A',
    url: '/qa',
    icon: Bot,
  },
  {
    title: 'Meetings',
    url: '/meetings',
    icon: Presentation,
  },
  {
    title: 'Billing',
    url: '/billing',
    icon: CreditCard,
  },
];

const projects = [
  {
    name: 'Project 1',
  },
  {
    name: 'Project 2',
  },
  {
    name: 'Project 3',
  },
];

const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar collapsible='icon' variant='floating'>
      <SidebarHeader>Logo</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn({
                        '!bg-primary !text-white': pathname === item.url,
                      })}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
          <SidebarMenu>
            {projects.map((project) => (
              <SidebarMenuItem key={project.name}>
                <SidebarMenuButton asChild>
                  <div>
                    <div
                      className={cn(
                        'flex size-6 items-center justify-center rounded-sm border bg-white text-sm text-primary',
                        {
                          'bg-primary text-white': true,
                        },
                      )}
                    >
                      {project.name[0]}
                    </div>
                    <span>{project.name}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <div className='h-2'></div>
            <SidebarMenuItem>
              <Link href='/create'>
                <Button size='sm' variant='outline' className='w-fit'>
                  <Plus />
                  Create Project
                </Button>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
export default AppSidebar;