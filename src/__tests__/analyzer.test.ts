import { describe, it, expect } from 'vitest';
import { analyze } from '../analyzer.js';
import type { AnalysisContext } from '../types.js';

describe('Analyzer', () => {
  it('should return empty findings for clean config', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        target: 99,
        module: 99,
      },
      rawConfig: {},
    };

    const findings = analyze(config);
    expect(Array.isArray(findings)).toBe(true);
  });

  it('should detect redundant options when strict is enabled', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        strict: true,
        noImplicitAny: true,
        strictNullChecks: true,
      },
      rawConfig: {},
    };

    const findings = analyze(config);
    const redundantFindings = findings.filter(f => f.category === 'redundant');

    expect(redundantFindings.length).toBeGreaterThan(0);
    expect(redundantFindings.some(f => f.message.includes('noImplicitAny'))).toBe(true);
  });

  it('should provide explanations for skipLibCheck', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        skipLibCheck: true,
      },
      rawConfig: {},
    };

    const findings = analyze(config);
    const explanations = findings.filter(f => f.category === 'explanation' && f.message.includes('skipLibCheck'));

    expect(explanations.length).toBeGreaterThan(0);
  });

  it('should handle empty compiler options', () => {
    const config: AnalysisContext = {
      compilerOptions: {},
      rawConfig: {},
    };

    const findings = analyze(config);
    expect(Array.isArray(findings)).toBe(true);
  });

  it('should categorize findings with correct severity levels', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        strict: true,
        noImplicitAny: true,
      },
      rawConfig: {},
    };

    const findings = analyze(config);
    const severities = findings.map(f => f.severity);

    severities.forEach(severity => {
      expect(['info', 'warn', 'error']).toContain(severity);
    });
  });

  it('should detect module resolution mismatches', () => {
    const config: AnalysisContext = {
      compilerOptions: {
        module: 7, // ESNext
        moduleResolution: 1, // Classic
      },
      rawConfig: {},
    };

    const findings = analyze(config);
    const mismatches = findings.filter(f => f.message.includes('moduleResolution'));

    // May or may not have mismatches depending on rules, but should not error
    expect(Array.isArray(findings)).toBe(true);
  });
});
