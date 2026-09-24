import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { ModuleKind } from "typescript";
import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.module.package-type";

function findPackage(configPath: string): { type?: string } | undefined {
    let directory = path.dirname(configPath);
    while (true) {
        const packagePath = path.join(directory, "package.json");
        if (existsSync(packagePath)) {
            try {
                return JSON.parse(readFileSync(packagePath, "utf8")) as { type?: string };
            } catch {
                return undefined;
            }
        }
        const parent = path.dirname(directory);
        if (parent === directory) return undefined;
        directory = parent;
    }
}

export const modulePackageTypeRule: Rule = {
    id: ruleId,
    analyze(config: AnalysisContext): Finding[] {
        if (!config.configPath) return [];
        const packageJson = findPackage(config.configPath);
        const module = config.compilerOptions.module;
        if (!packageJson || module === undefined) return [];
        const moduleName = ModuleKind[module];
        if (module === ModuleKind.CommonJS && packageJson.type === "module") {
            return [{
                ruleId,
                severity: "warn",
                category: "conflict",
                message: `"module": "CommonJS" conflicts with the nearest package.json containing "type": "module". Align the TypeScript module setting and package type.`,
            }];
        }
        if ((module === ModuleKind.Node16 || module === ModuleKind.NodeNext) &&
            packageJson.type !== "module" && packageJson.type !== "commonjs") {
            return [{
                ruleId,
                severity: "info",
                category: "suggestion",
                message: `"module": "${moduleName}" uses package.json module type rules, but the nearest package.json has no explicit "type". Set "type": "module" or "commonjs" intentionally.`,
            }];
        }
        return [];
    },
};
