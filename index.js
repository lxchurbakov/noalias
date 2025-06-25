#!/usr/bin/env node
const path = require('path');
const { program } = require('commander');
const { exec } = require('child_process');
const util = require('util');
const fs = require('fs')

const CACHE_PATH = path.resolve(process.cwd(), './node_modules/.noalias');
const CACHE_FILE = path.resolve(CACHE_PATH, 'cache');

const exec_promise = util.promisify(exec);

try {
    fs.mkdirSync(CACHE_PATH)
} catch (e) {
    //
}

const WARNING = `⚠️ Depending on the system you are using your aliases might get wiped when doing "rm -rf node_modules".

Only use "rm -rf --no-dereference node_modules" to prevent that behaviour.`;

program
    .version(require('./package.json').version);
    
program
    .command('create <alias> <path>')
    .description('Creates an alias <alias> that will reference the path <path>')
    .action(async (alias, short_path) => {
        const full_path = path.resolve(process.cwd(), short_path);

        console.log('Doing...');
        console.log();

        const node_modules_path = `./node_modules/${alias}`;

        // await unprotect(node_modules_path);

        await exec_promise(`rm -rf ${node_modules_path} && ln -s ${full_path} ${node_modules_path} && echo "${alias}" >> ${CACHE_FILE}`);

        // await protect(node_modules_path);
        console.log(`✅ ${alias} -> ${full_path}`);
        console.log();
        // console.log(`Don't forget to rerun script after node_modules purge!`);
            
    //     exec(, (err) => {
    //         // if (err) {
    //         //     console.error(err);
    //         //     return process.exit(1);
    //         // }

           
    //     });
    });

program
    .command('load <config>')
    .description('Loads aliases from config file <config> and sets them all up')
    .action((config_file) => {
        const config = require(path.resolve(process.cwd(), config_file));
        
        // TODO validate config content

        console.log('Doing...');
        console.log();

        ;(async () => {
            for (let alias in config.aliases) {
                const short_path = config.aliases[alias];
                const full_path = path.resolve(process.cwd(), short_path);
                const node_modules_path = `./node_modules/${alias}`;

                await unprotect(node_modules_path);

                await exec_promise(`\
                    rm -rf ${node_modules_path}\
                    && ln -s ${full_path} ${node_modules_path}\
                    && echo "${alias}" >> ${CACHE_FILE}
                `);

                await protect(node_modules_path);

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

            await unprotect(`./node_modules`);

            await exec_promise(`cat "${CACHE_FILE}" | xargs -I {} rm -rf "./node_modules/{}" && rm ${CACHE_FILE}`);   
            console.log(`✅ Done.`);    
        })().catch((err) => {
            console.error(err);
            return process.exit(1);
        });        
    });

program.parse();
