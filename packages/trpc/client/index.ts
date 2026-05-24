import { createTRPCClient, httpBatchLink } from "@trpc/client";

import type { ServerRouter } from "../server";

export const trpcClient = createTRPCClient<ServerRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:8000/trpc",
    }),
  ],
});
