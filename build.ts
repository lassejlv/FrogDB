/// <reference types='bun-types' />
// Script made by @aquapi - https://github.com/bit-js/library/blob/main/build.ts
// Modified by @benjamint08 for ProBun
import {existsSync, rmSync} from 'fs';
import pkg from './package.json';
import {$} from 'bun';
import {parseArgs} from "util";

// Generating types
const dir = './lib';
if (existsSync(dir)) rmSync(dir, { recursive: true });

// Build source files
Bun.build({
    format: 'esm',
    target: 'bun',
    outdir: './lib',
    entrypoints: ['./src/index.ts', './src/helpers/format.ts'],
    minify: {
        whitespace: true
    },
});

await $`bun x tsc`;

const { values, positionals } = parseArgs({
    args: Bun.argv,
    options: {
        version: {
            type: 'string',
        },
    },
    strict: true,
    allowPositionals: true,
});