const {assert} = require('chai');
require('mocha');

const TYPES = require('../types');

const fs = require('fs');

const flattenBlockchainObject = apps => {
	return Object.keys(apps).reduce((acc, blockchain) => {
		apps[blockchain].map(app => {
			const assigned = app.hasOwnProperty('blockchain') ? app : Object.assign(app, {blockchain});
			acc.push(assigned);
		});
		return acc;
	}, []);
}
const json = require('../apps.json');
const apps = flattenBlockchainObject(require('../apps.json'));


const getImage = app => {
	if(!app.hasimage) return null;
	return fs.readFileSync(`./logos/${app.applink}.svg`, "utf8").toLowerCase();

}

describe('Apps', () => {

	it('should have proper total json structure', () => {
		try {
			JSON.parse(JSON.stringify(json))
			return true;
		} catch(e){
			assert(false, e);
		}
	});

	it('should all have proper json structures', () => {
		const MANDATORY = ['applink', 'type', 'description', 'url'];
		apps.map(app => {
			MANDATORY.map(x => assert(typeof app[x] !== 'undefined', `${app.applink} is missing ${x}`));

			if(app.hasimage){
				try {
					getImage(app);
				} catch(e){
					assert(false, `${app.applink} says it has an image but no file was found`)
				}
			}
		})
	});

	it('should all have proper and safe svgs', () => {
		const BAD = ['<script', '/script', 'let ', 'var ', 'var=', 'let=', 'const ', 'const=', 'function', '=>', 'document.'];
		apps.map(app => {
			const svg = getImage(app);
			if(svg) BAD.map(x => {
				assert(svg.indexOf(x) === -1, `${app.applink}'s SVG is dangerous: ${x}`)
			});
		})
	});

	it('should all have proper types', () => {


		apps.map(app => {
			assert(TYPES.includes(app.type), `${app.applink}'s type is not allowed: ${app.type}`);
		})
	});



});