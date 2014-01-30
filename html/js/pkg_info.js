/*
 * Display an individual package page
 */

function parse_pkginfo(raw)
{
	raw['id'] = raw['name'] + '-' + raw['version'];
	return (raw);
}

var pkginfo_model = Backbone.Model.extend({
    parse: parse_pkginfo
});

var pkginfo_collection = Backbone.Collection.extend({
    model: pkginfo_model,

    initialize: function (models, options) {
	_.bindAll(this);
	this.options = options;
    },

    url: function () {
	return (pkg_prefix + 'api/set/' + this.options.pkgset + '/package/' +
	    this.options.pkgname + '/' + this.options.pkgvers);
    }
});

var pkginfo_entry_view = Backbone.View.extend({

    className: 'pkginfo_entry_view',

    initialize: function () {
	_.bindAll(this);
    },

    render: function () {

	var deps, modeldeps, depdiv, i;

	if (this.$el.is(':empty')) {
		var top, div;

		this.$el.append($('<div>', { class: 'name' }));
		top = $('<div>', { class: 'pkg_data' });
		this.$el.append(top);
		top.append($('<div>', { class: 'oneliner' }));
		top.append($('<hr>', { class: 'divider' }));

		div = $('<div>',  { class: 'vers_con' });
		div.append($('<span>', { class: 'vers_text' }));
		div.append($('<div>', { class: 'text' }));
		top.append(div);

		div = $('<div>',  { class: 'desc_con' });
		div.append($('<span>', { class: 'desc_text' }));
		div.append($('<div>', { class: 'text' }));
		top.append(div);

		div = $('<div>',  { class: 'dep_con' });
		div.append($('<span>', { class: 'dep_text' }));
		div.append($('<div>', { class: 'text' }));
		top.append(div);
	}


	this.$('.name').text(this.model.get('name'));
	this.$('.oneliner').text(this.model.get('one_liner'));
	this.$('.vers_text').text('version');
	this.$('.vers_con .text').text(this.model.get('version'));
	this.$('.desc_text').text('description');
	this.$('.desc_con .text').text(this.model.get('desc'));
	this.$('.dep_text').text('dependencies');

	modeldeps = this.model.get('deps');
	depdiv = $('<div>');
	if (modeldeps === undefined || modeldeps === null) {
		this.$('.dep_con .text').append($('<div>', { text: 'none',
		    class: 'depentry' }));
	} else {
		for (i = 0; i < modeldeps.length; i++) {
			this.$('.dep_con .text').append($('<div>',
			    { text: modeldeps[i]['pkg'], class: 'depentry' }));
		}
	}

	return (this.el);
    }
});

var pkginfo_view = Backbone.View.extend({
    initialize: function () {
	_.bindAll(this);
	this.listenTo(this.collection, 'reset', this.addAll);
    },

    className: 'pkginfo_view',

    addAll: function () {
	this.$('.pkginfo').empty();
	this.collection.each(this.addOne);
    },

    addOne: function (model) {
	this.$('.pkginfo').append(new
	    pkginfo_entry_view({ model: model }).render());
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

		if (this.collection.options.pkgcat !== null) {
			targ += '/category/' + this.collection.options.pkgcat;
			a = $('<a>', { text: this.collection.options.pkgcat,
			    href: targ });
			a.on('click', function (event) {
				event.preventDefault();
				router.navigate(targ, { trigger: true });
			});
			h1.append(a);

			h1.append($('<span>', { text: ' / ' }));

		}
		h1.append($('<span>',
		    { text: this.collection.options.pkgname }));

		this.$el.append(intro);
		this.$el.append($('<div>', { class: 'pkginfo' }));
	}

	return (this.el);
    }

});
