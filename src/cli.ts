#!/usr/bin/env node

import { loadTsConfig } from "./loadTsConfig.js";
import { analyze } from "./analyzer.js";
import { toMarkdown, toPrettyOutput } from "./reporter.js";
import { parseCliArgs } from "./cliArgs.js";

try {
    const args = parseCliArgs(process.argv.slice(2));

    // --version or -v
    if (args.version) {
        const pkg = await import("../package.json", {
            with: { type: "json" }
        });
        console.log(`ts-reconf version ${pkg.default.version}`);
        process.exit(0);
    }

    // --help or -h
    if (args.help) {
        console.log("Usage: ts-reconf analyze [tsconfig.json]");
        console.log("Options:");
        console.log("  --help, -h                   Show help");
        console.log("  --version, -v                Show version");
        console.log("  --output-markdown, -o-md     Specify output format (pretty (default) or markdown)");
        process.exit(0);
    }

    const config = loadTsConfig(args.file);

    const findings = analyze(config);

    // `--output-pretty` (default) or `--output-markdown`
    const compactOutput = args.outputMarkdown;

    const report = compactOutput ? toMarkdown(findings, args.file) : toPrettyOutput(findings, args.file);

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