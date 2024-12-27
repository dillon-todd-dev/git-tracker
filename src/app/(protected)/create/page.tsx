'use client';

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import UseRefetch from '@/hooks/use-refetch';

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();
  const refetchProjects = UseRefetch();

  const onSubmit = (data: FormInput) => {
    createProject.mutate(
      {
        name: data.projectName,
        githubUrl: data.repoUrl,
        githubToken: data.githubToken,
      },
      {
        onSuccess: () => {
          toast.success('Project created successfully');
          refetchProjects();
          reset();
        },
        onError: () => {
          toast.error('Failed to create project');
        },
      },
    );
    return true;
  };

  return (
    <div className='flex h-full items-center justify-center gap-12'>
      <img src='/undraw_github.svg' className='h-56 w-auto' />
      <div>
        <div>
          <h1 className='text-2xl font-semibold'>
            Link your GitHub Repository
          </h1>
          <p className='text-sm text-muted-foreground'>
            Enter the URL of your repository to link it to DevLens
          </p>
        </div>
        <div className='h-4'></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
            <Input
              {...register('projectName')}
              required
              placeholder='Project Name'
            />
            <Input
              type='url '
              {...register('repoUrl')}
              required
              placeholder='Repo Url'
            />
            <Input
              {...register('githubToken')}
              placeholder='Github Token (Optional)'
            />
            <div className='h-2'></div>
            <Button type='submit' disabled={createProject.isPending}>
              Create Project
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;
