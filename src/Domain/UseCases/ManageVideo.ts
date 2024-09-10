import { StreamingRepository } from "../Contracts/Repositories/Streaming";

export class ManageVideo {
	constructor(private readonly streamingRepository: StreamingRepository) { }

	async send(input: StreamingRepository.Input) {
		return this.streamingRepository.save(input);
	}

	async delete(video_url: string, product_uuid: string): Promise<void> {
		await this.streamingRepository.remove(video_url, product_uuid);
	}
}
