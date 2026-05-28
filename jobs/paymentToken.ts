import { prisma } from "../prisma/prisma";
import { client } from "../trigger";
import { cronTrigger } from "@trigger.dev/sdk";

client.defineJob({
  id: "token-deletion",
  name: "Delete all tokens older than 2 hours",
  version: "0.1.1",
  trigger: cronTrigger({
    cron: "0 */2 * * *",
  }),

  run: async (payload, io, ctx) => {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - 2);

    const { count } = await prisma.token.deleteMany({
      where: {
        created_at: {
          lt: cutoffDate,
        },
      },
    });

    return {
      success: true,
      deleted: count,
    };
  },
});
