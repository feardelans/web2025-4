#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
    .version('1.0.0')
    .description('Програма для завдання web2025-4')
    .option('-n, --name <name>', 'Вказати імʼя користувача')
    .parse(process.argv);

const options = program.opts();
if (options.name) {
    console.log(`Привіт, ${options.name}!`);
} else {
    console.log("Привіт! Використовуйте параметр --name для вказання вашого імені.");
}
