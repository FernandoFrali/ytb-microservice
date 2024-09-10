import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import { envVariables } from "../../../Main/Config/Env";

export const kyselyDb = new Kysely({
	dialect: new PostgresDialect({
		pool: new pg.Pool({
			connectionString: envVariables.DATABASE_URL,
		}),
	}),
});
