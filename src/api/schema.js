export const schema = {
    consumes: ["multipart/form-data"],
    tags: ['app'],
    body: {
        type: "object",
        required: ["file"],
        properties: {
            file: {type: "string", format: 'binary'},
        }
    },
    response: {
        200: {
            content: {
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
                    schema: {
                        type: "object",
                    },
                },
            },
        },
    },
}