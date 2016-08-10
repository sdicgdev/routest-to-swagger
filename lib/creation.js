import { List, Map } from 'immutable';

const PATH_PROTOTYPE = Map({ 
        responses: Map({
          200: Map({
            description: "successful request"
          })
        }),
        parameters: List()
      });

export function swaggerize_package_info(package_info){
  return Map({
    title: package_info.name,
    description: package_info.description,
    version: package_info.version,
  })
}

export function assemble_swagger_file(info, paths){
  const json_only = List.of('application/json');
  const swagger_definition = Map({
    swagger: "2.0",
    info,
    paths,
    consumes: json_only,
    produces: json_only,
    schemes:  List.of('https')
  })
  return swagger_definition
}

export function add_path(paths, opts, route, ...remaining){
  if(!route) return paths
  const swagger_url = swaggerize_url(route.get('path'), opts);
  const swagger_path_definition = swaggerize_definition(route, opts);
  const updated_paths = paths.setIn([swagger_url, swagger_path_definition.get('method')], swagger_path_definition.get('definition'))
  return add_path(updated_paths, opts, ...remaining)
}

function swaggerize_url(route, opts){
  const hard_route = route.match(/^\//)?route:`/${route}`; 
  const swagger_url = parameter_list(hard_route).reduce((path, regex, n) => {
    const var_name = opts.aws?`{var_${n}}`:`{${regex}}`;
    return path.replace(regex, var_name)
  } , hard_route)
  return swagger_url.replace(/:/g, '');
}

function swaggerize_definition(route, opts, proto=PATH_PROTOTYPE){
  const new_path = proto.set('parameters', parameters_for(route, opts))
  return Map({
    method: route.get('method').toLowerCase(),
    definition: new_path
  })
}

function parameter_list(url){
  return List(url.match(/:[^\/]*/g)) 
}

function parameters_for(route, opts){
  const url_params = parameter_list(route.get('path'))
                        .map(arg => arg.substring(1))
                        .map((name, id) => Map({
                          name: opts.aws?`var_${id}`:name,
                          in: 'path',
                          required: 'true',
                          type: 'string',
                          description: name.replace(/_/g, ' ')
                        }))

  return url_params;
}
