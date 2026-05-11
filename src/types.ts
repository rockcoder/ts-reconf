import type { CompilerOptions } from "typescript";

export type Severity = "info" | "warn" | "error";

export type Category =
    | "conflict"
    | "legacy"
    | "redundant"
    | "suggestion"
    | "explanation";

export interface Finding {
    ruleId: string;
    message: string;
    severity: Severity;
    category: Category;
}

export interface AnalysisContext {
    compilerOptions: CompilerOptions;
    rawConfig: {
        include?: string[];
        exclude?: string[];
        files?: string[];
        extends?: string;
    };
}

export interface Rule {
    id: string;
    analyze(config: AnalysisContext): Finding[];
}