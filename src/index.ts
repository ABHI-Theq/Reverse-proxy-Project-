import {program} from 'commander'
import cluster from 'node:cluster'
import { parseYAMLConfig,validateConfigSchema } from './config'
import { createServer } from './server'
import { ConfigSchemaType } from './config-schema'
import os from 'os'

async function main(){
        program.option('--config <path>')
        program.parse()

        const options=program.opts()
        // console.log(options);

        if(options && 'config' in options){
            const validatedConfig = await validateConfigSchema(
                await parseYAMLConfig(options.config)
            )
            await createServer({
                port: (validatedConfig as any).server.listen,
                workercount: (validatedConfig as any).server.workers ?? os.cpus().length,
                config : validatedConfig as ConfigSchemaType
            })
        
            
        }
        
}

main()