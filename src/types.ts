import type { CompilerOptions } from "typescript";

export type Severity = "info" | "warn" | "error";

export type Category =
    | "redundant"
    | "explanation"
    | "legacy"
    | "conflict";

export interface Finding {
    ruleId: string;
    message: string;
    severity: Severity;
    category: Category;
}

export interface Rule {
    id: string;
    analyze(config: CompilerOptions): Finding[];
}