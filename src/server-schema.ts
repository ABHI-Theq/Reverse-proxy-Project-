import {z} from 'zod';

export const workerMessageSchema=z.object({
    request:z.enum(['HTTP']),
    headers:z.any(),
    body:z.any(),
    url:z.string()
})

export const workerMessageReplySchema=z.object({
    data:z.string().optional(),
    error:z.string().optional(),
    errorCode:z.enum(['500','404']).optional()
})


export type server_schema=z.infer<typeof workerMessageSchema>
export type workerMessageReplyType=z.infer<typeof workerMessageReplySchema>