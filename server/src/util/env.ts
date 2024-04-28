import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.string().default("3000"),
    USERNAME: z.string(),
    PASSWORD: z.string(),
    DATA_PATH: z.string(),
  },
  runtimeEnv: Bun.env,
});
