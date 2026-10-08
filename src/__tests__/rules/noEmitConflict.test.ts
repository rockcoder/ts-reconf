import { describe, it, expect } from 'vitest';
import { noEmitConflictRule } from '../../rules/noEmitConflict.js';
import type { AnalysisContext } from '../../types.js';

describe('noEmitConflict', () => {
  it('should return no findings when noEmit is false', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        noEmit: false,
        outDir: 'dist',
        declaration: true,
      },
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    expect(findings).toHaveLength(0);
  });

  it('should return no findings when noEmit is not set', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        outDir: 'dist',
      },
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    expect(findings).toHaveLength(0);
  });

  it('does not report outDir as a conflict when noEmit is true', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        noEmit: true,
        outDir: 'dist',
      },
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    expect(findings).toHaveLength(0);
  });

  it('explains that outFile is unused when noEmit is true', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        noEmit: true,
        outFile: 'bundle.js',
      },
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    expect(findings).toHaveLength(1);
    expect(findings[0]?.severity).toBe('info');
    expect(findings[0]?.message).toContain('noEmit');
    expect(findings[0]?.message).toContain('outFile');
  });

  it('leaves declaration explanations to the declaration-specific rule', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        noEmit: true,
        declaration: true,
      },
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    expect(findings).toHaveLength(0);
  });

  it('explains that declarationDir is unused when noEmit is true', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        noEmit: true,
        declarationDir: 'types',
      },
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    expect(findings).toHaveLength(1);
    expect(findings[0]?.severity).toBe('info');
    expect(findings[0]?.message).toContain('noEmit');
    expect(findings[0]?.message).toContain('declarationDir');
  });

  it('explains unused output locations without calling them conflicts', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        noEmit: true,
        outDir: 'dist',
        declaration: true,
        declarationDir: 'types',
      },
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    expect(findings).toHaveLength(1);
    expect(findings.some(f => f.message.includes('outDir'))).toBe(false);
    expect(findings.some(f => f.message.includes('declaration'))).toBe(true);
    expect(findings.some(f => f.message.includes('declarationDir'))).toBe(true);
  });

  it('should have correct rule id', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        noEmit: true,
        outFile: 'bundle.js',
      },
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    expect(findings[0]?.ruleId).toBe('ts.noemit.conflict');
  });

  it('should include specific output paths in explanations', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        noEmit: true,
        outFile: 'custom/dist/bundle.js',
      },
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    expect(findings[0]?.message).toContain('custom/dist');
  });

  it('should handle empty compilerOptions gracefully', () => {
    const config: AnalysisContext = {
      compilerOptions: {},
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    expect(findings).toHaveLength(0);
  });

  it('does not duplicate the outDir explanation', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        noEmit: true,
        outDir: 'dist',
        outFile: 'bundle.js',
      },
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    expect(findings).toHaveLength(1);
  });
});
