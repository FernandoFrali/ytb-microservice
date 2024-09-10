export namespace ManageVideo {
	export type Input = {
		cache_uuid: string;
		file: File;
		title: string;
		product_uuid: string;
	};
	export type Output = { videoId: string; status: string };
}

export interface ManageVideo {
	uploadVideo(data: ManageVideo.Input): Promise<ManageVideo.Output>;
	deleteVideo(video_id: string): Promise<void>;
}
