import Elysia from "elysia";
import { deleteVideoRoute, uploadVideoRoute } from "./UploadVideo";
import ServiceError from "../Errors/Http";

export const ElysiaRoutes = new Elysia()
	.onError(({ code, error }) => {
		if (error instanceof ServiceError) {
			return {
				message: error.message,
				code,
			};
		}
	})

	.use(uploadVideoRoute)
	.use(deleteVideoRoute);
