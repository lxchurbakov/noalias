#!/usr/bin/env node
const path = require('path');
const { program } = require('commander');
const { exec } = require('child_process');
const util = require('util');
const fs = require('fs')

const CACHE_PATH = path.resolve(process.cwd(), './node_modules/.noalias');
const CACHE_FILE = path.resolve(CACHE_PATH, 'cache');

try {
    fs.mkdirSync(CACHE_PATH)
} catch (e) {
    //
}

program
    .version(require('./package.json').version)
    
program
    .command('create <path> <alias>')
    .description('Creates an alias <alias> that will reference the path <path>')
    .action((short_path, alias) => {
        const full_path = path.resolve(process.cwd(), short_path);

        console.log('Doing...');
        console.log();
            
        exec(`rm -rf ./node_modules/${alias} && ln -s ${full_path} ./node_modules/${alias} && echo "${alias}" >> ${CACHE_FILE}`, (err) => {
            if (err) {
                console.error(err);
                return process.exit(1);
            }

            console.log(`✅ ${alias} -> ${full_path}`);
            console.log();
            console.log(`Don't forget to rerun script after node_modules purge!`);
        });
    });

program
    .command('load <config>')
    .description('Loads aliases from config file <config> and sets them all up')
    .action((config_file) => {
        const config = require(path.resolve(process.cwd(), config_file));
        const exec_promise = util.promisify(exec);

        // TODO validate config content

        console.log('Doing...');
        console.log();

        ;(async () => {
            for (let alias in config.aliases) {
                const short_path = config.aliases[alias];
                const full_path = path.resolve(process.cwd(), short_path);

                await exec_promise(`rm -rf ./node_modules/${alias} && ln -s ${full_path} ./node_modules/${alias} && echo "${alias}" >> ${CACHE_FILE}`);

                console.log(`✅ ${alias} -> ${full_path}`);
            }            
        })().catch((err) => {
            console.error(err);
            return process.exit(1);
        });
    });

program
    .command('cleanup')
    .description('Removes all created aliases')
    .action(() => {
        const exec_promise = util.promisify(exec);
        const stat = util.promisify(fs.stat);

        ;(async () => {
            if (!await stat(CACHE_FILE).catch(() => false)) {
                console.log('🤔 There is no cache. Looks like you have no aliases yet.');
                return process.exit(0);
            }

            await exec_promise(`cat "${CACHE_FILE}" | xargs -I {} rm -rf "./node_modules/{}" && rm ${CACHE_FILE}`);   
            console.log(`✅ Done.`);    
        })().catch((err) => {
            console.error(err);
            return process.exit(1);
        });        
    });

program.parse();
