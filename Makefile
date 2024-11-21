.PHONY: run

run:
	node ./index.js

runless:
	node ./index.js --pretty | less -R
