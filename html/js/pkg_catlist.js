/*
 * Display a list of packages in a category
 */

function parse_pkgcatlist(raw)
{
	raw['url'] = window.location.pathname + '/package/' + raw['name'] +
	    '/' + raw['version'];
	raw['id'] = raw['name'] + '-' + raw['version'];
	return (raw);
}

var pkgcatlist_model = Backbone.Model.extend({
    parse: parse_pkgcatlist
});

var pkgcatlist_collection = Backbone.Collection.extend({
    model: pkgcatlist_model,

    initialize: function (models, options) {
	_.bindAll(this);
	this.options = options;
    },

    url: function () {
	return (pkg_prefix + 'api/set/' + this.options.pkgset + '/category/' +
	    this.options.pkgcat);
    },

    /* XXX This is probably not quite right */
    comparator: function (x, y) {
	    if (x.get('name').toLowerCase() > y.get('name').toLowerCase())
		    return (1);
	    if (y.get('name').toLowerCase() > x.get('name').toLowerCase())
		    return (-1);
	    return (0);
    }
});

/*
 * This is shared for the search results page, so check that your changes make
 * sense for that page.
 */
var pkgcatlist_entry_view = Backbone.View.extend({

    events: {
	'click a': 'goToChildPage'
    },

    className: 'pkgcatlist_entry_view',

    initialize: function () {
	_.bindAll(this);
    },

    render: function () {

	if (this.$el.is(':empty')) {
		var link = $('<a>');
		link.append($('<span>', { class: 'name' }));
		this.$el.append(link);
		this.$el.append($('<span>', { class: 'version' }));
		this.$el.append($('<div>', { class: 'desc' }));
	}

	this.$('.name').text(this.model.get('name'));
	this.$('a').attr({ href: this.model.get('url')});
	this.$('.version').text(this.model.get('version'));
	this.$('.desc').text(this.model.get('one_liner'));

	return (this.el);
    },

    goToChildPage: function (event) {
	event.preventDefault();
	router.navigate(this.model.get('url'), { trigger: true });
    }

});

var pkgcatlist_view = Backbone.View.extend({
    initialize: function () {
	_.bindAll(this);
	this.listenTo(this.collection, 'reset', this.addAll);
    },

    className: 'pkgcatlist_view',

    addAll: function () {
	this.$('.pkgcatlists').empty();
	this.collection.each(this.addOne);
    },

    addOne: function (model) {
	this.$('.pkgcatlists').append(new
	    pkgcatlist_entry_view({ model: model }).render());
    },

    render: function () {
	if (this.$el.is(':empty')) {
		var a, pkgname, targ;
		var intro = $('<div>', { class: 'intro' });
		var h1 = $('<h2>');
		intro.append(h1);

		a = $('<a>', { text: 'home', href: pkg_prefix + 'index.html'});
		a.on('click', function (event) {
			event.preventDefault();
			router.navigate(pkg_prefix + 'index.html',
			    { trigger: true });
		});
		h1.append(a);
		h1.append($('<span>', { text: ' / ' }));
		targ = pkg_prefix + 'set/' + this.collection.options.pkgset;
		pkgname = this.collection.options.pkgset.replace(/-/g, ' ');
		a = $('<a>', { text: pkgname, href: targ });
		a.on('click', function (event) {
			event.preventDefault();
			router.navigate(targ, { trigger: true });
		});
		h1.append(a);
		h1.append($('<span>', { text: ' / ' }));
		h1.append($('<span>', { text: this.collection.options.pkgcat,
		    class: 'pkgcat_name' }));

		this.$el.append(intro);
		this.$el.append($('<div>', { class: 'pkgcatlists' }));
	}

	return (this.el);
    }
});
