import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure.input().mutation(async ({ ctx, input }) => {
    console.log('hi');
    return true;
  }),
});
