import { useQueryClient } from '@tanstack/react-query';

const UseRefetch = () => {
  const queryClient = useQueryClient();
  return async () => {
    await queryClient.refetchQueries({
      type: 'active',
    });
  };
};

export default UseRefetch;
