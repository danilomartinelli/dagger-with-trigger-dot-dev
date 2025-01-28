import {additionalPackages, aptGet, syncEnvVars,additionalFiles} from '@trigger.dev/build/extensions/core';
import { emitDecoratorMetadata } from '@trigger.dev/build/extensions/typescript';
import { defineConfig } from '@trigger.dev/sdk/v3';

export default defineConfig({
  project: "proj_awxpcurgjoqbfqdaqegr",
  runtime: "node",
  logLevel: "log",
  // The max compute seconds a task is allowed to run. If the task run exceeds this duration, it will be stopped.
  // You can override this on an individual task.
  // See https://trigger.dev/docs/runs/max-duration
  maxDuration: 3600,
  retries: {
    enabledInDev: false,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ["./src/trigger"],
  telemetry: {
    instrumentations: [],
  },
  build: {
    external: ["trigger.dev"],
    extensions: [
      additionalFiles({
        files: ["build.mts"]
      }),
      syncEnvVars(_ => ({
        DO_NOT_TRACK: "1",
        TRIGGER_TELEMETRY_DISABLED: "1"
      })),
      aptGet({ packages: ['curl'] }),
      additionalPackages({ packages: ['typescript', 'ts-node', '@dagger.io/dagger', "zod"] }),
      emitDecoratorMetadata(),
    ],
  },
});
