import { ModuleKind, ModuleResolutionKind, type CompilerOptions } from "typescript";
import type { Rule, Finding } from "../types.js";

const ruleId = "ts.module-resolution.mismatch";

export const moduleResolutionMismatchRule: Rule = {
    id: ruleId,

    analyze(config: CompilerOptions): Finding[] {
        const options = config ?? {};

        const module = options.module;
        const moduleResolution = options.moduleResolution;

        if (!module) return [];

        const findings: Finding[] = [];

        function expect(expected: string) {
            const moduleName = ModuleKind[module as ModuleKind];

            if (!moduleResolution) {
                findings.push({
                    ruleId: ruleId,
                    category: "suggestion",
                    severity: "info",
                    message: `module is "${moduleName}" but moduleResolution is not set. Consider setting "moduleResolution": "${expected}" this ensures TypeScript matches runtime module resolution.`
                });
                return;
            }

            if (module === 199 && moduleResolution !== 99 || module === 100 && moduleResolution !== 3) {
                findings.push({
                    ruleId: ruleId,
                    category: "conflict",
                    severity: "warn",
                    message: `module is "${moduleName}" but moduleResolution is "${ModuleResolutionKind[moduleResolution]}". Expected moduleResolution: "${expected}". This mismatch may cause incorrect module resolution. Consider aligning them.`
                });
            }
        }

        if (module === ModuleKind.NodeNext) {
            expect("NodeNext");
        }

        if (module === ModuleKind.Node16) {
            expect("Node16");
        }

        if (module === ModuleKind.ESNext) {
            // softer suggestion
            if (!moduleResolution) {
                findings.push({
                    ruleId: ruleId,
                    category: "suggestion",
                    severity: "info",
                    message: `module is "ESNext" but moduleResolution is not set. Consider "moduleResolution": "bundler" for modern setups, especially when using tools like Vite, Webpack, or Bun.`
                });
            }
        }

        return findings;
    }
};