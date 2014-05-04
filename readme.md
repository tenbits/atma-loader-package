Package Loader (Atma Plugin)
-----

[![Build Status](https://travis-ci.org/tenbits/atma-loader-package.png?branch=master)](https://travis-ci.org/tenbits/atma-loader-package)

The Plugin extends:
- [`IncludeJS`](https://github.com/atmajs/IncludeJS) with a custom loader for the `Node.js` version
- [`atma-io`](https://github.com/atmajs/atma-io) with a custom middleware
- [`atma-server`](https://github.com/atmajs/atma-server) and [`Atma Toolkit`](https://github.com/atmajs/Atma.Toolkit) with a `HTTPHandler` to serve compiled sources (with **sourceMap** support)


Load scripts from a directory as a package, assume this structure and the loading process:

```
lib
+-- Foo
|   |-- foo.js
|    
|-- A.js
|-- B.js
```

```javascript

// load all files
include
    .js('./lib/.package::Lib') 
    // similar to the glob version: `./lib/**.js.package`

    .done(function(resp){
        resp.Lib.A //> Exports Object from `lib/A.js' file
        resp.Lib.B //> Exports Object from `lib/B.js' file
        resp.Lib.Foo.foo //> Exports Object from `lib/Foo/foo.js' file
    });

// load only root files
include
    .js('./lib/*.js.package')
    .done(function(resp){
        resp.Lib.A //> Exports Object from `lib/A.js' file
        resp.Lib.B //> Exports Object from `lib/B.js' file
    })

```




##### How to use

###### Embed into the Project

- `npm install atma -g`
- `atma plugin install atma-loader-package`
- _That's all_

##### Quick Try

@see [Tests](https://github.com/tenbits/atma-loader-package/tree/master/test)


----
The MIT License