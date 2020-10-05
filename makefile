# To run this makefile, you must do the following.
#
# 1.)  Download http://closure-compiler.googlecode.com/files/compiler-latest.zip
#      and place compiler.jar within the tools directory.
#
# 2.)  Install closure-linter tool at by following
#      http://code.google.com/closure/utilities/docs/linter_howto.html
#
# 3.)  Download the JSDoc toolkit found at
#      http://code.google.com/p/jsdoc-toolkit and place the jsdoc-toolkit
#      directory within the tools directory.

# Create the list of files
files =   src/osmplayer.js\
          src/osmplayer.parser.default.js\
          src/osmplayer.parser.youtube.js\
          src/osmplayer.parser.rss.js\
          src/osmplayer.parser.asx.js\
          src/osmplayer.parser.xspf.js\
          src/osmplayer.playlist.js\
          src/osmplayer.pager.js\
          src/osmplayer.teaser.js

default_template =   templates/default/js/osmplayer.playLoader.default.js\
          templates/default/js/osmplayer.controller.default.js\
          templates/default/js/osmplayer.playlist.default.js\
          templates/default/js/osmplayer.teaser.default.js\
          templates/default/js/osmplayer.pager.default.js\
          templates/default/js/osmplayer.default.js

.DEFAULT_GOAL := all

all: makeminplayer jslint js jsdoc

makeminplayer:
	cd minplayer; make -B; cd ..;

# Perform a jsLint on all the files.
jslint: ${files}
	jshint $^

# Create an aggregated js file and a compressed js file.
js: ${files}
	@curl https://raw.github.com/cubiq/iscroll/v5.0.6/build/iscroll.js > bin/iscroll.js
	@echo "Creating osmplayer.playlist.js"
	@mv src/osmplayer.playlist.js src/osmplayer.playlist.tmp.js
	@echo "var osmplayer = osmplayer || {};" > src/osmplayer.playlist.js
	@echo "(function(exports) {" >> src/osmplayer.playlist.js
	@cat bin/iscroll.js >> src/osmplayer.playlist.js
	@echo "exports.IScroll = IScroll;" >> src/osmplayer.playlist.js
	@echo "})(osmplayer);" >> src/osmplayer.playlist.js
	@cat src/osmplayer.playlist.tmp.js >> src/osmplayer.playlist.js
	@rm src/osmplayer.playlist.tmp.js
	@rm bin/iscroll.js
	@echo "Generating aggregated bin/osmplayer.js file"
	@cat > bin/osmplayer.js minplayer/bin/minplayer.js $^
	@echo "Generating compressed bin/osmplayer.compressed file"
	curl -s \
	  -d compilation_level=SIMPLE_OPTIMIZATIONS \
	  -d output_format=text \
	  -d output_info=compiled_code \
	  --data-urlencode "js_code@bin/osmplayer.js" \
	  http://closure-compiler.appspot.com/compile \
	  > bin/osmplayer.compressed.js
	@cat > templates/default/osmplayer.default.tmp ${default_template}
	curl -s \
	  -d compilation_level=SIMPLE_OPTIMIZATIONS \
	  -d output_format=text \
	  -d output_info=compiled_code \
	  --data-urlencode "js_code@templates/default/osmplayer.default.tmp" \
	  http://closure-compiler.appspot.com/compile \
	  > templates/default/osmplayer.default.js
	@rm templates/default/osmplayer.default.tmp

# Create the documentation from source code.
jsdoc: ${files}
	@echo "Generating documetation."
	@java -jar tools/jsdoc-toolkit/jsrun.jar tools/jsdoc-toolkit/app/run.js -a -t=tools/jsdoc-toolkit/templates/jsdoc -d=doc $^

# Fix the js style on all the files.
fixjsstyle: ${files}
	fixjsstyle $^

# Install the necessary tools.
tools:
	wget http://jsdoc-toolkit.googlecode.com/files/jsdoc_toolkit-2.4.0.zip -P tools
	unzip tools/jsdoc_toolkit-2.4.0.zip -d tools
	mv tools/jsdoc_toolkit-2.4.0/jsdoc-toolkit tools/jsdoc-toolkit
	rm -rd tools/jsdoc_toolkit-2.4.0
	rm tools/jsdoc_toolkit-2.4.0.zip
	npm install jshint
