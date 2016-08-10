installation
============

```
npm install routest-to-swagger --save-dev
```

usage
=====

command line
------------

```
$ routest-to-swagger --aws --glob 'spec/routes/*.js' --output build/swagger.json
```

in package.json file
--------------------

```json
"scripts": {
  "build:swagger": "routest-to-swagger --aws --glob 'spec/routes/*.js' --output build/swagger.json"
}
```

the --aws flag
--------------

the `--aws` flag is optional. AWS has some ridiculous restrictions on how variables can be 
named within a path. If you are using this to upload a swagger file to AWS, add this flag.


development notes
=================

the build is included in the repo because I cannot figure out how to make `postinstall` work with babel. 
As such, this project must be built before the version updates will be meaningful. Below are the scripts 
that can be used to build the project

tldr
----

```
npm run build:clean
```

building
--------

build the whole project

```
npm run build
```

remove the project's previous build and then build the whole project

```
npm run build:clean
```

remove the project's previous build 

```
npm run clean
```

build the lib directory

```
npm run build:lib
```

remove the build's previous lib directory and then re-build the lib

```
npm run build:lib:clean
```

remove the build's previous lib directory

```
npm run clean
```

build the bin directory

```
npm run build:bin
```

remove the build's previous bin directory and then re-build the bin

```
npm run build:bin:clean
```

remove the build's previous bin directory

```
npm run clean
```
