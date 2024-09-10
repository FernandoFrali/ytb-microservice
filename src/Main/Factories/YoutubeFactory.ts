import { ManageVideo } from "../../Domain/UseCases/ManageVideo";
import { YoutubeApi } from "../../Infra/Gateways/YoutubeApi";
import { YoutubeVideoRepository } from "../../Infra/Repositories/Youtube";

export function makeYoutubeManageVideo() {
	const youtubeAdapter = new YoutubeApi();
	const youtubeVideoRepository = new YoutubeVideoRepository(youtubeAdapter);

	return new ManageVideo(youtubeVideoRepository);
}
