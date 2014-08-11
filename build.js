
module.exports = {
	'settings': {
		io: {
			extensions: {
				js: ['condcomments:read', 'importer:read']
			}
		}
	},
	'process': {
		action: 'import',
		files: 'src/index.js',
		output: '/'
	},
	'uglify': {
		files: 'index.js',
		output: 'index.js',
		defines: {
			DEBUG: false
		}
	},
	
	'defaults': ['process'],

	
	'export': {
		action: 'copy',
		files: {
			'index.js':
				'test/node_modules/atma-loader-package/index.js'
		}
	},
	
	
};