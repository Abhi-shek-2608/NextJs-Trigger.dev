
// src/pages/api/github-webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { tasks } from "@trigger.dev/sdk/v3";
import { githubPushLoggerTask } from "@/trigger/github-push";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // GitHub sends JSON by default when content-type is application/json
    const payload = req.body;
    const event = req.headers["x-github-event"] as string | undefined;

    // Optional: quick log (avoid logging secrets in prod)
    console.log("GitHub event:", event);

    if (event === "ping") {
      return res.status(200).json({ message: "pong" });
    }

    if (event !== "push") {
      return res.status(200).json({ message: "Ignoring non-push event" });
    }

    // Trigger the Trigger.dev task
    await tasks.trigger<typeof githubPushLoggerTask>("github-push-logger", payload);
    console.log("Task triggereddd");
    return res.status(200).json({ message: "Task triggered" })
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
