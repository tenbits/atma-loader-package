
if (typeof include === 'undefined' ) 
	throw new Error('<atma-package-loader> should be loaded by the `atma` module.');


include.exports = {
	/* >>> Atma.Toolkit (registered via server)*/
	register: function(rootConfig){},
	
	/* >>> Atma.Server */
	attach: function(app){
		var rgx = '((\\.EXT$)|(\\.EXT\\?))'.replace(/EXT/g, _extension);
		app
			.handlers
			.registerHandler(rgx, HttpHandler);
		
	}
};


var _extension = 'package',
	_options = {}
	;
	
// ===== `io.File` extension
(function(File){
	if (File == null)
		return;
	
	File
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
			},
			
			mimeType: 'application/json'
		}));
	
}(global.io && global.io.File));

// ===== `IncludeJS` extension
(function(){
	var CfgLoader = {}
	
	CfgLoader[_extension] = {
		load: function(resource, callback){
			callback(resource, pckg_resolveSource(resource.url));
		},
		process: function(source){
			return source;
		}
	};
	
	include.cfg({
		loader: CfgLoader
	});
}());

// ===== `HttpHandler`
var HttpHandler = Class({
	Base: Class.Deferred,
	process: function(req, res, config){
		var url = net.Uri.combine(config.static || config.base, req.url),
			src = pckg_resolveSource(url)
			;
		
		return this
			.resolve(src, 200, 'application/javascript');
	}
});


// ----- Package
var pckg_resolveSource;
(function(){
	
	pckg_resolveSource = function(url){
		var _package = pckg_resolve(url);
		
		return "include.js("
			+ _package
			+ ").done(function(resp){ include.exports = resp; })"
	};
	
	//= private
	
	function pckg_resolve(url){
		var dir =  url.replace(/\.package(\?.+)?/, ''),
			pattern = dir.substring(dir.lastIndexOf('/') + 1)
			;
		
		if (pattern)  
			dir = dir.replace(pattern, '');
		
		return new io
			.Directory(dir)
			.readFiles(pattern || '**.js')
			.files
			.map(function(file){
				var path = file.uri.toRelativeString(dir),
					alias = path.replace(/\..+/, '').replace(/\/+/, '.');
					
				return '"'
					+ path
					+ '::'
					+ alias
					+ '"'
					;
			})
			.join(',');
	}
	
}());

