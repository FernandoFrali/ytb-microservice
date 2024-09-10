export namespace StreamingRepository {
	export type Input = {
		cache_uuid: string;
		file: File;
		title: string;
		product_uuid: string;
	};
}

export interface StreamingRepository {
	save(data: StreamingRepository.Input): Promise<void>;
	remove(video_url: string, product_uuid: string): Promise<void>;
}
