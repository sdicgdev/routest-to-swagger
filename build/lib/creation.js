'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.swaggerize_package_info = swaggerize_package_info;
exports.assemble_swagger_file = assemble_swagger_file;
exports.add_path = add_path;

var _immutable = require('immutable');

var PATH_PROTOTYPE = (0, _immutable.Map)({
  responses: (0, _immutable.Map)({
    200: (0, _immutable.Map)({
      description: "successful request"
    })
  }),
  parameters: (0, _immutable.List)()
});

function swaggerize_package_info(package_info) {
  return (0, _immutable.Map)({
    title: package_info.name,
    description: package_info.description,
    version: package_info.version
  });
}

function assemble_swagger_file(info, paths) {
  var json_only = _immutable.List.of('application/json');
  var swagger_definition = (0, _immutable.Map)({
    swagger: "2.0",
    info: info,
    paths: paths,
    consumes: json_only,
    produces: json_only,
    schemes: _immutable.List.of('https')
  });
  return swagger_definition;
}

function add_path(paths, route) {
  if (!route) return paths;
  var swagger_url = swaggerize_url(route.get('path'));
  var swagger_path_definition = swaggerize_definition(route);
  var updated_paths = paths.setIn([swagger_url, swagger_path_definition.get('method')], swagger_path_definition.get('definition'));

  for (var _len = arguments.length, remaining = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    remaining[_key - 2] = arguments[_key];
  }

  return add_path.apply(undefined, [updated_paths].concat(remaining));
}

function swaggerize_url(route) {
  var hard_route = route.match(/^\//) ? route : '/' + route;
  var swagger_url = parameter_list(hard_route).reduce(function (path, regex, n) {
    return path.replace(regex, '{var_' + n + '}');
  }, hard_route);
  return swagger_url.replace(/:/g, '');
}

function swaggerize_definition(route) {
  var proto = arguments.length <= 1 || arguments[1] === undefined ? PATH_PROTOTYPE : arguments[1];

  var new_path = proto.set('parameters', parameters_for(route));
  return (0, _immutable.Map)({
    method: route.get('method').toLowerCase(),
    definition: new_path
  });
}

function parameter_list(url) {
  return (0, _immutable.List)(url.match(/:[^\/]*/g));
}

function parameters_for(route) {
  var url_params = parameter_list(route.get('path')).map(function (arg) {
    return arg.substring(1);
  }).map(function (name, id) {
    return (0, _immutable.Map)({
      name: 'var_' + id,
      in: 'path',
      required: 'true',
      type: 'string',
      description: name.replace(/_/g, ' ')
    });
  });

  return url_params;
}