'use client';

import useProjects from '@/hooks/use-project';
import { useUser } from '@clerk/nextjs';

const DashboardPage = () => {
  const { project } = useProjects();

  return <div>{project?.name}</div>;
};
export default DashboardPage;
