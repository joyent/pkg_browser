var mod_fs = require('fs');
var curobj = {};
var pkgs_by_cat = {};
var pkgs_by_name = {};
var first = true;

function flush()
{
	if (!('name' in curobj))
		return;
	pkgs_by_name[curobj['name']]
	if (!(curobj['name'] in pkgs_by_name))
		pkgs_by_name[curobj['name']] = [ curobj ];
	else
		pkgs_by_name[curobj['name']].push(curobj);

	curobj['cats'].map(function (cat) {
		if (!(cat in pkgs_by_cat))
			pkgs_by_cat[cat] = [];

		pkgs_by_cat[cat].push({ name: curobj['name'],
		    version: curobj['version'],
		    one_liner: curobj['one_liner'] });
	});

	curobj = {};
}

function fatal(msg)
{
	console.error(msg);
	process.exit(1);
}

function warn(msg)
{
	console.error(msg);
}

function parse_version(val)
{
	return ({ 'pkg': val.toString() });
}

function input(line)
{
	var eq, key, val;

	if (line === '') {
		flush();
		return;
	}

	eq = line.indexOf('=');
	if (eq == -1)
		fatal('line missing = delimiter: ' + line);

	key = line.substr(0, eq);
	val = line.substr(eq + 1, line.length);
	if (key === 'PKGNAME') {
		curobj['name'] = val.substring(0, val.lastIndexOf('-'));
		curobj['version'] = val.substring(val.lastIndexOf('-') + 1,
		    val.length);
	} else if (key === 'COMMENT') {
		curobj['one_liner'] = val;
	} else if (key === 'DESCRIPTION') {
		if (val == '')
			value = '\n';
		if ('desc' in curobj)
			curobj['desc'] += ' ' + val;
		else
			curobj['desc'] = val;
	} else if (key === 'CATEGORIES') {
		if (val === '')
			warn('malformed metadata, no category: ' +
			    JSON.stringify(curobj));
		curobj['cats'] = val.split(' ');
	} else if (key === 'DEPENDS') {
		if ('deps' in curobj)
			curobj['deps'].push(parse_version(val));
		else
			curobj['deps'] = [ parse_version(val) ];
	} else if (key === 'CONFLICTS') {
		if ('conflicts' in curobj)
			curobj['conflicts'].push(parse_version(val));
		else
			curobj['conflicts'] = [ parse_version(val) ];
	}
}

function finish()
{
	process.stdout.write(JSON.stringify({
	    'cats': Object.keys(pkgs_by_cat),
	    'pkgs_by_cat': pkgs_by_cat,
	    'pkgs_by_name': pkgs_by_name }));
}

function main()
{
	var data, i;
	if (process.argv.length !== 3) {
		console.error('mksummary: <file>');
		process.exit(1);
	}

	data = mod_fs.readFileSync(process.argv[2]).toString().split('\n');
	for (i = 0; i < data.length; i++) {
		input(data[i]);
	}
	finish();
}

main();
