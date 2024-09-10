export default class ServiceError extends Error {
	message: string;
	code: number;

	constructor(message: string, code: number) {
		super(message);
		this.message = message;
		this.code = code;
	}
}
