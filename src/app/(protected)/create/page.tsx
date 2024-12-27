'use client';

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();

  const onSubmit = (data: FormInput) => {
    window.alert(JSON.stringify(data, null, 2));
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
            <Button type='submit'>Create Project</Button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;
