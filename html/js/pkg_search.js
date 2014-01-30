/*
 * Search for a package. Note that this leverages the basic pkg_set data models
 * and collections for creating the search dialog box. It leverages the
 * pkgcatlist_entry_view for the search results page since we want the same
 * thing for now...
 */

var pkgsetdrop_entry_view = Backbone.View.extend({

    tagName: 'option',

    initialize: function () {
	_.bindAll(this);
    },

    render: function () {
	this.$el.text(this.model.get('quarter') + ' ' +
	    this.model.get('type'));
	this.$el.attr({ value: this.model.get('id') });

	return (this.el);
    }
});

var pkgsetdrop_view = Backbone.View.extend({
    initialize: function () {
	_.bindAll(this);
	this.listenTo(this.collection, 'reset', this.addAll);
    },

    className: 'pkgsetdrop_view',

    events: {
	'click .pkgsearch_go': 'doSearch',
	'keypress .pkgsearch_input': 'doKeypress'
    },

    addAll: function () {
	this.$('.pkgsearch_select').empty();
	this.collection.each(this.addOne);
    },

    addOne: function (model) {
	this.$('.pkgsearch_select').append(new
	    pkgsetdrop_entry_view({ model: model}).render());
    },

    render: function () {
	if (this.$el.is(':empty')) {
		this.$el.append($('<input>', { class: 'pkgsearch_input' }));
		this.$el.append($('<select>', { class: 'pkgsearch_select' }));
		this.$el.append($('<input>', { class: 'pkgsearch_go' }));
	}

	this.$('.pkgsearch_input').attr({ type: 'text',
	    placeholder: 'search packages' });
	this.$('.pkgsearch_select').attr({ name: 'search_pkgset' });
	this.$('.pkgsearch_go').attr({ type: 'button', value: 'search' });

	return (this.el);
    },

    doSearch: function (event) {
	var targ;

	event.preventDefault();
	/* Do nothing if the user hasn't entered a term */
	if (this.$('.pkgsearch_input').val() === '')
		return;
	targ = pkg_prefix + 'set/' + this.$('.pkgsearch_select').val() + '/search/' +
	    this.$('.pkgsearch_input').val();
	router.navigate(targ, { trigger: true });
    },

    doKeypress: function (event) {
	/* 0xd is the key code for enter */
	if (event.keyCode === 0xd)
		this.doSearch(event);
    }
});

function parse_pkgsearch(raw)
{
	raw['url'] = pkg_prefix + 'set/' + this.collection.options.pkgset +
	    '/package/' + raw['name'] +
	    '/' + raw['version'];
	raw['id'] = raw['name'] + '-' + raw['version'];
	return (raw);
}

var pkgsearch_model = Backbone.Model.extend({
    parse: parse_pkgsearch
});

var pkgsearch_collection = Backbone.Collection.extend({
    model: pkgsearch_model,

    initialize: function (models, options) {
	_.bindAll(this);
	this.options = options;
    },

    url: function() {
	return (pkg_prefix + 'api/set/' + this.options.pkgset + '/search/' +
	    this.options.pkgsearch);
    },

    /* XXX This is still wrong and probably the API shoud be smarter here */
    comparator: function (x, y) {
	    if (x.get('name').toLowerCase() > y.get('name').toLowerCase())
		    return (1);
	    if (y.get('name').toLowerCase() > x.get('name').toLowerCase())
		    return (-1);
	    return (0);
    }

});

var pkgsearch_view = Backbone.View.extend({
    initialize: function () {
	_.bindAll(this);
	this.listenTo(this.collection, 'reset', this.addAll);
    },

    className: 'pkgsearch_view',

    addAll: function () {
	this.$('.pkgsearch').empty();
	this.collection.each(this.addOne);
    },

    addOne: function (model) {
	this.$('.pkgsearch').append(new
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
			router.navigate('index.html', { trigger: true });
		});
		h1.append(a);
		h1.append($('<span>', { text: ' / ' }));
		h1.append($('<span>', { text: 'search: ' +
		    this.collection.options.pkgsearch }));
		this.$el.append(intro);

		this.$el.append($('<div>', { class: 'pkgsearch' }));
	}

	return (this.el);
    }
});
