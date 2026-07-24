import { describe, it, expect } from 'vitest';
import { noEmitConflictRule } from '../noEmitConflict.js';
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

  it('should detect conflict when noEmit is true and outDir is set', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        noEmit: true,
        outDir: 'dist',
      },
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('error');
    expect(findings[0].message).toContain('noEmit');
    expect(findings[0].message).toContain('outDir');
    expect(findings[0].message).toContain('contradictory');
    expect(findings[0].category).toBe('conflict');
  });

  it('should detect conflict when noEmit is true and outFile is set', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        noEmit: true,
        outFile: 'bundle.js',
      },
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('error');
    expect(findings[0].message).toContain('noEmit');
    expect(findings[0].message).toContain('outFile');
  });

  it('should detect conflict when noEmit is true and declaration is true', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        noEmit: true,
        declaration: true,
      },
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('error');
    expect(findings[0].message).toContain('noEmit');
    expect(findings[0].message).toContain('declaration');
  });

  it('should detect conflict when noEmit is true and declarationDir is set', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        noEmit: true,
        declarationDir: 'types',
      },
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('warn');
    expect(findings[0].message).toContain('noEmit');
    expect(findings[0].message).toContain('declarationDir');
  });

  it('should detect multiple conflicts when noEmit is true with multiple conflicting options', () => {
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

    expect(findings.length).toBeGreaterThan(1);
    expect(findings.some(f => f.message.includes('outDir'))).toBe(true);
    expect(findings.some(f => f.message.includes('declaration'))).toBe(true);
    expect(findings.some(f => f.message.includes('declarationDir'))).toBe(true);
  });

  it('should have correct rule id', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        noEmit: true,
        outDir: 'dist',
      },
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    expect(findings[0].ruleId).toBe('ts.noemit.conflict');
  });

  it('should include specific file paths in error messages', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        noEmit: true,
        outDir: 'custom/dist',
      },
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    expect(findings[0].message).toContain('custom/dist');
  });

  it('should handle empty compilerOptions gracefully', () => {
    const config: AnalysisContext = {
      compilerOptions: {},
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    expect(findings).toHaveLength(0);
  });

  it('should detect conflict when both outDir and outFile are set with noEmit', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        noEmit: true,
        outDir: 'dist',
        outFile: 'bundle.js',
      },
      rawConfig: {},
    };

    const findings = noEmitConflictRule.analyze(config);

    // Should have at least 2 findings (one for outDir, one for outFile)
    expect(findings.length).toBeGreaterThanOrEqual(2);
  });
});
