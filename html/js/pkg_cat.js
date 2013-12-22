/*
 * Display the categories of a given package set.
 */

function parse_pkgcat(raw)
{
	return ({ 'cat': raw,
	    'id': raw,
	    'url': window.location.pathname + '/category/' + raw });
}

var pkgcat_model = Backbone.Model.extend({
    parse: parse_pkgcat
});

var pkgcat_collection = Backbone.Collection.extend({
    model: pkgcat_model,

    initialize: function (models, options) {
	_.bindAll(this);
	this.options = options;
    },

    url: function() {
	return ('/api/set/' + this.options.pkgset + '/category');
    },

    comparator: 'cat'
});

var pkgcat_entry_view = Backbone.View.extend({

    events: {
	'click a': 'goToChildPage'
    },

    initialize: function () {
	_.bindAll(this);
    },

    render: function () {

	if (this.$el.is(':empty')) {
		var link = $('<a>');
		link.append($('<span>', { class: 'category' }));
		this.$el.append(link);
	}

	this.$('.category').text(this.model.get('cat'));
	this.$('a').attr({ href: this.model.get('url')});

	return (this.el);
    },

    goToChildPage: function (event) {
	event.preventDefault();
	router.navigate(this.model.get('url'), { trigger: true });
    }
 
});

var pkgcat_view = Backbone.View.extend({
    initialize: function () {
	_.bindAll(this);
	this.listenTo(this.collection, 'reset', this.addAll);
    },

    className: 'pkgcat_view',

    addAll: function () {
	this.$('.pkgcats').empty();
	this.collection.each(this.addOne);
    },

    addOne: function (model) {
	this.$('.pkgcats').append(new pkgcat_entry_view({ model: model}).render());
    },

    render: function () {
	if (this.$el.is(':empty')) {
		var a;
		var intro = $('<div>', { class: 'intro' });
		var pkgname = this.collection.options.pkgset.replace(/-/g, ' ');
		var h1 = $('<h2>');
		intro.append(h1);

		a = $('<a>', { text: 'home', href: 'index.html'});
		a.on('click', function (event) {
			event.preventDefault();
			router.navigate('index.html', { trigger: true });
		});
		h1.append(a);
		h1.append($('<span>', { text: ' / ' }));
		h1.append($('<span>', { text: pkgname, class: 'pkgcat_name' }));
		this.$el.append(intro);
		this.$el.append($('<div>', { class: 'pkgcats' }));
	}

	return (this.el);
    }
});
