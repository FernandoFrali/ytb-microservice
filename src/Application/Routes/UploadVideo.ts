import { Elysia, t } from "elysia";
import validator from "validator";
import { makeYoutubeManageVideo } from "../../Main/Factories/YoutubeFactory";
import ServiceError from "../Errors/Http";

export const uploadVideoRoute = new Elysia().post(
	"/video",
	({ body }) => {
		if (!validator.isUUID(body.product_uuid))
			throw new ServiceError("Invalid product_uuid", 400);

		const cache_uuid = crypto.randomUUID();

		makeYoutubeManageVideo()
			.send({
				cache_uuid,
				file: body.video,
				title: body.product_name,
				product_uuid: body.product_uuid,
			})
			.catch(() => null);

		return {
			uuid: cache_uuid,
		};
	},
	{
		body: t.Object({
			video: t.File({
				type: ["video/mp4", "video/quicktime", "video/x-msvideo"],
				maxSize: "100m",
			}),
			product_uuid: t.String(),
			product_name: t.String(),
		}),
		response: t.Object({
			uuid: t.String(),
		}),
	},
);

export const deleteVideoRoute = new Elysia().delete(
	"/video",
	async ({ query }) => {
		await makeYoutubeManageVideo().delete(query.video_url, query.product_uuid);

		return {
			status: "success",
		};
	},
	{
		query: t.Object({
			video_url: t.String(),
			product_uuid: t.String(),
		}),
		response: t.Object({
			status: t.String(),
		}),
	},
);
