/*
 * A simple restify server to try and display information about pkgsrc
 * repositories and categories.
 *
 * We currently have the following high level basic routes.
 *
 * /set
 * /set/:set-name
 * /set/:set-name/package/:package
 * /set/:set-name/category
 * /set/:set-name/category/:category
 */

var mod_restify = require('restify');
var mod_fs = require('fs');
var mod_path = require('path');
var mod_printf = require('extsprintf');
var sprintf = mod_printf.sprintf;
var mod_getopt = require('posix-getopt');
var mod_bunyan = require('bunyan');
var pi_mkindex = require('./pkg_index.js').pi_mkindex;


var pkg_sets = {};		/* JSON data for all the packages */
var pkg_set_list = [];		/* List of top level elements in the array */
var pkg_server;			/* Restify server */
var pkg_ip = '0.0.0.0';
var pkg_port = '80';
var pkg_prefix = '';

function load_sets()
{
	var i, key, data, dirpath, files;

	dirpath = mod_path.join(__dirname, 'data');
	files = mod_fs.readdirSync(dirpath);
	files = files.filter(function (x) {
		if (mod_path.extname(x) === '.json')
			return (x);
	});

	for (i = 0; i < files.length; i++) {
		key = mod_path.basename(files[i], '.json');
		data = mod_fs.readFileSync(dirpath + '/' + files[i]).toString();
		try {
			pkg_sets[key] = JSON.parse(data);
		} catch (ex) {
			throw new Exception('invalid json in data file: ' +
			    files[i]);
		}
		pkg_set_list.push(key);
	}
}

function serve_index(req, res, next)
{
	res.setHeader('Content-Type', 'text/html');
	res.writeHead(200);
	res.end(pi_mkindex(pkg_prefix));

	return (next());
}

function serve_get_allsets(req, res, next)
{
	res.send(pkg_set_list);
	return (next());
}

function serve_get_set(req, res, next)
{
	var set = req.params['set'];

	if (!(set in pkg_sets))
		return (next(new mod_restify.ResourceNotFoundError(
		    sprintf('%s is not a valid package set', set))));
	res.send(pkg_sets[set]);
	return (next());
}

function serve_get_package(req, res, next)
{
	var set = req.params['set'];
	var pname = req.params['package'];

	if (!(set in pkg_sets))
		return (next(new mod_restify.ResourceNotFoundError(
		    sprintf('no such package set: %s', set))));

	if (!(pname in pkg_sets[set]['pkgs_by_name']))
		return (next(new mod_restify.ResourceNotFoundError(
		    sprintf('no such package in %s: %s', set, pname))));

	res.send(pkg_sets[set]['pkgs_by_name'][pname]);
	return (next());
}

function serve_get_package(req, res, next)
{
	var set = req.params['set'];
	var pname = req.params['package'];
	var i, pkgs;
	var results = [];

	if (!(set in pkg_sets))
		return (next(new mod_restify.ResourceNotFoundError(
		    sprintf('no such package set: %s', set))));

	if (!(pname in pkg_sets[set]['pkgs_by_name']))
		return (next(new mod_restify.ResourceNotFoundError(
		    sprintf('no such package in %s: %s', set, pname))));

	pkgs = pkg_sets[set]['pkgs_by_name'][pname];
	for (i = 0; i < pkgs.length; i++) {
		results.push({ 'name': pkgs[i]['name'],
		    'version': pkgs[i]['version'] });
	}

	res.send(results);
	return (next());
}

function serve_get_pkginfo(req, res, next)
{
	var i, pkgs, pkg;
	var set = req.params['set'];
	var pname = req.params['package'];
	var vers = req.params['version'];

	if (!(set in pkg_sets))
		return (next(new mod_restify.ResourceNotFoundError(
		    sprintf('no such package set: %s', set))));

	if (!(pname in pkg_sets[set]['pkgs_by_name']))
		return (next(new mod_restify.ResourceNotFoundError(
		    sprintf('no such package in %s: %s', set, pname))));

	pkgs = pkg_sets[set]['pkgs_by_name'][pname];
	pkg = null;
	for (i = 0; i < pkgs.length; i++) {
		if (vers === pkgs[i]['version']) {
			pkg = pkgs[i];
			break;
		}
	}
	if (pkg === null)
		return (next(new mod_restify.ResourceNotFoundError(
		    sprintf('no such version of package %s in %s: %s',
		    set, pname, vers))));

	res.send(pkg);
	return (next());
}

function serve_get_category(req, res, next)
{
	var set = req.params['set'];
	var cats = [];
	var key;

	if (!(set in pkg_sets))
		return (next(new mod_restify.ResourceNotFoundError(
		    sprintf('no such package set: %s', set))));

	for (key in pkg_sets[set]['pkgs_by_cat']) {
		cats.push(key);
	}

	res.send(cats);
	return (next());
}

function serve_get_catinfo(req, res, next)
{
	var set = req.params['set'];
	var cat = req.params['category'];
	var key;

	if (!(set in pkg_sets))
		return (next(new mod_restify.ResourceNotFoundError(
		    sprintf('no such package set: %s', set))));

	if (!(cat in pkg_sets[set]['pkgs_by_cat']))
		return (next(new mod_restify.ResourceNotFoundError(
		    sprintf('no such category in set %s: %s', set, cat))));

	res.send(pkg_sets[set]['pkgs_by_cat'][cat]);
	return (next());
}

function serve_get_set_search(req, res, next)
{
	var set = req.params['set'];
	var search = req.params['search'];
	var key, set, ret, pkg;

	if (!(set in pkg_sets))
		return (next(new mod_restify.ResourceNotFoundError(
		    sprintf('no such package set: %s', set))));

	if (search === null || search === undefined || search === '')
		return (next(new mod_restify.InvalidArgumentError(
		    sprintf('missing required search term'))));

	ret = [];
	search = search.toLowerCase();
	set = pkg_sets[set]['pkgs_by_name'];
	for (key in set) {
		if (key.toLowerCase().indexOf(search) === -1)
			continue;

		for (pkg in set[key]) {
			ret.push({ name: set[key][pkg]['name'],
			    version: set[key][pkg]['version'],
			    one_liner: set[key][pkg]['one_liner']
			});
		}
	}

	res.send(ret);
	return (next());
}

function main()
{
	var staticfunc;
	var parser, opt;

	parser = new mod_getopt.BasicParser('h:p:d:', process.argv);
	while ((opt = parser.getopt()) !== undefined) {
		switch (opt.option) {
		case 'd':
			pkg_prefix = opt.optarg;
			break;
		case 'h':
			pkg_ip = opt.optarg;
			break;
		case 'p':
			pkg_port = opt.optarg;
			break;
		}
	}

	load_sets();
	console.log(sprintf('loaded %d modules\n', pkg_set_list.length));
	pkg_server = mod_restify.createServer({
	    name: 'pkgsrc_browser'
	});

	/* API */
	pkg_server.get(pkg_prefix + '/api/set', serve_get_allsets);
	pkg_server.get(pkg_prefix + '/api/set/:set', serve_get_set);
	pkg_server.get(pkg_prefix + '/api/set/:set/search/:search',
	    serve_get_set_search);
	pkg_server.get(pkg_prefix + '/api/set/:set/package/:package',
	    serve_get_package);
	pkg_server.get(pkg_prefix + '/api/set/:set/package/:package/:version',
	    serve_get_pkginfo);
	pkg_server.get(pkg_prefix + '/api/set/:set/category',
	    serve_get_category);
	pkg_server.get(pkg_prefix + '/api/set/:set/category/:category',
	    serve_get_catinfo);

	/* HTML */
	staticfunc = mod_restify.serveStatic({
	    directory: mod_path.join(__dirname, 'html')
	});

	pkg_server.get(new RegExp('^' + pkg_prefix + '/set.*/'),
	    serve_index);
	pkg_server.get(new RegExp('^' + pkg_prefix + '/about.*'),
	    serve_index);
	if (pkg_prefix != '')
		pkg_server.get(new RegExp('^' + pkg_prefix + '/$'),
		    serve_index);
	else
		pkg_server.get('/', serve_index);
	pkg_server.get(pkg_prefix + '/index.htm', serve_index);
	pkg_server.get(pkg_prefix + '/index.html', serve_index);

	pkg_server.get(RegExp('^' + pkg_prefix + '/.+'), staticfunc);

	/*
	 * Enable logging.
	 */
	pkg_server.on('after', mod_restify.auditLogger({
		log: mod_bunyan.createLogger({
			name: 'audit',
			stream: process.stdout
		})
	}));

	pkg_server.listen(pkg_port, pkg_ip);
}

main();
