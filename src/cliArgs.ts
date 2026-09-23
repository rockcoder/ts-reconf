export interface CliArgs {
    file: string;
    help: boolean;
    version: boolean;
    outputMarkdown: boolean;
}

export function parseCliArgs(args: string[]): CliArgs {
    let file: string | undefined;
    let help = false;
    let version = false;
    let outputMarkdown = false;

    for (const arg of args) {
        if (arg === "--help" || arg === "-h") {
            help = true;
        } else if (arg === "--version" || arg === "-v") {
            version = true;
        } else if (arg === "--output-markdown" || arg === "-o-md") {
            outputMarkdown = true;
        } else if (arg === "analyze") {
            continue;
        } else if (arg.startsWith("-")) {
            throw new Error(`Unknown option: ${arg}`);
        } else if (file === undefined) {
            file = arg;
        } else {
            throw new Error(`Unexpected argument: ${arg}`);
        }
    }

    return {
        file: file ?? "tsconfig.json",
        help,
        version,
        outputMarkdown,
    };
}
