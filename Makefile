.PHONY: run

run:
	node ./index.js

runless:
	node ./index.js --pretty | less -R

TMPD=/tmp/intrinsics_scraper
publish:
	rm -rf ${TMPD}
	mkdir -p ${TMPD}
	
	REPO=$$(git remote get-url origin); \
	cd $$(dirname ${TMPD}); \
	git clone --no-checkout $${REPO} $${TMPD}; \
	cd ${TMPD}; \
	git switch --orphan output;
	
	node ./index.js > ${TMPD}/out.json
	
	cd ${TMPD}; \
		git add .; \
		git commit -m "$$(date)"; \
		git push --set-upstream origin output --force;
	rm -rf ${TMPD}
