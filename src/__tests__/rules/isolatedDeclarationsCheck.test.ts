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

  it('should explain the independent options when isolatedDeclarations is true but isolatedModules is false', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        isolatedDeclarations: true,
        isolatedModules: false,
      },
      rawConfig: {},
    };

    const findings = isolatedDeclarationsCheckRule.analyze(config);

    expect(findings).toHaveLength(1);
    expect(findings[0]?.severity).toBe('info');
    expect(findings[0]?.category).toBe('suggestion');
  });

  it('should explain the independent options when isolatedModules is not set', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        isolatedDeclarations: true,
      },
      rawConfig: {},
    };

    const findings = isolatedDeclarationsCheckRule.analyze(config);

    expect(findings).toHaveLength(1);
    expect(findings[0]?.severity).toBe('info');
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

  it('should explain the different purposes of the options', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        isolatedDeclarations: true,
      },
      rawConfig: {},
    };

    const findings = isolatedDeclarationsCheckRule.analyze(config);

    expect(findings[0]?.message).toContain('declarations');
    expect(findings[0]?.message).toContain('single-file transpilers');
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
