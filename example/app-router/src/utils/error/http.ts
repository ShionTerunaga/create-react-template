/**
 * 適宜必要なステータスを追加する
 */
type HttpStatus = 404 | 500;

export class HttpError extends Error {
    public type: string;
    public status: HttpStatus;
    public message: string;

    constructor({ status, message }: { status: HttpStatus; message: string }) {
        super(message);

        this.type = "httpError";
        this.status = status;
        this.message = message;
    }
}
