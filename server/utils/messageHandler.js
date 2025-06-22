export const messageHandler = (res, statusCode, success, message, payload, token) => {

    return res.status(statusCode).json({success : success, message: message,  payload: payload, token })

}