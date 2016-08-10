#!/usr/bin/env node

import ingest from '../lib/ingest';
const parseArgs = require('minimist');
const fs        = require('fs');

const argv = parseArgs(process.argv.slice(2))

const package_file_location = location_of(argv.p||argv.package||'./package.json')
const output_file_location  = location_of(argv.o||argv.output ||'./swagger.json')
const package_info = require(package_file_location);
const path_glob    = location_of(argv.g||argv.glob)

if(!path_glob) throw new Error("No way to find routes files given. -g or --glob are required.")

ingest(package_info, path_glob)
  .then(swagger_file => {
    const json_output = JSON.stringify(swagger_file, null, "\t")
    fs.writeFile(output_file_location, json_output, (e) =>{if(e){ throw(e) }});
  })
  .catch(e => console.log(e))


function location_of(filename){
  const location = filename.match(/^\//) ? filename : `${process.cwd()}/${filename}`;
  return location;
}
