import { Response } from 'express';

class HttpResponse {
    protected statusCode: number;
    protected body: { [key: string]: any } | null;
    protected message: string;

    constructor(statusCode: number, body: { [key: string]: any } | null, message: string) {
        this.statusCode = statusCode;
        this.body = body;
        this.message = message;
    }

    send(res: Response): void {
        res.status(this.statusCode).json({
            statusCode: this.statusCode,
            message: this.message,
            data: this.body,
        });
    }

    getMessage(): string {
        return this.message;
    }
}

export class OK extends HttpResponse {
    constructor(body: { [key: string]: any }, message: string) {
        super(200, body, message);
    }
}

export class Created extends HttpResponse {
    constructor(body: { [key: string]: any }, message: string) {
        super(201, body, message);
    }
}

export class NoContent extends HttpResponse {
    constructor(message: string) {
        super(204, null, message);
    }
}

export class BadRequest extends HttpResponse {
    constructor(message: string) {
        super(400, null, message);
    }
}

export class Unauthorized extends HttpResponse {
    constructor(message: string) {
        super(401, null, message);
    }
}

export class Forbidden extends HttpResponse {
    constructor(message: string) {
        super(403, null, message);
    }
}

export class NotFound extends HttpResponse {
    constructor(message: string) {
        super(404, null, message);
    }
}

export class UnprocessableEntity extends HttpResponse {
    constructor(message: string) {
        super(422, null, message);
    }
}

export class Conflict extends HttpResponse {
    constructor(message: string) {
        super(409, null, message);
    }
}

export class InternalServerError extends HttpResponse {
    constructor(message: string) {
        super(500, null, message);
    }
}

export class ParameterError extends HttpResponse {
    constructor(message: string) {
        super(422, null, message);
    }
}