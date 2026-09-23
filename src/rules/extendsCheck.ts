import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.extends.check";

function readExtends(configPath: string): string | undefined {
    try {
        const config = JSON.parse(readFileSync(configPath, "utf8")) as { extends?: string };
        return config.extends;
    } catch {
        return undefined;
    }
}

function resolveExtends(value: string, from: string): string {
    const candidate = value.startsWith(".")
        ? path.resolve(path.dirname(from), value)
        : path.resolve(path.dirname(from), "node_modules", value);
    return path.extname(candidate) ? candidate : `${candidate}.json`;
}

export const extendsCheckRule: Rule = {
    id: ruleId,
    analyze(config: AnalysisContext): Finding[] {
        if (!config.configPath || typeof config.rawConfig.extends !== "string") return [];
        const findings: Finding[] = [];
        const seen = new Set<string>();
        let current = config.configPath;
        let value: string | undefined = config.rawConfig.extends;

        while (value) {
            const next = resolveExtends(value, current);
            if (seen.has(next) || next === config.configPath) {
                findings.push({
                    ruleId,
                    severity: "error",
                    category: "conflict",
                    message: `The "extends" chain contains a circular reference involving "${next}".`,
                });
                break;
            }
            if (!existsSync(next)) {
                findings.push({
                    ruleId,
                    severity: "error",
                    category: "conflict",
                    message: `The config extends "${value}", but "${next}" does not exist.`,
                });
                break;
            }
            seen.add(next);
            current = next;
            value = readExtends(next);
        }
        return findings;
    },
};
