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
		    href: './about/start' });
		a.on('click', function (event) {
			event.preventDefault();
			router.navigate(pkg_prefix + 'about/start',
			    { trigger: true });
		});
		div.append(a);
		this.$el.append(div);

		div = $('<div>', { class: 'build' });
		a = $('<a>', { class: 'build', text: 'creating new packages',
		    href: './about/building' });

		a.on('click', function (event) {
			event.preventDefault();
			router.navigate(pkg_prefix + 'about/building',
			    { trigger: true });
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
		    href: './about/about' });

		a.on('click', function (event) {
			event.preventDefault();
			router.navigate(pkg_prefix + 'about/about',
			    { trigger: true });
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

	a = $('<a>', { text: 'home', href: pkg_prefix + 'index.html'});
	a.on('click', function (event) {
		event.preventDefault();
		router.navigate(pkg_prefix + 'index.html', { trigger: true });
	});
	h2.append(a);
	h2.append($('<span>', { text: ' / ' }));

	h2.append($('<span>', { text: header }));

	return (h2);
}

/* JSSTYLED */
var aboutstart_text = '<p>pkgsrc is a general package management system that originated from NetBSD. pkgsrc is similar to other systems for binary packages like Debian and Red Hat\'s repositories.</p>';

/* JSSTYLED */
aboutstart_text += '<p>pkgsrc branches and freezes every quarter. We build these packages in four different flavors:</p>';

/* JSSTYLED */
aboutstart_text += '<ul><li>i386 - 32 bit packages</li><li>amd64 - 64 bit packages</li><li>multiarch - provides both 32 and 64 bit libraries and binaries</li><li>sngl - provides multiarch packages for the Joyent sngl images</li></ul>';

/* JSSTYLED */
aboutstart_text += '<p>Inside of a SmartOS image, the primary tool to manipulate packages is pkgin. To get a list of everything that you can do with pkgin you can just run \'pkgin\'.</p>';

/* JSSTYLED */
aboutstart_text += '<p>The following are the most common commands used with pkgin:</p>';

/* JSSTYLED */
aboutstart_text += '<p>In addition to pkgin, there are the pkgsrc packaging tools available. These include pkg_add, pkg_delete, pkg_create, and pkg_info. pkgin uses pkg_add, pkg_delete, and pkg_info under the hood. pkg_create can be used to create a local package.</p>';

/* JSSTYLED */
aboutstart_text += '<ul><li>pkgin update - update the local pkgin database</li><li>pkgin avail - list the available packages in the repository</li><li>pkgin install <package> - install a package</li><li>pkgin remove <package> - uninstall a package</li><li>pkgin upgrade - upgrades main packages to the latest version available on the repository</li></ul>';

aboutstart_text += '<p>Other common tasks:</p>';

/* JSSTYLED */
aboutstart_text += '<ul><li>pkg_info -L <package> - lists all the files in a package</li><li>pkgin provides <package> - lists shared libraries a package provides</li><li>pkgin search - Does a basic search of the package database</li></ul>';

var pkgabout_start_view = Backbone.View.extend({
    className: 'pkgabout_start',

    initialize: function () {
	_.bindAll(this);
    },

    render: function () {

	if (this.$el.is(':empty')) {
		this.$el.append(mkheader('getting started'));
		div = $('<div>');
		div.append(aboutstart_text);
		this.$el.append(div);
	}

	return (this.el);
    }
});

/* JSSTYLED */
var aboutbuild_text = '<p><a href="http://www.perkin.org.uk/">Jonathan Perkin<a/> has written a series of entries on his blog that discuss building packages. We have guides that cover two different aspects of working with packages. The first is creating your own local package of software that you\'ve built. The second covers how to set up an environment to work with pkgsrc, fix broken builds, and add new packages to it.';

/* JSSTYLED */
aboutbuild_text += '<p>If you have any questions or need additional help, you can come into#smartos on irc.freenode.net or you can e-mail the smartos-discuss mailing list. For more information on the mailing list, view the archives, and to subscribe: look <a href="http://smartos.org/smartos-mailing-list/">here</a>.</p>';

/* JSSTYLED */
aboutbuild_text += '<p>If you have your own software that already builds, the simplest thing you can do is create a local package. If you create a local package then you can distribute that however you\'d like and install the local package. Follow Jonathan\'s guide <a href="http://www.perkin.org.uk/posts/creating-local-smartos-packages.html">here</a>.</p>';

/* JSSTYLED */
aboutbuild_text += '<p>While creating local packages is expedient, fixing packages in the repository and adding new packages not only allows more people to use and benefit from the package, but also makes it easier to update the package in the future. This is broken into four topics:</p>';

/* JSSTYLED */
aboutbuild_text += '<ul><li><a href="http://www.perkin.org.uk/posts/pkgsrc-on-smartos-zone-creation-and-basic-builds.html">Creating a zone and doing a basic build</a></li><li><a href="http://www.perkin.org.uk/posts/pkgsrc-on-smartos-fixing-broken-builds.html">Fixing broken builds</a></li><li><a href="http://www.perkin.org.uk/posts/pkgsrc-on-smartos-creating-new-packages.html">Create a new package</a></li><li><a href="http://www.perkin.org.uk/posts/distributed-chrooted-pkgsrc-bulk-builds.html">Distributed chroot bulk builds</a></li></ul>';

var pkgabout_build_view = Backbone.View.extend({
    className: 'pkgabout_build',

    initialize: function () {
	_.bindAll(this);
    },

    render: function () {

	if (this.$el.is(':empty')) {
		var div;

		this.$el.append(mkheader('creating packages'));
		div = $('<div>');
		div.append(aboutbuild_text);
		this.$el.append(div);
	}

	return (this.el);
    }
});

/* JSSTYLED */
var aboutpage_text = '<p>This site is powered by pkg_browser and hosting provided by <a href="http://joyent.com">Joyent</a>. The source code is available on github at <a href="http://github.com/rmustacc/pkg_browser">http://github.com/rmustacc/pkg_browser</a>. If you encounter any issues or have any suggestions, please let us know on the github project\'s <a href="http://github.com/rmustacc/pkg_browser/issues">issue tracker</a>.</p><p>Thanks to <a href="http://aldaviva.com">Ben Hutchison</a> for providing the design, as well as, countless help and consultation in putting this together.</p>';

var pkgabout_about_view = Backbone.View.extend({
    className: 'pkgabout_about',

    initialize: function () {
	_.bindAll(this);
    },

    render: function () {

	if (this.$el.is(':empty')) {
		var div;

		this.$el.append(mkheader('about'));
		div = $('<div>');
		div.append(aboutpage_text);
		this.$el.append(div);
	}

	return (this.el);
    }
});
