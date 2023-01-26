import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export type ShowFilterTypes = undefined | "COMPLETED" | "FAVORITED";

export const todosRouter = createTRPCRouter({
  add: publicProcedure
    .input(z.object({ description: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.todo.create({
        data: {
          description: input.description,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.todo.delete({ where: { id: input.id } });
    }),

  favorite: publicProcedure
    .input(z.object({ id: z.string(), favorite: z.boolean() }))
    .mutation(({ input, ctx }) => {
      const favorite = !input.favorite;

      return ctx.prisma.todo.update({
        where: { id: input.id },
        data: { favorite },
      });
    }),

  complete: publicProcedure
    .input(z.object({ id: z.string(), completed: z.boolean() }))
    .mutation(({ input, ctx }) => {
      const completed = !input.completed;

      return ctx.prisma.todo.update({
        where: { id: input.id },
        data: { completed },
      });
    }),

  getAllTodos: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany();
  }),
});
