import { existsSync, statSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.projectReferences.output";

function resolveReferenceConfig(referencePath: string, configPath: string): string {
    const resolvedPath = path.resolve(path.dirname(configPath), referencePath);
    if (existsSync(resolvedPath) && statSync(resolvedPath).isDirectory()) {
        return path.join(resolvedPath, "tsconfig.json");
    }
    return resolvedPath;
}

export const projectReferencesOutputRule: Rule = {
    id: ruleId,
    analyze(config: AnalysisContext): Finding[] {
        const references = config.rawConfig.references;
        if (!config.configPath || !references?.length) return [];

        const findings: Finding[] = [];
        for (const reference of references) {
            const referenceConfigPath = resolveReferenceConfig(reference.path, config.configPath);
            if (!existsSync(referenceConfigPath)) continue;

            const configFile = ts.readConfigFile(referenceConfigPath, ts.sys.readFile);
            if (configFile.error) continue;
            const parsed = ts.parseJsonConfigFileContent(
                configFile.config,
                ts.sys,
                path.dirname(referenceConfigPath),
            );
            if (parsed.errors.some(error => error.code !== 18003)) continue;

            if (!parsed.options.composite) {
                findings.push({
                    ruleId,
                    severity: "warn",
                    category: "suggestion",
                    message: `Referenced project "${reference.path}" is not configured with "composite": true. Referenced projects must be composite.`,
                });
            }
            if (parsed.options.noEmit) {
                findings.push({
                    ruleId,
                    severity: "error",
                    category: "conflict",
                    message: `Referenced project "${reference.path}" sets "noEmit": true, so it cannot provide the build outputs required by project references.`,
                });
            }
        }
        return findings;
    },
};
