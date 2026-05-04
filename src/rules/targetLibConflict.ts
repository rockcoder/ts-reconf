import type { Rule, Finding, AnalysisContext } from "../types.js";
import { ScriptTarget } from "typescript";

const ruleId = "ts.target-lib.conflict";

const TARGET_ORDER: Record<string, number> = {
    "es3": 0,
    "es5": 1,
    "es6": 2,
    "es2015": 2,
    "es2016": 3,
    "es2017": 4,
    "es2018": 5,
    "es2019": 6,
    "es2020": 7,
    "es2021": 8,
    "es2022": 9,
    "es2023": 10,
    "es2024": 11,
    "esnext": 99,
    "latest": 99,
};

function normalize(value: string): string {
    return value.toLowerCase();
}

function getTargetIndex(target?: string): number {
    if (!target) {
        return -1;
    }

    return TARGET_ORDER[normalize(target)] ?? -1;
}

function extractLibVersions(libs: string[]): string[] {
    if (!Array.isArray(libs) || libs.length === 0) {
        return [];
    }

    return libs
        .map(lib => lib.toLowerCase())
        .filter(lib => lib.startsWith("es"));
}

function getHighestLib(libVersions: string[]): string | null {
    let maxIndex = -1;
    let highest: string | null = null;

    for (const lib of libVersions) {
        const index = TARGET_ORDER[lib] ?? -1;
        if (index > maxIndex) {
            maxIndex = index;
            highest = lib;
        }
    }

    return highest;
}

export const targetLibConflictRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const options = config.compilerOptions ?? {};

        const target = options.target;
        const libs = options.lib;

        if (!target || !libs) {
            return [];
        }

        const targetOrder = getTargetIndex(ScriptTarget[target]);

        const libVersions = extractLibVersions(libs);

        const highestLib = getHighestLib(libVersions);

        if (!highestLib) {
            return [];
        }

        const libIndex = getTargetIndex(highestLib);

        if (targetOrder === -1 || libIndex === -1) return [];

        if (libIndex > targetOrder) {
            return [
                {
                    ruleId: ruleId,
                    severity: "warn",
                    message: `target (${target}) is lower than lib (${highestLib})` + " this may cause runtime inconsistencies" + " consider aligning target and lib", // consider setting target to es2020 or lowering lib
                    category: "conflict"
                }
            ];
        }

        return [];
    }
};