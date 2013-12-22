#
# Build our css files
#

NODE = node
MKSUMMARY = $(NODE) mksummary.js

LESSC = node_modules/less/bin/lessc
LESSDIR = less
LESSOUTDIR = html/css
LESSOUT = $(LESSOUTDIR)/all.css
LESSSOURCE = $(LESSDIR)/all.less

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

DATA_FILES = $(DATA_SUMMARY:%.summary=$(DATA_DIR)/%.json)

%.summary:
	mkdir -p data
	curl $(SUMMARY_BASE_URL)/`basename $@ .summary | tr '-' '/'`/$(SUMMARY_TRAILER) \
	    | bunzip2 - > $@

all: $(LESSOUT) $(DATA_FILES)

$(LESSOUT): $(LESSSOURCE)
	$(LESSC) $(LESSSOURCE) $(LESSOUT)

%.json: %.summary
	$(MKSUMMARY) $< > $@

clobber:
	rm -rf $(LESSOUT) $(DATA_DIR)
