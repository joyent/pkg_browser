# pkg_browser

```txt
       _             _
 _ __ | | ____ _    | |__  _ __ _____      _____  ___ _ __
| '_ \| |/ / _` |   | '_ \| '__/ _ \ \ /\ / / __|/ _ \ '__|
| |_) |   < (_| |   | |_) | | | (_) \ V  V /\__ \  __/ |
| .__/|_|\_\__, |___|_.__/|_|  \___/ \_/\_/ |___/\___|_|
|_|        |___/_____|
```

pkg_browser is a simple web application designed for browsing pkgsrc
packages. By default the server listens on the ip 0.0.0.0 and port 80.
You can override this by running pkg_server.js with -h host and -p port.
pkg_browser assumes that it's running at the root of a site. If it's
not, you should specify that with the -d flag, eg. -d '/foo', indicates
that the root of pkg_browser would be at
<http://example.com/foo/index.html>. Note that due to an inadequacy in the
software, the files normally under `html/*` must be in `html/$PREFIX/*`.

If you'd like to help with development, please see the github issues for
a list of what needs to be done, there's plenty to do and help is
greatly appreciated.

To create something usable run:

`dmake` or `make` or `gmake`
`DESTDIR=/some/path make install`

An smf template is provided in DESTDIR/out/smf.

The design was done by Ben Hutchison <ben@aldaviva.com>.

All non-third party code in this repository is provided under the MIT
License, see the LICNSE file for more information.
