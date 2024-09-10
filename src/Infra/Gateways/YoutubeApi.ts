import { promises as fs } from "fs";
import streamifier from "streamifier";
import { google, youtube_v3 } from "googleapis";
import { ManageVideo } from "../../Domain/Contracts/Gateways/Video";
import { envVariables } from "../../Main/Config/Env";
import ServiceError from "../../Application/Errors/Http";
import { redisClient } from "../Database/Cache/Redis";

const oAuth2Client = new google.auth.OAuth2(
	envVariables.CLIENT_ID,
	envVariables.CLIENT_SECRET,
	envVariables.REDIRECT_URI,
);

type Input = ManageVideo.Input;
type Output = ManageVideo.Output;

export class YoutubeApi implements ManageVideo {
	private youtube: youtube_v3.Youtube;

	constructor() {
		oAuth2Client.setCredentials({
			refresh_token: envVariables.REFRESH_TOKEN,
		});

		this.youtube = google.youtube({
			version: "v3",
			auth: oAuth2Client,
		});
	}

	private async addRes(data: {
		error: string;
		uuid: string;
		status?: string;
		finished?: boolean;
	}) {
		let cache = await redisClient.get(`${data.uuid}:video`);

		if (!cache) cache = JSON.stringify({ error: "", finished: false });

		const newCache = JSON.stringify({
			error: data.error,
			status: data.status,
			finished: data.finished ?? false,
		});

		await redisClient.set(`${data.uuid}:video`, newCache, {
			EX: 60 * 60,
		});
	}

	private async createLocalVideo(data: {
		name: string;
		buffer: Buffer;
		cache_uuid: string;
	}) {
		const { name, buffer, cache_uuid: uuid } = data;
		const videoPath = `./Archives/${name}.mp4`;

		await fs
			.writeFile(videoPath, buffer)
			.then(() => {
				this.addRes({ error: "", status: "file_saved", uuid });
			})
			.catch(() => {
				this.addRes({
					error: "Erro ao salvar o vídeo",
					finished: true,
					uuid,
				});
			});
	}

	async uploadVideo(input: Input): Promise<Output> {
		const buffer = Buffer.from(await input.file.arrayBuffer());
		const videoStream = streamifier.createReadStream(buffer);

		await this.createLocalVideo({
			name: input.product_uuid,
			buffer,
			cache_uuid: input.cache_uuid,
		});

		const { data } = await this.youtube.videos
			.insert({
				part: ["snippet", "status"],
				media: {
					body: videoStream,
				},
				requestBody: {
					snippet: {
						title: input.title,
					},
					status: {
						privacyStatus: "unlisted",
					},
				},
			})
			.then((res) => {
				const ytbStatus = res.data.status?.uploadStatus || "unexpected_error";
				this.addRes({
					error: "",
					status: ytbStatus,
					finished: true,
					uuid: input.cache_uuid,
				});

				return res;
			})
			.catch(() => {
				this.addRes({
					error: "Erro ao enviar o vídeo para o Youtube",
					finished: true,
					uuid: input.cache_uuid,
				});

				return { data: { id: "", status: { uploadStatus: "" } } };
			});

		if (!data || !data.id || !data.status || !data.status.uploadStatus) {
			throw new ServiceError("Erro ao enviar o vídeo para o Youtube", 400);
		}

		return { videoId: data.id, status: data.status.uploadStatus };
	}

	async deleteVideo(video_id: string): Promise<void> {
		await this.youtube.videos.delete({
			id: video_id,
		});
	}
}
