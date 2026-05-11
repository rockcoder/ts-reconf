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

    // --version or -v
    if (process.argv.includes("--version") || process.argv.includes("-v")) {
        const pkg = await import("../package.json", {
            with: { type: "json" }
        });
        console.log(`ts-reconf version ${pkg.default.version}`);
        process.exit(0);
    }

    // --help or -h
    if (process.argv.includes("--help") || process.argv.includes("-h")) {
        console.log("Usage: ts-reconf analyze [tsconfig.json]");
        console.log("Options:");
        console.log("  --help, -h                   Show help");
        console.log("  --version, -v                Show version");
        console.log("  --output-markdown, -o-md     Specify output format (pretty (default) or markdown)");
        process.exit(0);
    }

    const config = loadTsConfig(file);

    const findings = analyze(config);

    // `--output-pretty` (default) or `--output-markdown`
    const compactOutput = process.argv.includes("--output-markdown") || process.argv.includes("-o-md");

    const report = compactOutput ? toMarkdown(findings, file) : toPrettyOutput(findings, file);

    console.log(report);

    if (findings.some(f => f.severity === "error")) {
        process.exit(1);
    }
} catch (err: unknown) {
    if (err instanceof Error) {
        console.error("Error:", err.message);
    } else {
        console.error("Error:", err);
    }
    process.exit(1);
}