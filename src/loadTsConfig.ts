import ts from "typescript";
import path from "path";

import type { AnalysisContext } from "./types.js";

export function loadTsConfig(tsconfigPath: string): AnalysisContext {
    const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

    if (configFile.error) {
        throw new Error(
            ts.flattenDiagnosticMessageText(
                configFile.error.messageText,
                "\n"
            )
        );
    }

    const configDir = path.dirname(tsconfigPath);

    const parsedTSConfig = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        configDir
    );

    // Let the analyzer explain deprecated compiler options itself. TypeScript
    // reports these as config errors in newer releases, but aborting here would
    // prevent rules such as legacyOption and pathsWithoutBaseUrl from running.
    const diagnostics = parsedTSConfig.errors.filter(
        error => error.code !== 18003 && error.code !== 5101 && error.code !== 5107
    );

    if (diagnostics.length > 0) {
        const messages = diagnostics
            .map(error =>
                ts.flattenDiagnosticMessageText(error.messageText, "\n")
            )
            .join("\n");

        throw new Error(`Invalid tsconfig: ${messages}`);
    }

    return {
        compilerOptions: parsedTSConfig.options,
        rawConfig: configFile.config,
        configPath: path.resolve(tsconfigPath),
        fileNames: parsedTSConfig.fileNames,
    };
}
