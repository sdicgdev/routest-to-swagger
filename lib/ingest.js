import { List, Map } from 'immutable';
import { swaggerize_package_info, assemble_swagger_file, add_path } from './creation'
var glob = require("glob")

export default function ingest(package_info, path_glob){
  const swagger_info = swaggerize_package_info(package_info) 
  const swagger_file_promise = gather_paths(path_glob)
                  .then(result => result.reduce((paths, batch) => add_path(paths, ...batch), Map()))
                  .then(paths  => assemble_swagger_file(swagger_info, paths)) 

  return swagger_file_promise;
}

function gather_paths(dir_glob){
  return new Promise((resolve, reject) => {
    glob(dir_glob, function (er, files) {
      const routes = List(files)
          .reduce((routes_pile, file) => {
            return routes_pile.push(retrieve_paths_from(file))
          }, List())

      resolve( routes )
    })
  })
}

function retrieve_paths_from(file){
  let routes
  try { 
    routes = require(file);
  }catch(e){
    routes = {__methods: {}}
  }
  
  return Map(routes.__methods)
          .map((method) => Map(method))
          .reduce((list, method, name) => list.push(method.set('name', name))
  , List());
}
