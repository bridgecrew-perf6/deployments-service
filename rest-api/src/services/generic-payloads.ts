export const Schema = {
    BadRequest: {
        $id: "bad-request",
        type: "object",
        properties: {
            message: {type: "string"}
        }
    }
}

export interface BadRequestReply {
    message: string
}

export interface NoContentReply {
    
}