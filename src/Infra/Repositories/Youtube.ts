import { StreamingRepository } from "../../Domain/Contracts/Repositories/Streaming";
import { kyselyDb } from "../Database/Kysely/Connection";
import { YoutubeApi } from "../Gateways/YoutubeApi";

type Input = StreamingRepository.Input;

export class YoutubeVideoRepository implements StreamingRepository {
	constructor(private readonly youtubeAdapter: YoutubeApi) { }

	async save(input: Input) {
		const { videoId } = await this.youtubeAdapter.uploadVideo(input);

		await kyselyDb
			.updateTable("products")
			.set({
				video_url: `https://www.youtube.com/watch?v=${videoId}`,
				updated_at: new Date(),
			})
			.where("uuid", "=", input.product_uuid)
			.executeTakeFirst();
	}

	async remove(video_url: string, product_uuid: string): Promise<void> {
		const videoId = video_url.split("v=")[1];
		await this.youtubeAdapter.deleteVideo(videoId);

		await kyselyDb
			.updateTable("products")
			.set({
				video_url: null,
				updated_at: new Date(),
			})
			.where("uuid", "=", product_uuid)
			.executeTakeFirst();
	}
}
