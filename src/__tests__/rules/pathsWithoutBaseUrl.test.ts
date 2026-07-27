import { describe, it, expect } from 'vitest';
import { pathsWithoutBaseUrlRule } from '../pathsWithoutBaseUrl.js';
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

  it('should return no findings when both paths and baseUrl are set', () => {
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

    expect(findings).toHaveLength(0);
  });

  it('should detect error when paths is set but baseUrl is not', () => {
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

    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('error');
    expect(findings[0].message).toContain('paths is configured but baseUrl is not set');
    expect(findings[0].message).toContain('@/*');
    expect(findings[0].message).toContain('@components/*');
    expect(findings[0].category).toBe('conflict');
  });

  it('should detect suggestion when baseUrl is set but paths is not', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        baseUrl: '.',
      },
      rawConfig: {},
    };

    const findings = pathsWithoutBaseUrlRule.analyze(config);

    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('info');
    expect(findings[0].message).toContain('baseUrl is set to "."');
    expect(findings[0].message).toContain('no paths are configured');
    expect(findings[0].category).toBe('suggestion');
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
    expect(findings[0].severity).toBe('info');
    expect(findings[0].message).toContain('baseUrl is set to "src"');
  });

  it('should have correct rule id', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        paths: {
          '@/*': ['src/*'],
        },
      },
      rawConfig: {},
    };

    const findings = pathsWithoutBaseUrlRule.analyze(config);

    expect(findings[0].ruleId).toBe('ts.paths-baseurl.conflict');
  });

  it('should handle undefined compilerOptions gracefully', () => {
    const config: AnalysisContext = {
      compilerOptions: undefined as any,
      rawConfig: {},
    };

    const findings = pathsWithoutBaseUrlRule.analyze(config);

    expect(findings).toHaveLength(0);
  });

  it('should list multiple path aliases in error message', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        paths: {
          '@/*': ['src/*'],
          '@components/*': ['src/components/*'],
          '@utils/*': ['src/utils/*'],
          '@types/*': ['src/types/*'],
        },
      },
      rawConfig: {},
    };

    const findings = pathsWithoutBaseUrlRule.analyze(config);

    expect(findings).toHaveLength(1);
    const message = findings[0].message;
    expect(message).toContain('@/*');
    expect(message).toContain('@components/*');
    expect(message).toContain('@utils/*');
    expect(message).toContain('@types/*');
  });

  it('should suggest adding baseUrl in error message', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        paths: {
          '@/*': ['src/*'],
        },
      },
      rawConfig: {},
    };

    const findings = pathsWithoutBaseUrlRule.analyze(config);

    expect(findings[0].message).toContain('"baseUrl": "."');
  });

  it('should only suggest removing baseUrl if paths is truly empty', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        baseUrl: '.',
        paths: {},
      },
      rawConfig: {},
    };

    const findings = pathsWithoutBaseUrlRule.analyze(config);

    expect(findings).toHaveLength(1);
    expect(findings[0].message).toContain('remove baseUrl to simplify');
  });

  it('should return error not suggestion when paths is set without baseUrl', () => {
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

    expect(findings).toHaveLength(0);
  });
});
