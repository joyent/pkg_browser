/*
 * Display the list of package source packages that we support
 */

function parse_pkgset(raw)
{
	var split = raw.indexOf('-');

	return ({ 'quarter': raw.substring(0, split),
	    'type': raw.substring(split+1, split.length),
	    'id': raw,
	    'url': '/set/' + raw });
}

var pkgset_model = Backbone.Model.extend({
    parse: parse_pkgset
});

var pkgset_collection = Backbone.Collection.extend({
    model: pkgset_model,
    comparator: 'quarter',
    url: '/api/set'
});


var pkgset_entry_view = Backbone.View.extend({

    events: {
	'click a': 'goToChildPage'
    },

    initialize: function () {
	_.bindAll(this);
    },

    render: function () {

	if (this.$el.is(':empty')) {
		var link = $('<a>');
		link.append($('<span>', { class: 'quarter' }));
		link.append($('<span>', { class: 'type' }));
		this.$el.append(link);
	}

	this.$('.quarter').text(this.model.get('quarter'));
	this.$('.type').text(this.model.get('type'));
	this.$('a').attr({ href: this.model.get('url')});

	return (this.el);
    },

    goToChildPage: function (event) {
	event.preventDefault();
	router.navigate(this.model.get('url'), { trigger: true });
    }
    
});

var pkgset_view = Backbone.View.extend({

    initialize: function () {
	_.bindAll(this);
	this.listenTo(this.collection, 'reset', this.addAll);
    },

    className: 'pkgset_view',

    addAll: function () {
	this.$('.pkgsets').empty();
	this.collection.each(this.addOne);
    },

    addOne: function (model) {
	this.$('.pkgsets').append(new pkgset_entry_view({ model: model}).render());
    },

    render: function () {
	if (this.$el.is(':empty')) {
		var intro = $('<div>', { class: 'intro' });
		intro.append($('<h2>', { text: 'browse packages' }));
		this.$el.append(intro);
		this.$el.append($('<div>', { class: 'pkgsets' }));
	}

	return (this.el);
    }
});
