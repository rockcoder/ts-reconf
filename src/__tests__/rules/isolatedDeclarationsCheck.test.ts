import { describe, it, expect } from 'vitest';
import { isolatedDeclarationsCheckRule } from '../../rules/isolatedDeclarationsCheck.js';
import type { AnalysisContext } from '../../types.js';

describe('isolatedDeclarationsCheck', () => {
  it('should return no findings when neither isolatedDeclarations nor isolatedModules is set', () => {
    const config: AnalysisContext = {
      compilerOptions: {},
      rawConfig: {},
    };

    const findings = isolatedDeclarationsCheckRule.analyze(config);

    expect(findings).toHaveLength(0);
  });

  it('should return no findings when both isolatedDeclarations and isolatedModules are set', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        isolatedDeclarations: true,
        isolatedModules: true,
      },
      rawConfig: {},
    };

    const findings = isolatedDeclarationsCheckRule.analyze(config);

    expect(findings).toHaveLength(0);
  });

  it('should warn when isolatedDeclarations is true but isolatedModules is false', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        isolatedDeclarations: true,
        isolatedModules: false,
      },
      rawConfig: {},
    };

    const findings = isolatedDeclarationsCheckRule.analyze(config);

    expect(findings).toHaveLength(1);
    expect(findings[0]?.severity).toBe('warn');
    expect(findings[0]?.category).toBe('suggestion');
  });

  it('should warn when isolatedDeclarations is true but isolatedModules is not set', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        isolatedDeclarations: true,
      },
      rawConfig: {},
    };

    const findings = isolatedDeclarationsCheckRule.analyze(config);

    expect(findings).toHaveLength(1);
    expect(findings[0]?.severity).toBe('warn');
  });

  it('should mention both options in the warning message', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        isolatedDeclarations: true,
      },
      rawConfig: {},
    };

    const findings = isolatedDeclarationsCheckRule.analyze(config);

    expect(findings[0]?.message).toContain('isolatedDeclarations');
    expect(findings[0]?.message).toContain('isolatedModules');
  });

  it('should explain the complementary nature of the options', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        isolatedDeclarations: true,
      },
      rawConfig: {},
    };

    const findings = isolatedDeclarationsCheckRule.analyze(config);

    expect(findings[0]?.message).toContain('type safety');
    expect(findings[0]?.message).toContain('transpilation safety');
  });

  it('should have correct rule id', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        isolatedDeclarations: true,
      },
      rawConfig: {},
    };

    const findings = isolatedDeclarationsCheckRule.analyze(config);

    expect(findings[0]?.ruleId).toBe('ts.isolatedDeclarations.check');
  });

  it('should return no findings when isolatedModules is set but isolatedDeclarations is not', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        isolatedModules: true,
      },
      rawConfig: {},
    };

    const findings = isolatedDeclarationsCheckRule.analyze(config);

    expect(findings).toHaveLength(0);
  });

  it('should handle undefined compilerOptions gracefully', () => {
    const config: AnalysisContext = {
      compilerOptions: undefined as any,
      rawConfig: {},
    };

    const findings = isolatedDeclarationsCheckRule.analyze(config);

    expect(findings).toHaveLength(0);
  });

  it('should return no findings when isolatedDeclarations is false', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        isolatedDeclarations: false,
        isolatedModules: false,
      },
      rawConfig: {},
    };

    const findings = isolatedDeclarationsCheckRule.analyze(config);

    expect(findings).toHaveLength(0);
  });
});
