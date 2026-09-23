import path from "node:path";
import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.rootDir.include";

export const rootDirIncludeRule: Rule = {
    id: ruleId,
    analyze(config: AnalysisContext): Finding[] {
        if (!config.compilerOptions.rootDir || !config.configPath || !config.fileNames) return [];
        const rootDir = path.resolve(path.dirname(config.configPath), config.compilerOptions.rootDir);
        const outside = config.fileNames.filter(file => {
            const relative = path.relative(rootDir, path.resolve(file));
            return relative === ".." || relative.startsWith(`..${path.sep}`);
        });
        if (outside.length === 0) return [];
        return [{
            ruleId,
            severity: "error",
            category: "conflict",
            message: `${outside.length} input file(s) are outside rootDir "${config.compilerOptions.rootDir}". TypeScript will report TS6059; narrow include/files or move rootDir.`,
        }];
    },
};
