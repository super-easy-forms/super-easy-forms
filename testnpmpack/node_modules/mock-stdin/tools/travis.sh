#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

export COVERAGE=1

node_modules/.bin/jscoverage lib

# TODO: Only run tests once, and use a custom reporter which outputs both LCOV and text,
# for Travis.
node_modules/.bin/nodeunit test
STATUS=$?

node_modules/.bin/nodeunit --reporter=lcov test > .lcov

cat .lcov | node_modules/.bin/coveralls

exit $STATUS
