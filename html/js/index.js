/*
 * Basic index support
 */

/*
 * Top level package set information
 */

var views = [];		/* current backbone views */
var pkg_router;		/* backbone router class */
var router;		/* backbone router instance */
var search;		/* search view */

function switchView()
{
	var i;

	$('.content').empty();
	for (i = 0; i < views.length; i++) {
		views[i].remove();
	}
	views = [];
}

function createTopLevel()
{
	var pkgc, list, info, div;

	switchView();

	pkgc = new pkgset_collection();
	list = new pkgset_view({
	    'collection': pkgc
	});

	div = $('<div>', { class: 'set_info' });
	$('.content').append(div);
	div.append(list.render());
	pkgc.fetch({ reset: true });

	info = new pkgabout_info_view();
	div.append(info.render());
	$('.content').append('<div>');
	views.push(list);
	views.push(info);
}

function createSetPage(set)
{
	var catc, list;

	switchView();
	catc = new pkgcat_collection([], { pkgset: set });;
	list = new pkgcat_view({
	    'collection': catc
	});

	$('.content').append(list.render());
	catc.fetch({ reset: true });
	views.push(list);
}

function createCatPage(set, category)
{
	var catlist, list;

	switchView();
	catlist = new pkgcatlist_collection([], { pkgset: set,
	    pkgcat: category });
	list = new pkgcatlist_view({
	    'collection': catlist
	});

	$('.content').append(list.render());
	catlist.fetch({ reset: true });
	views.push(list);
}

function createInfoPage(set, category, name, version)
{
	var info, list;

	switchView();
	info = new pkginfo_collection([], { pkgset: set,
	    pkgcat: category, pkgname: name, pkgvers: version });
	list = new pkginfo_view({
	    'collection': info
	});
	$('.content').append(list.render());
	info.fetch({ reset: true });
	views.push(list);
}

function createSearchPage(set, arg)
{
	var search_col, search;
	switchView();
	search_col = new pkgsearch_collection([],
	    { pkgset: set, pkgsearch: arg });
	search = new pkgsearch_view({
	    'collection': search_col 
	});
	$('.content').append(search.render());
	search_col.fetch({ reset: true });
	views.push(search);
}

function createGettingStartedPage()
{
	var about;

	switchView();
	about = new pkgabout_start_view();
	$('.content').append(about.render());
	views.push(about);
}

function createBuildingPage()
{
	var about;

	switchView();
	about = new pkgabout_build_view();
	$('.content').append(about.render());
	views.push(about);
}

function createAboutPage()
{
	var about;

	switchView();
	about = new pkgabout_about_view();
	$('.content').append(about.render());
	views.push(about);
}

function createPackagePage(set, name, version)
{
	var info, list;

	switchView();
	info = new pkginfo_collection([], { pkgset: set,
	    pkgcat: null, pkgname: name, pkgvers: version });
	list = new pkginfo_view({
	    'collection': info
	});
	$('.content').append(list.render());
	info.fetch({ reset: true });
	views.push(list);

}

/*
 * This always go better with a main().
 */
function main()
{
	var search_collection;

	pkg_router = Backbone.Router.extend({
	    routes: {
		'index.html': 'home',
		'about/start': 'start',
		'about/building': 'building',
		'about/about': 'about',
		'set/:set': 'set',
		'set/:set/package/:package/:version': 'pkg',
		'set/:set/category/:category': 'cat',
		'set/:set/category/:category/package/:package/:version': 'info',
		'set/:set/search/:arg': 'search'
	    },

	    home: createTopLevel,
	    set: createSetPage,
	    cat: createCatPage,
	    info: createInfoPage,
	    search: createSearchPage,
	    start: createGettingStartedPage,
	    building: createBuildingPage,
	    about: createAboutPage,
	    pkg: createPackagePage
	});

	search_collection = new pkgset_collection();
	search = new pkgsetdrop_view({
	    'collection': search_collection
	});

	$('.search').append(search.render());
	$('.search').append('<hr>');
	search_collection.fetch({ reset: true });

	router = new pkg_router();
	if (Backbone.history.start({ pushState: true, hashChange: false }) === false)
		router.navigate('index.html', { trigger: true });
}

main();
