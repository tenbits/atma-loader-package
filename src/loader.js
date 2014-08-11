module.exports	= {
	load: function(path, options){
		return pckg_resolveSource(path, options)
	}
};
	
// ----- Package
var pckg_resolveSource;
(function(){
	
	pckg_resolveSource = function(url, config){
		var _package = pckg_resolve(url, config);
		
		return "include.js("
			+ _package
			+ ").done(function(resp){ include.exports = resp; })"
	};
	
	//= private
	
	function pckg_resolve(url, config){
		var dir =  url.replace(/\.package(\?.+)?/, ''),
			pattern = dir.substring(dir.lastIndexOf('/') + 1)
			;
		
		if (pattern)  
			dir = dir.replace(pattern, '');
		
		if (dir[0] === '/') dir = dir.substring(1);
		if (dir.indexOf('.reference/') !== -1) {
			var match = /\.reference\/([^\\\/]+)/.exec(dir),
				project = match[1];
			
			project = config.projects && config.projects[project];
			if (project) {
				var path = project.path || project;
				dir = dir.substring(0, match.index)
					+ path
					+ dir.substring(match.index + match[0].length);
			}
		}
		
		return new io
			.Directory(dir)
			.readFiles(pattern || '**.js')
			.files
			.map(function(file){
				var path = file.uri.toString();
				path = path.substring(path.indexOf(dir) + dir.length);

				var alias = path.replace(/\..+/, '').replace(/\/+/, '.');
					
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
