import type { Finding } from "./types.js";

const NO_ISSUES_FOUND_MSG = "## Looks good! 🎉 No issues found ✔\n";

export function toMarkdown(findings: Finding[], file?: string): string {
    const lines = [`## tsconfig findings for ${file ?? ""}:\n`];

    if (findings.length === 0) {
        lines.push(NO_ISSUES_FOUND_MSG);
        return lines.join("\n");
    }

    for (const finding of findings) {
        lines.push(`- ${finding.message}`);
    }

    return lines.join("\n");
}

function groupByCategory(findings: Finding[]): Record<string, Finding[]> {
    const groups: Record<string, Finding[]> = {};

    for (const finding of findings.sort((a, b) => a.category.localeCompare(b.category))) {
        if (!groups[finding.category]) {
            groups[finding.category] = [];
        }
        groups[finding.category]?.push(finding);
    }

    return groups;
}

export function toPrettyOutput(findings: Finding[], file?: string): string {
    const lines: string[] = [];

    lines.push(`\n## ¸'ts-reconf' Analyzing ${file ?? "tsconfig.json"}...`);

    if (findings.length === 0) {
        lines.push(NO_ISSUES_FOUND_MSG);
        return lines.join("\n");
    }

    lines.push("Findings:\n");
    lines.push("────────────────────────────────\n");

    const groups = groupByCategory(findings);

    for (const [category, items] of Object.entries(groups)) {
        const title =
            category.charAt(0).toUpperCase() +
            category.slice(1);

        lines.push(`${title} (${items.length})`);

        for (const item of items) {
            lines.push(`  • ${item.message}`);
        }

        lines.push("");
    }

    lines.push("────────────────────────────────\n");
    lines.push("✔ Done\n");

    return lines.join("\n");
}