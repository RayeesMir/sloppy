import fs from 'fs'
import path from 'path'

function readFile(_path) {
	return fs.readFileSync(path.join(__dirname, _path), {
		encoding: 'utf8'
	})
}

module.exports = {
	_id: '_design/dns',
	language: 'javascript',
	views: {
		'hostname': {
			map:readFile('/by-hostname.js')
		},
	},
}