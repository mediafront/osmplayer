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
          src/osmplayer.scroll.js\
          src/osmplayer.pager.js\
          src/osmplayer.teaser.js

.DEFAULT_GOAL := all

all: jslint js jsdoc

# Perform a jsLint on all the files.
jslint: ${files}
	gjslint $^

# Create an aggregated js file and a compressed js file.
js: ${files}
	@echo "Generating aggregated bin/osmplayer.js file"
	@cat > bin/osmplayer.js $^
	@echo "Generating compressed bin/osmplayer.compressed file"
	@java -jar tools/compiler.jar --js bin/osmplayer.js --js_output_file bin/osmplayer.compressed.js

# Create the documentation from source code.
jsdoc: ${files}
	@echo "Generating documetation."
	@java -jar tools/jsdoc-toolkit/jsrun.jar tools/jsdoc-toolkit/app/run.js -a -t=tools/jsdoc-toolkit/templates/jsdoc -d=doc $^

# Fix the js style on all the files.
fixjsstyle: ${files}
	fixjsstyle $^

# Install the necessary tools.
tools:
	apt-get install python-setuptools
	apt-get install unzip
	wget http://closure-compiler.googlecode.com/files/compiler-latest.zip -P tools
	unzip tools/compiler-latest.zip -d tools
	rm tools/compiler-latest.zip tools/COPYING tools/README
	easy_install http://closure-linter.googlecode.com/files/closure_linter-latest.tar.gz
	wget http://jsdoc-toolkit.googlecode.com/files/jsdoc_toolkit-2.4.0.zip -P tools
	unzip tools/jsdoc_toolkit-2.4.0.zip -d tools
	mv tools/jsdoc_toolkit-2.4.0/jsdoc-toolkit tools/jsdoc-toolkit
	rm -rd tools/jsdoc_toolkit-2.4.0
	rm tools/jsdoc_toolkit-2.4.0.zip
