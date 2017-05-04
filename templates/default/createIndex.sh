#!/bin/bash
progdir=`dirname $0`
cd "$progdir"
rm -f test.html
php index.php >> test.html