/*
 * Various views that give information
 */

var pkgabout_info_view = Backbone.View.extend({

    className: 'pkgabout_info',

    initialize: function () {
	_.bindAll(this);
    },

    render: function () {
    
	if (this.$el.is(':empty')) {
		var cmd, a, div;

		div = $('<div>', { class: 'start' });
		a = $('<a>', { text: 'getting started',
		    href: '/about/start' });
		a.on('click', function (event) {
			event.preventDefault();
			router.navigate('/about/start', { trigger: true });
		});
		div.append(a);
		this.$el.append(div);

		div = $('<div>', { class: 'build' });
		a = $('<a>', { class: 'build', text: 'creating new packages',
		    href: '/about/building' });

		a.on('click', function (event) {
			event.preventDefault();
			router.navigate('/about/building', { trigger: true });
		});
		div.append(a);
		this.$el.append(div);

		cmd = $('<div>', { class: 'cmd' });
		cmd.append($('<pre>', { class: 'shell',
		    text: '$ pkgin avail' }));
		cmd.append($('<span>', { class: 'explanation',
		    text: 'view available packages' }));
		this.$el.append(cmd);

		cmd = $('<div>', { class: 'cmd' });
		cmd.append($('<pre>', { class: 'shell',
		    text: '$ pkgin list' }));
		cmd.append($('<span>', { class: 'explanation',
		    text: 'view installed packages' }));
		this.$el.append(cmd);

		cmd = $('<div>', { class: 'cmd' });
		cmd.append($('<pre>', { class: 'shell',
		    text: '$ pkgin install' }));
		cmd.append($('<span>', { class: 'explanation',
		    text: 'install a package' }));
		this.$el.append(cmd);

		div = $('<div>', { class: 'about' });
		a = $('<a>', { class: 'about', text: 'about',
		    href: '/about/about' });

		a.on('click', function (event) {
			event.preventDefault();
			router.navigate('/about/about', { trigger: true });
		});
		div.append(a);
		this.$el.append(div);

	}

	return (this.el);
    }
});

function mkheader(header)
{
	var a;
	var h2 = $('<h2>');

	a = $('<a>', { text: 'home', href: 'index.html'});
	a.on('click', function (event) {
		event.preventDefault();
		router.navigate('index.html', { trigger: true });
	});
	h2.append(a);
	h2.append($('<span>', { text: ' / ' }));

	h2.append($('<span>', { text: header }));

	return (h2);
}

var pkgabout_start_view = Backbone.View.extend({
    className: 'pkgabout_start',

    initialize: function () {
	_.bindAll(this);
    },

    render: function () {

	if (this.$el.is(':empty')) {
		this.$el.append(mkheader('getting started'));
	}

	return (this.el);
    }
});

var pkgabout_build_view = Backbone.View.extend({
    className: 'pkgabout_build',

    initialize: function () {
	_.bindAll(this);
    },

    render: function () {

	if (this.$el.is(':empty')) {
		this.$el.append(mkheader('creating packages'));
	}

	return (this.el);
    }
});
