import { router } from "./trpc";

import { authRouter } from "./routes/auth/route";
import { healthRouter } from "./routes/health/route";
import { formRouter } from './routes/form/route';

export const serverRouter = router({
  auth: authRouter,
  health: healthRouter,
  form: formRouter,
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
