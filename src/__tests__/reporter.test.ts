import { describe, it, expect } from 'vitest';
import { toMarkdown, toPrettyOutput } from '../reporter.js';
import type { Finding } from '../types.js';

describe('Reporter', () => {
  const mockFindings: Finding[] = [
    {
      ruleId: 'test.redundant',
      message: 'noImplicitAny is redundant',
      severity: 'info',
      category: 'redundant',
    },
    {
      ruleId: 'test.explanation',
      message: 'skipLibCheck improves build speed',
      severity: 'info',
      category: 'explanation',
    },
    {
      ruleId: 'test.conflict',
      message: 'Module and moduleResolution conflict',
      severity: 'warn',
      category: 'conflict',
    },
  ];

  describe('toMarkdown', () => {
    it('should return success message for empty findings', () => {
      const output = toMarkdown([], 'tsconfig.json');

      expect(output).toContain('Looks good!');
      expect(output).toContain('No issues found');
    });

    it('should list findings in markdown format', () => {
      const output = toMarkdown(mockFindings, 'tsconfig.json');

      expect(output).toContain('tsconfig findings');
      expect(output).toContain('noImplicitAny is redundant');
      expect(output).toContain('skipLibCheck improves build speed');
      expect(output).toContain('Module and moduleResolution conflict');
    });

    it('should format findings as markdown list items', () => {
      const output = toMarkdown(mockFindings);

      expect(output).toMatch(/- .+/); // Should have list items
    });

    it('should handle undefined file parameter', () => {
      const output = toMarkdown(mockFindings);

      expect(output).toContain('tsconfig findings');
    });
  });

  describe('toPrettyOutput', () => {
    it('should return success message for empty findings', () => {
      const output = toPrettyOutput([], 'tsconfig.json');

      expect(output).toContain('Looks good!');
      expect(output).toContain('No issues found');
      //expect(output).toContain('Done');
    });

    it('should group findings by category', () => {
      const output = toPrettyOutput(mockFindings);

      expect(output).toContain('Conflict');
      expect(output).toContain('Redundant');
      expect(output).toContain('Explanation');
    });

    it('should display category counts', () => {
      const output = toPrettyOutput(mockFindings);

      expect(output).toMatch(/Redundant \(\d+\)/);
      expect(output).toMatch(/Explanation \(\d+\)/);
      expect(output).toMatch(/Conflict \(\d+\)/);
    });

    it('should format findings with bullet points', () => {
      const output = toPrettyOutput(mockFindings);

      expect(output).toContain('•');
    });

    it('should include file name in output', () => {
      const output = toPrettyOutput(mockFindings, 'my-tsconfig.json');

      expect(output).toContain('my-tsconfig.json');
    });

    it('should have visual separators', () => {
      const output = toPrettyOutput(mockFindings);

      expect(output).toContain('────────────');
    });
  });

  describe('Output consistency', () => {
    it('markdown output should be compact', () => {
      const markdown = toMarkdown(mockFindings);
      const pretty = toPrettyOutput(mockFindings);

      // Markdown should generally be shorter (no formatting)
      expect(markdown.length).toBeLessThanOrEqual(pretty.length);
    });

    it('both formats should include all findings', () => {
      const markdown = toMarkdown(mockFindings);
      const pretty = toPrettyOutput(mockFindings);

      mockFindings.forEach(finding => {
        expect(markdown).toContain(finding.message);
        expect(pretty).toContain(finding.message);
      });
    });
  });
});
