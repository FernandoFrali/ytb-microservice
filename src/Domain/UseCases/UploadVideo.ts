import { StreamingRepository } from "../Contracts/Repositories/Streaming";

export class UploadVideo {
	constructor(private readonly streamingRepository: StreamingRepository) { }

	async execute(
		input: StreamingRepository.Input,
	): Promise<StreamingRepository.Output> {
		return this.streamingRepository.save(input);
	}
}
