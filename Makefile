#
# Build our css files
#

NODE = node
MKSUMMARY = $(NODE) mksummary.js
JSSTYLE = tools/jsstyle

LESSC = node_modules/less/bin/lessc
LESSDIR = less
LESSOUTDIR = html/css
LESSOUT = $(LESSOUTDIR)/all.css
LESSSOURCE = $(LESSDIR)/all.less

JS_NODE_FILES = \
	pkg_server.js \
	pkg_index.js
JS_NODE_CHECK = $(JS_NODE_FILES:%.js=%.js.chk)

JS_WEB_DIR = html/js
JS_WEB_FILES = \
	pkg_about.js \
	pkg_catlist.js \
	pkg_search.js \
	index.js \
	pkg_cat.js \
	pkg_info.js \
	pkg_set.js
JS_WEB_CHECK = $(JS_WEB_FILES:%.js=$(JS_WEB_DIR)/%.js.chk)

JS_CHECK_FILES += $(JS_NODE_CHECK) $(JS_WEB_CHECK)

SUMMARY_BASE_URL = http://pkgsrc.joyent.com/packages/SmartOS/
SUMMARY_TRAILER = "/All/pkg_summary.bz2"

DATA_DIR = data
DATA_SUMMARY = 2013Q2-i386.summary \
	2013Q2-multiarch.summary \
	2013Q2-sngl.summary \
	2013Q2-x86_64.summary \
	2013Q3-i386.summary \
	2013Q3-multiarch.summary \
	2013Q3-sngl.summary \
	2013Q3-x86_64.summary \
	2013Q4-i386.summary \
	2013Q4-x86_64.summary

DATA_FILES = $(DATA_SUMMARY:%.summary=$(DATA_DIR)/%.json)

%.summary:
	mkdir -p data
	curl $(SUMMARY_BASE_URL)/`basename $@ .summary | tr '-' '/'`/$(SUMMARY_TRAILER) \
	    | bunzip2 - > $@

all: $(LESSOUT) $(DATA_FILES)

$(LESSC):
	npm install

$(LESSOUT): $(LESSSOURCE) $(LESSC)
	$(LESSC) $(LESSSOURCE) $(LESSOUT)

%.json: %.summary
	$(MKSUMMARY) $< > $@

%.js.chk: %.js
	$(JSSTYLE) $<

clobber:
	rm -rf $(LESSOUT) $(DATA_DIR)

check: $(JS_CHECK_FILES)

install: all
	[[ -n "$(DESTDIR)" ]]
	mkdir -p $(DESTDIR)/out
	cp $(NODEFILES) $(DESTDIR)/out
	cp -r html data $(DESTDIR)/out
	mkdir -p $(DESTDIR)/out/smf
	sed 's|@@PREFIX@@|$(DESTDIR)/out|' < smf/pkg_server.xml.in > \
	    $(DESTDIR)/out/smf/pkg_server.xml
	cp -r node_modules $(DESTDIR)/out/
