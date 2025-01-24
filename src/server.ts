import cluster,{Worker} from "cluster";
import { ConfigSchemaType, rootConfigSchema } from "./config-schema";
import http from 'http'
import { server_schema,workerMessageReplySchema,workerMessageReplyType,workerMessageSchema } from "./server-schema";
interface createConfig{
    port:number,
    workercount:number,
    config: ConfigSchemaType
}
export async function createServer(config: createConfig){
    const {workercount,port}=config
   const WORKER_POOL: Worker[]=[]

    if(cluster.isPrimary){
        console.log('Master process executed 🚀')
        for (let i = 0; i < workercount; i++) {
            const w=cluster.fork({config:JSON.stringify(config.config)})
            WORKER_POOL.push(w);
            console.log(`Master process: work node spinning up ${i}`);
        }
        const server=http.createServer(function(req,res){
            const index=Math.floor(Math.random()*workercount)            
            const worker: Worker=WORKER_POOL[index]
            
            const payload: server_schema={
                request:"HTTP",
                headers:req.headers,
                body:null,
                url:`${req.url}`
            }

            worker.send(JSON.stringify(payload))
            worker.once('message', async(workerReply: string) => {
                const reply=await workerMessageReplySchema.parseAsync(JSON.parse(workerReply))
                if(reply.errorCode){
                    res.writeHead(parseInt(reply.errorCode))
                    res.end(reply.error)
                    return;
                }else{
                    res.writeHead(200)
                    res.end(reply.data)
                    return; 
                }
            })
        }) 

        server.listen(port,()=>{
            console.log(`reverse proxy server is running on ${port}`);
        })
    }else{ 
        console.log("worker Node is executing 🌟");
        const config=await rootConfigSchema.parseAsync(
            JSON.parse(`${process.env.config}`)
        )

        process.on('message',async (message)=>{
            const validateMessage=await workerMessageSchema.parseAsync(JSON.parse(`${message}`))
            console.log(message);

            const requestURL=validateMessage.url
            const rule=config.server.rules.find(e=>e.path===requestURL.split('/')[1] || e.path === '/')

            if(!rule){
                const reply: workerMessageReplyType={
                    error:"Rule not found",
                    errorCode:'404',
                };

                if(process.send){
                  return  process.send(JSON.stringify(reply))
                }
            }

            const upstreamsID=rule?.upstreams[0]   
            const upstream=config.server.upstreams.find(e=>e.id===upstreamsID)
            if(!upstream){
                const reply: workerMessageReplyType={
                    error:"upstreamID not found",
                    errorCode:'404',
                };

                if(process.send){
                  return  process.send(JSON.stringify(reply))
                }
            }

            const request=http.request({host:upstream?.url,path:requestURL,method:'GET'},(proxyRes)=>{
                let data='';
                proxyRes.on('data',chunk=>{
                    data+=chunk
                })
                proxyRes.on('end',()=>{
                    const reply: workerMessageReplyType={
                        data:data
                    };
                    if(process.send){
                        return process.send(JSON.stringify(reply))
                    }
                })
            })

            request.end();
        })
    }
}