import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.outdir-rootdir.conflict";

/**
 * Checks for conflicts between outDir and rootDir:
 * - outDir should not be inside rootDir (creates circular paths)
 * - outDir and rootDir should not be the same
 * - Warns if outFile is used with conflicting outDir/rootDir
 */
export const outDirRootDirConflictRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const options = config.compilerOptions ?? {};
        const outDir = options.outDir;
        const rootDir = options.rootDir;
        const outFile = options.outFile;

        const findings: Finding[] = [];

        // If neither outDir nor rootDir is set, no conflict possible
        if (!outDir && !rootDir) {
            return findings;
        }

        // Check if outDir is inside rootDir
        if (outDir && rootDir) {
            const normalizedOutDir = outDir.replace(/\\/g, "/");
            const normalizedRootDir = rootDir.replace(/\\/g, "/");

            // Remove trailing slashes for comparison
            const outDirClean = normalizedOutDir.endsWith("/")
                ? normalizedOutDir.slice(0, -1)
                : normalizedOutDir;
            const rootDirClean = normalizedRootDir.endsWith("/")
                ? normalizedRootDir.slice(0, -1)
                : normalizedRootDir;

            // Check if outDir equals rootDir
            if (outDirClean === rootDirClean) {
                findings.push({
                    ruleId: ruleId,
                    severity: "error",
                    message: `outDir and rootDir are the same ("${outDir}"). This will cause source files to be overwritten. Set outDir outside of rootDir.`,
                    category: "conflict"
                });
                return findings;
            }

            // Check if outDir is inside rootDir (e.g., rootDir: "src", outDir: "src/dist")
            if (outDirClean.startsWith(rootDirClean + "/")) {
                findings.push({
                    ruleId: ruleId,
                    severity: "error",
                    message: `outDir ("${outDir}") is inside rootDir ("${rootDir}"). This creates a circular path and can cause source files to be overwritten or deleted. Move outDir outside rootDir, e.g., "outDir": "dist"`,
                    category: "conflict"
                });
                return findings;
            }
        }

        // Check if outFile conflicts with outDir
        if (outFile && outDir) {
            findings.push({
                ruleId: ruleId,
                severity: "warn",
                message: `Both outFile ("${outFile}") and outDir ("${outDir}") are set. Typically, use either outFile (for bundled output) OR outDir (for distributed files), not both.`,
                category: "conflict"
            });
        }

        return findings;
    }
};
