import { describe, it, expect } from 'vitest';
import type { Finding, Rule, AnalysisContext, Severity, Category } from '../types.js';

describe('Type Definitions', () => {
  it('should create valid Finding objects', () => {
    const finding: Finding = {
      ruleId: 'test.rule',
      message: 'Test message',
      severity: 'info',
      category: 'redundant',
    };

    expect(finding.ruleId).toBe('test.rule');
    expect(finding.message).toBe('Test message');
    expect(['info', 'warn', 'error']).toContain(finding.severity);
  });

  it('should accept all valid severity levels', () => {
    const severities: Severity[] = ['info', 'warn', 'error'];

    severities.forEach(severity => {
      const finding: Finding = {
        ruleId: 'test',
        message: 'test',
        severity,
        category: 'redundant',
      };
      expect(finding.severity).toBe(severity);
    });
  });

  it('should accept all valid categories', () => {
    const categories: Category[] = [
      'conflict',
      'legacy',
      'redundant',
      'suggestion',
      'explanation',
    ];

    categories.forEach(category => {
      const finding: Finding = {
        ruleId: 'test',
        message: 'test',
        severity: 'info',
        category,
      };
      expect(finding.category).toBe(category);
    });
  });

  it('should create valid AnalysisContext objects', () => {
    const context: AnalysisContext = {
      compilerOptions: {
        strict: true,
        target: 99,
      },
      rawConfig: {
        include: ['src'],
        exclude: ['node_modules'],
      },
    };

    expect(context.compilerOptions).toBeDefined();
    expect(context.rawConfig).toBeDefined();
  });

  it('should enforce Rule interface contract', () => {
    const rule: Rule = {
      id: 'test.rule',
      analyze: (config: AnalysisContext) => {
        return [];
      },
    };

    expect(rule.id).toBe('test.rule');
    expect(typeof rule.analyze).toBe('function');

    const findings = rule.analyze({
      compilerOptions: {},
      rawConfig: {},
    });

    expect(Array.isArray(findings)).toBe(true);
  });
});
