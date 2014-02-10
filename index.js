
if (typeof include === 'undefined' ) 
	throw new Error('<atma-package-loader> should be loaded by the `atma` module.');

var _extension = 'package',
	_options = {}
	;
	
// `io.File` extension
if (global.io && io.File) {
	io
		.File
		.getFactory()
		.registerHandler(/\.package$/i, Class({
			Construct: function(path){
				
				if (typeof path !== 'string') 
					path = path.toString();
					
				this.path = path;
			},
			exists: function(){
				return true;
			},
			read: function(){
				return pckg_resolveSource(this.path);
			},
			write: function(){
				throw new Error('Package write - Not Implemented');
			}
		}));
		
}

// `IncludeJS` extension
include.cfg({
	loader: obj_setProperty({}, _extension, {
		
		load: function(resource, callback){
			
			callback(resource, pckg_resolveSource(resource.url));
		},
		
		process: function(source){
			return source;
		}
	})
});

// Http
var HttpHandler = Class({
	Base: Class.Deferred,
	process: function(req, res, config){
		var url = net.Uri.combine(config.base, req.url),
			src = pckg_resolveSource(url)
			;
		
		return this
			.resolve(src, 200, 'application/javascript');
	}
});

include.exports = {
	register: function(rootConfig){
		
		rootConfig.$extend({
			
			server: {
				handlers: {
					'(.package$)': HttpHandler
				}
			}
		});
	}
};



function pckg_resolveSource(url){
	var _package = pckg_resolve(url);
	
	return "include.js("
		+ _package
		+ ").done(function(resp){ include.exports = resp; })"
}

function pckg_resolve(url){
	var dir =  url.replace('.package', ''),
		pattern = dir.substring(dir.lastIndexOf('/') + 1),
		cwd = io.env.currentDir.toDir()
		;
	
	if (pattern)  
		dir = dir.replace(pattern, '');
	
	return new io
		.Directory(dir)
		.readFiles(pattern || '**.js')
		.files
		.map(function(file){
			return '"' + file.uri.toRelativeString(dir) + '"';
		})
		.join(',');
}
	

function obj_setProperty(obj, prop, value){
	obj[prop] = value;
	return obj;
}

function obj_extend(target){
	var imax = arguments.length,
		i = 1,
		obj;
	for(; i < imax; i++){
		obj = arguments[0];
		
		for(var key in obj)
			target[key] = obj[key]
	}

	return target;
}