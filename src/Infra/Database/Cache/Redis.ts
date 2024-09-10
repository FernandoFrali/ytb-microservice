import { createClient } from "redis";
import { envVariables } from "../../../Main/Config/Env";

export const redisClient = createClient({
	socket: {
		host: envVariables.REDIS_HOST,
	},
	database: 0,
});

redisClient.connect();

redisClient.on("error", (error) => {
	console.error(error);
});
