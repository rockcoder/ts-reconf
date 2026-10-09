import { describe, it, expect } from 'vitest';
import { pathsWithoutBaseUrlRule } from '../../rules/pathsWithoutBaseUrl.js';
import type { AnalysisContext } from '../../types.js';

describe('pathsWithoutBaseUrl', () => {
  it('should return no findings when neither paths nor baseUrl is set', () => {
    const config: AnalysisContext = {
      compilerOptions: {},
      rawConfig: {},
    };

    const findings = pathsWithoutBaseUrlRule.analyze(config);

    expect(findings).toHaveLength(0);
  });

  it('should report deprecated baseUrl even when paths are set', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        baseUrl: '.',
        paths: {
          '@/*': ['src/*'],
        },
      },
      rawConfig: {},
    };

    const findings = pathsWithoutBaseUrlRule.analyze(config);

    expect(findings).toHaveLength(1);
  });

  it('should allow paths without baseUrl', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        paths: {
          '@/*': ['src/*'],
          '@components/*': ['src/components/*'],
        },
      },
      rawConfig: {},
    };

    const findings = pathsWithoutBaseUrlRule.analyze(config);
    expect(findings).toHaveLength(0);
  });

  it('should detect deprecated baseUrl when paths is not set', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        baseUrl: '.',
      },
      rawConfig: {},
    };

    const findings = pathsWithoutBaseUrlRule.analyze(config);

    expect(findings).toHaveLength(1);
    expect(findings[0]?.severity).toBe('info');
    expect(findings[0]?.message).toContain('deprecated in TypeScript 6.0');
    expect(findings[0]?.category).toBe('suggestion');
  });

  it('should detect suggestion when baseUrl is set but paths is empty', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        baseUrl: 'src',
        paths: {},
      },
      rawConfig: {},
    };

    const findings = pathsWithoutBaseUrlRule.analyze(config);

    expect(findings).toHaveLength(1);
    expect(findings[0]?.severity).toBe('info');
    expect(findings[0]?.message).toContain('deprecated in TypeScript 6.0');
  });

  it('should have correct rule id for baseUrl findings', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        baseUrl: '.',
      },
      rawConfig: {},
    };

    const findings = pathsWithoutBaseUrlRule.analyze(config);

    expect(findings[0]?.ruleId).toBe('ts.paths-baseurl.conflict');
  });

  it('should handle undefined compilerOptions gracefully', () => {
    const config: AnalysisContext = {
      compilerOptions: undefined as any,
      rawConfig: {},
    };

    const findings = pathsWithoutBaseUrlRule.analyze(config);

    expect(findings).toHaveLength(0);
  });

  it('should explain migration even when paths is empty', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        baseUrl: '.',
        paths: {},
      },
      rawConfig: {},
    };

    const findings = pathsWithoutBaseUrlRule.analyze(config);

    expect(findings).toHaveLength(1);
    expect(findings[0]?.message).toContain('deprecated in TypeScript 6.0');
  });

  it('should report deprecated baseUrl even when paths are set', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        baseUrl: '.',
        paths: {
          '@/*': ['src/*'],
        },
      },
      rawConfig: {},
    };

    const findings = pathsWithoutBaseUrlRule.analyze(config);

    expect(findings).toHaveLength(1);
  });
});
