#!/usr/bin/env node

import { loadTsConfig } from "./loadTsConfig.js";
import { analyze } from "./analyzer.js";
import { toMarkdown, toPrettyOutput } from "./reporter.js";

const [, , command, fileArg] = process.argv;

if (command !== "analyze" && fileArg) {
    console.log("Usage: ts-reconf analyze [tsconfig.json]");
    process.exit(1);
}

const file = fileArg ?? (command?.endsWith(".json") ? command : undefined) ?? "tsconfig.json";

try {
    const config = loadTsConfig(file);

    const findings = analyze(config);

    const compactOuput = false;

    const report = compactOuput ? toMarkdown(findings, file) : toPrettyOutput(findings, file);

    console.log(report);

} catch (err: unknown) {
    if (err instanceof Error) {
        console.error("Error:", err.message);
    } else {
        console.error("Error:", err);
    }
    process.exit(1);
}