import { z } from "zod";

const envVariablesSchema = z.object({
	DATABASE_URL: z.string(),
	CLIENT_ID: z.string(),
	CLIENT_SECRET: z.string(),
	REDIRECT_URI: z.string(),
	REDIS_HOST: z.string().default("localhost"),
	REFRESH_TOKEN: z.string(),
	PORT: z.string().default("5000"),
});

export const envVariables = envVariablesSchema.parse(process.env);
