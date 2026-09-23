import { describe, expect, it } from "vitest";
import { parseCliArgs } from "../cliArgs.js";

describe("parseCliArgs", () => {
    it("accepts flags before and after the config path", () => {
        expect(parseCliArgs(["analyze", "--output-markdown", "custom.json"])).toEqual({
            file: "custom.json",
            help: false,
            version: false,
            outputMarkdown: true,
        });
        expect(parseCliArgs(["custom.json", "-o-md", "analyze"]).outputMarkdown).toBe(true);
    });

    it("supports the shorthand config path form", () => {
        expect(parseCliArgs(["custom.json"]).file).toBe("custom.json");
    });

    it("rejects unknown options and extra positional arguments", () => {
        expect(() => parseCliArgs(["--unknown"])).toThrow("Unknown option");
        expect(() => parseCliArgs(["one.json", "two.json"])).toThrow("Unexpected argument");
    });
});
