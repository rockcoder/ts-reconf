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

    return {
        compilerOptions: parsedTSConfig.options,
        rawConfig: configFile.config
    };
}
