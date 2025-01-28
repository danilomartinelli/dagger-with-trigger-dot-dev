import { schemaTask } from '@trigger.dev/sdk/v3';
import { z } from 'zod';

export const daggerExampleTask = schemaTask({
  id: 'dagger-example-task',
  maxDuration: 900, // Stop executing after 900 secs (15 mins) of compute
  schema: z.object({
    image: z.object({
      version: z.enum(['lts', '22', '21', '20', '18']).default('18'),
    }),
  }),
  run: async (payload) => {
    const { runPipeline } = await import("../../build.mjs");

    try {
      const result = await runPipeline(payload);

      return {
        success: true,
        pipelineResult: result,
      };
    } catch (error) {
      console.error("Pipeline execution failed", error);

      return {
        success: false,
        error: (error as Error).message,
      };
    }
  },
});