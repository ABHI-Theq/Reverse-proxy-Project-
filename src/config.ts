import fs from 'node:fs/promises';
import {parse} from 'yaml';
import { rootConfigSchema } from './config-schema';

export async function parseYAMLConfig(filepath: string){
    const configFileCotnent = await fs.readFile(filepath, 'utf-8');
    const config = parse(configFileCotnent);
    return JSON.stringify(config);
}

export async function validateConfigSchema(config: string){
    try {
        const validatedConfig=await rootConfigSchema.parseAsync(JSON.parse(config));
        return validatedConfig;
    } catch (error) {
        console.log(error);
        return error;
    }
}

