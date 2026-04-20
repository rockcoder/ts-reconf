import ts, { CompilerOptions } from "typescript";
import path from "path";

export function loadTsConfig(tsconfigPath: string): CompilerOptions {
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

    return parsedTSConfig.options;
}
