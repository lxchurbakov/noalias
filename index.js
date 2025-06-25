#!/usr/bin/env node
const path = require('path');
const { program } = require('commander');
const { exec } = require('child_process');
const util = require('util');

program
    .version(require('./package.json').version)
    
program
    .command('create <path> <alias>')
    .description('Creates an alias <alias> that will reference the path <path>')
    .action((short_path, alias) => {
        const full_path = path.resolve(process.cwd(), short_path);

        console.log('Doing...');
        console.log();
            
        exec(`rm -rf ./node_modules/${alias} && ln -s ${full_path} ./node_modules/${alias}`, (err, stdout) => {
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

                await exec_promise(`rm -rf ./node_modules/${alias} && ln -s ${full_path} ./node_modules/${alias}`);

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
    .action((config_file) => {
        // const config = require(path.resolve(process.cwd(), config_file));
        // const exec_promise = util.promisify(exec);

        // // TODO validate config content

        // console.log('Doing...');
        // console.log();

        // ;(async () => {
        //     for (let alias in config.aliases) {
        //         const short_path = config.aliases[alias];
        //         const full_path = path.resolve(process.cwd(), short_path);

        //         await exec_promise(`rm -rf ./node_modules/${alias} && ln -s ${full_path} ./node_modules/${alias}`);

        //         console.log(`✅ ${alias} -> ${full_path}`);
        //     }            
        // })().catch((err) => {
            console.error('not implemented yet');
            return process.exit(1);
        // });
    });

program.parse();

// const options = program.opts();
// const limit = options.first ? 1 : undefined;
// console.log(program.args[0].split(options.separator, limit));