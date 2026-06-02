import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadTsConfig } from '../loadTsConfig.js';
import { analyze } from '../analyzer.js';
import { toMarkdown, toPrettyOutput } from '../reporter.js';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';

describe('Integration Tests', () => {
  const testDir = join(process.cwd(), '.test-integration');

  beforeEach(() => {
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it('should complete full analysis pipeline', () => {
    const configPath = join(testDir, 'tsconfig.json');
    writeFileSync(configPath, JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        module: 'commonjs',
        strict: true,
        noImplicitAny: true,
        skipLibCheck: true,
      },
      include: ['src'],
    }));

    // Load config
    const config = loadTsConfig(configPath);
    expect(config).toBeDefined();

    // Analyze
    const findings = analyze(config);
    expect(Array.isArray(findings)).toBe(true);

    // Report - markdown
    const markdown = toMarkdown(findings, 'tsconfig.json');
    expect(markdown).toContain('tsconfig findings');

    // Report - pretty
    const pretty = toPrettyOutput(findings, 'tsconfig.json');
    expect(pretty).toContain('Analyzing');
  });

  it('should analyze realistic tsconfig with multiple issues', () => {
    const configPath = join(testDir, 'tsconfig.json');
    writeFileSync(configPath, JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        module: 'ES2020',
        moduleResolution: 'node',
        strict: true,
        noImplicitAny: true,
        noImplicitThis: true,
        strictNullChecks: true,
        skipLibCheck: true,
        esModuleInterop: true,
        declaration: true,
        declarationMap: true,
        sourceMap: true,
        outDir: 'dist',
      },
      include: ['src'],
      exclude: ['node_modules', 'dist'],
    }));

    const config = loadTsConfig(configPath);
    const findings = analyze(config);
    const report = toPrettyOutput(findings, 'tsconfig.json');

    // Should find redundant strict options
    const redundantFindings = findings.filter(f => f.category === 'redundant');
    expect(redundantFindings.length).toBeGreaterThan(0);

    // Report should be generated successfully
    expect(report).toContain('Done');
  });

  it('should handle clean config gracefully', () => {
    const configPath = join(testDir, 'tsconfig.json');
    writeFileSync(configPath, JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        module: 'commonjs',
      },
      include: ['src'],
    }));

    const config = loadTsConfig(configPath);
    const findings = analyze(config);

    // Even if there are no issues, the pipeline should work
    expect(Array.isArray(findings)).toBe(true);

    const report = toPrettyOutput(findings);
    expect(report).toBeDefined();
  });

  it('should preserve all information through pipeline', () => {
    const configPath = join(testDir, 'tsconfig.json');
    const testConfig = {
      compilerOptions: {
        strict: true,
        noImplicitAny: true,
        target: 'ES2020',
      },
      include: ['src', 'tests'],
      exclude: ['node_modules'],
      files: ['index.ts'],
    };

    writeFileSync(configPath, JSON.stringify(testConfig));

    const config = loadTsConfig(configPath);

    // Raw config should be preserved
    expect(config.rawConfig.include).toEqual(['src', 'tests']);
    expect(config.rawConfig.exclude).toEqual(['node_modules']);
    expect(config.rawConfig.files).toEqual(['index.ts']);

    // Compiler options should be set
    expect(config.compilerOptions.strict).toBe(true);

    // Analysis should work on preserved data
    const findings = analyze(config);
    expect(findings).toBeDefined();
  });
});
