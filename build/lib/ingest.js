'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ingest;

var _immutable = require('immutable');

var _creation = require('./creation');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var glob = require("glob");

function ingest(package_info, path_glob) {
  var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var swagger_info = (0, _creation.swaggerize_package_info)(package_info);
  var swagger_file_promise = gather_paths(path_glob).then(function (result) {
    return result.reduce(function (paths, batch) {
      return _creation.add_path.apply(undefined, [paths, opts].concat(_toConsumableArray(batch)));
    }, (0, _immutable.Map)());
  }).then(function (paths) {
    return (0, _creation.assemble_swagger_file)(swagger_info, paths);
  });

  return swagger_file_promise;
}

function gather_paths(dir_glob) {
  return new Promise(function (resolve, reject) {
    glob(dir_glob, function (er, files) {
      var routes = (0, _immutable.List)(files).reduce(function (routes_pile, file) {
        return routes_pile.push(retrieve_paths_from(file));
      }, (0, _immutable.List)());

      resolve(routes);
    });
  });
}

function retrieve_paths_from(file) {
  var routes = void 0;
  try {
    routes = require(file);
  } catch (e) {
    routes = { __methods: {} };
  }

  return (0, _immutable.Map)(routes.__methods).map(function (method) {
    return (0, _immutable.Map)(method);
  }).reduce(function (list, method, name) {
    return list.push(method.set('name', name));
  }, (0, _immutable.List)());
}