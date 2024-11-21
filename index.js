import { XMLParser } from "fast-xml-parser";
import * as node_util from "util";
import { isatty } from "node:tty";
import * as process from "node:process";
import json2ts from "json-to-ts";

async function main() {
	// CLI args
	const args = process.argv.slice(2);
	let pretty_print = null;
	let typescript_gen = false;

	for (const arg of args) {
		if (arg.startsWith("--pretty") || arg === "-p") {
			switch (arg) {
				case "-p":
				case "--pretty":
				case "--pretty=always":
					pretty_print = true;
					break;
				case "--pretty=never":
					pretty_print = false;
					break;
				case "--pretty=auto":
					pretty_print = null;
					break;
			}
		} else if (arg === "--typescript") {
			typescript_gen = true;
		}
		else console.warn(`unrecognized CLI argument "${arg}"`);
	}
	if (pretty_print === null) pretty_print = isatty(1);

	// fetch
	const response = await fetch(
		"https://www.intel.com/content/dam/develop/public/us/en/include/intrinsics-guide/data-3-6-9.xml",
		{ headers: { "user-agent": "is/1.0" } },
	);
	let data = await response.text();
	// parse
	data = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: "",
	}).parse(data);
	// trim
	data = data.intrinsics_list;
	data.intrinsics = data.intrinsic;
	delete data.intrinsic;

	// typescript gen
	if (typescript_gen) {
		data = json2ts(data, { rootName: "Intrinsics", useTypeAlias: true})
			.join("\n");
	}

	// print
	if (typescript_gen)
		console.log(data);
	else {
		if (pretty_print) {
			console.log(node_util.inspect(
				data,
				{
					colors: true,
					depth: null,
					showHidden: false,
					maxArrayLength: Infinity,
					maxStringLength: Infinity,
				},
			));
		} else
			console.log(JSON.stringify(data));
	}
}

main();
