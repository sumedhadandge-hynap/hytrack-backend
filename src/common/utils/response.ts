import { Response } from 'express';

export const sendResponse = (
    res: Response,
    code: number,
    message: string,
    result: any = null,
) => {

    return res.status(code).json({
        status:
            code >= 200 && code < 300
                ? 'success'
                : 'error',

        code,
        message,
        result,
    });
};