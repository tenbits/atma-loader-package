(function(){
	
	var Plugin;
	(function(module){
		//import /node_modules/atma-loader/index.js
	}(Plugin = {}));
	
	var Loader;
	(function(module){
		// import loader.js
	}(Loader = {}));
	
	(function(){
		
		include.exports = Plugin.exports.create({
			name: 'atma-loader-package',
			options: {
				mimeType: 'text/javascript',
				extensions: [ 'package' ]
			},
		}, null, Loader.exports)
		
	}());
	
}());