# ts-reconf

`ts-reconf` is a tiny CLI that helps you tame your `tsconfig.json` without the usual TypeScript config chaos.

It scans your compiler options and calls out the stuff that is:
- redundant
- outdated
- risky
- confusing
- easier to simplify

In short: it helps you keep your config cleaner, clearer, and a little more intentional.

## Quick start

Install globally:

```bash
npm install -g ts-reconf
ts-reconf analyze [./tsconfig.json]
```

Or run it immediately:

```bash
npx ts-reconf analyze
```

From source:

```bash
npx tsx src/cli.ts analyze [./tsconfig.json]
```

Useful flags:

```bash
ts-reconf --help
ts-reconf --version
ts-reconf analyze --output-markdown
```

## Example

Input:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "skipLibCheck": true
  }
}
```

What it might tell you:

- `noImplicitAny` is redundant because `strict` already enables it
- `skipLibCheck` skips checking declaration files (`*.d.ts`) for speed, but it can hide type issues in dependencies

## Contributing

Rules are intentionally small and easy to add. If you’ve ever seen a `tsconfig` option that felt confusing, noisy, or suspiciously unnecessary, that’s the exact kind of thing this project is built for.
