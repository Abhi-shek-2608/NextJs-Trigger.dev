import { logger, task, wait } from "@trigger.dev/sdk/v3";

export const helloWorldTask = task({
  id: "hello-world",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload: any, { ctx }) => {
    logger.log("Hello, world!", { payload, ctx });

    await wait.for({ seconds: 5 });

    return {
      message: "Hello, world!",
    }
  },
});

export const addNumbersTask = task({
  id: "add-numbers",
  maxDuration: 300,
  run: async (payload: { a: number; b: number }, { ctx }) => {
    const result = payload.a + payload.b;
    logger.log("Adding numbersss", { a: payload.a, b: payload.b, result });
    return { result };
  },
});