/*
 * Generate index.html and inject the prefix into us.
 */

var pi_head = '<!DOCTYPE html>' +
'<html>' +
'	<meta charset="UTF-8" />' +
'	<head>';

var pi_headfini = '' +
'		<title>pkgsrc browser</title>' +
'	</head>' +
'	<body>' +
'		<div class="title">' +
'		</div>' +
'		<div class="container">' +
'			<div class="search"></div>' +
'			<div class="content"></div>' +
'		</div>';

var pi_jshead = '' +
'	<script src="/js/jquery-2.0.3.min.js" type="application/javascript">' +
'	</script>' +
'	<script src="/js/lodash.min.js" type="application/javascript">' +
'	</script>' +
'	<script src="/js/backbone-min.js" type="application/javascript">' +
'	</script>';

var pi_jstrailer = '' +
'	<script src="/js/pkg_set.js" type="application/javascript">' +
'	</script>' +
'	<script src="/js/pkg_cat.js" type="application/javascript">' +
'	</script>' +
'	<script src="/js/pkg_catlist.js" type="application/javascript">' +
'	</script>' +
'	<script src="/js/pkg_info.js" type="application/javascript">' +
'	</script>' +
'	<script src="/js/pkg_search.js" type="application/javascript">' +
'	</script>' +
'	<script src="/js/pkg_about.js" type="application/javascript">' +
'	</script>' +
'	<script src="/js/index.js" type="application/javascript">' +
'	</script>';

var pi_trailer = '' +
'	</body>' +
'</html>'

function pi_mkcss(prefix, loc)
{
	return ('<link href="' + prefix + loc +
	    '" rel="stylesheet" type="text/css">');
}

function pi_mkscript(prefix, loc)
{
	return ('<script src="' + prefix + loc +
	    '" type="application/javascript"></script>');
}

function pi_mkindex(prefix)
{
	var out;
	var script = '<script type="text/javascript">var pkg_prefix = \'' +
	    prefix + '/\';</script>';

	out = pi_head;
	out += pi_mkcss(prefix, '/css/all.css');
	out += pi_headfini;
	out += pi_mkscript(prefix, '/js/jquery-2.0.3.min.js');
	out += pi_mkscript(prefix, '/js/lodash.min.js');
	out += pi_mkscript(prefix, '/js/backbone-min.js');
	out += script;
	out += pi_mkscript(prefix, '/js/pkg_set.js');
	out += pi_mkscript(prefix, '/js/pkg_cat.js');
	out += pi_mkscript(prefix, '/js/pkg_catlist.js');
	out += pi_mkscript(prefix, '/js/pkg_info.js');
	out += pi_mkscript(prefix, '/js/pkg_search.js');
	out += pi_mkscript(prefix, '/js/pkg_about.js');
	out += pi_mkscript(prefix, '/js/index.js');

	out += pi_trailer;

	return (out);
}

exports.pi_mkindex = pi_mkindex;
