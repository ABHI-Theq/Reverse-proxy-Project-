import {z} from 'zod';


const upstreamsSchema=z.array(z.object({
        id:z.string(),
        url:z.string()
    }))


const headersSchema=z.object({
    key:z.string(),
    value:z.string()
})

const pathSchema=z.object({
    path:z.string(),
    upstreams:z.array(z.string())
})


const serverSchema = z.object({
    listen:z.number(),
    workers:z.number().optional(),
    upstreams:upstreamsSchema,
    headers:z.array(headersSchema).optional(),
    rules:z.array(pathSchema)
})

export const rootConfigSchema = z.object({
    server:serverSchema
})

export type ConfigSchemaType =z.infer<typeof rootConfigSchema>