import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadTsConfig } from '../loadTsConfig.js';
import { writeFileSync, mkdtempSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('loadTsConfig', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = mkdtempSync(join(tmpdir(), 'ts-reconf-'));
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it('should load valid tsconfig.json', () => {
    const configPath = join(testDir, 'tsconfig.json');
    writeFileSync(configPath, JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        module: 'commonjs',
      },
      include: ['src'],
    }));

    const config = loadTsConfig(configPath);

    expect(config).toHaveProperty('compilerOptions');
    expect(config).toHaveProperty('rawConfig');
    expect(config.compilerOptions).toBeDefined();
  });

  it('should parse compiler options correctly', () => {
    const configPath = join(testDir, 'tsconfig.json');
    writeFileSync(configPath, JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        strict: true,
        declaration: true,
      },
    }));

    const config = loadTsConfig(configPath);

    expect(config.compilerOptions.strict).toBe(true);
    expect(config.compilerOptions.declaration).toBe(true);
  });

  it('should preserve raw config include/exclude/files', () => {
    const configPath = join(testDir, 'tsconfig.json');
    writeFileSync(configPath, JSON.stringify({
      compilerOptions: { target: 'ES2020' },
      include: ['src'],
      exclude: ['node_modules', 'dist'],
      files: ['index.ts'],
    }));

    const config = loadTsConfig(configPath);

    expect(config.rawConfig.include).toEqual(['src']);
    expect(config.rawConfig.exclude).toEqual(['node_modules', 'dist']);
    expect(config.rawConfig.files).toEqual(['index.ts']);
  });

  it('should throw error for invalid JSON', () => {
    const configPath = join(testDir, 'tsconfig.json');
    writeFileSync(configPath, '{invalid json}');

    expect(() => loadTsConfig(configPath)).toThrow();
  });

  it('should throw error for invalid compiler options', () => {
    const configPath = join(testDir, 'tsconfig.json');
    writeFileSync(configPath, JSON.stringify({
      compilerOptions: {
        target: 'not-a-target',
      },
    }));

    expect(() => loadTsConfig(configPath)).toThrow(/Invalid tsconfig/);
  });

  it('should throw error for missing file', () => {
    const configPath = join(testDir, 'nonexistent.json');

    expect(() => loadTsConfig(configPath)).toThrow();
  });

  it('should handle extends property in raw config', () => {
    const configPath = join(testDir, 'tsconfig.json');
    writeFileSync(join(testDir, 'tsconfig.base.json'), JSON.stringify({}));
    writeFileSync(configPath, JSON.stringify({
      extends: './tsconfig.base.json',
      compilerOptions: { strict: true },
    }));

    const config = loadTsConfig(configPath);

    expect(config.rawConfig.extends).toBe('./tsconfig.base.json');
  });

  it('should handle empty config file', () => {
    const configPath = join(testDir, 'tsconfig.json');
    writeFileSync(configPath, JSON.stringify({}));

    const config = loadTsConfig(configPath);

    expect(config.compilerOptions).toBeDefined();
    expect(config.rawConfig).toBeDefined();
  });
});
