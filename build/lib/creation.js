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

function add_path(paths, opts, route) {
  if (!route) return paths;
  var swagger_url = swaggerize_url(route.get('path'), opts);
  var swagger_path_definition = swaggerize_definition(route, opts);
  var updated_paths = paths.setIn([swagger_url, swagger_path_definition.get('method')], swagger_path_definition.get('definition'));

  for (var _len = arguments.length, remaining = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    remaining[_key - 3] = arguments[_key];
  }

  return add_path.apply(undefined, [updated_paths, opts].concat(remaining));
}

function swaggerize_url(route, opts) {
  var hard_route = route.match(/^\//) ? route : '/' + route;
  var swagger_url = parameter_list(hard_route).reduce(function (path, regex, n) {
    var var_name = opts.aws ? '{var_' + n + '}' : '{' + regex + '}';
    return path.replace(regex, var_name);
  }, hard_route);
  return swagger_url.replace(/:/g, '');
}

function swaggerize_definition(route, opts) {
  var proto = arguments.length <= 2 || arguments[2] === undefined ? PATH_PROTOTYPE : arguments[2];

  var new_path = proto.set('parameters', parameters_for(route, opts));
  return (0, _immutable.Map)({
    method: route.get('method').toLowerCase(),
    definition: new_path
  });
}

function parameter_list(url) {
  return (0, _immutable.List)(url.match(/:[^\/]*/g));
}

function parameters_for(route, opts) {
  var url_params = parameter_list(route.get('path')).map(function (arg) {
    return arg.substring(1);
  }).map(function (name, id) {
    return (0, _immutable.Map)({
      name: opts.aws ? 'var_' + id : name,
      in: 'path',
      required: 'true',
      type: 'string',
      description: name.replace(/_/g, ' ')
    });
  });

  return url_params;
}