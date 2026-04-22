# ts-reconf

> Helps you better understand and simplify your `tsconfig.json` and tries to make it a bit less confusing

`ts-reconf` analyzes your TypeScript configuration and helps you:
- detect redundant, deprecated and default compiler options that could be removed
- understand what some setting actually does
- reduce complexity and confusion
- build a cleaner, more intentional config

---

## Why?

Most `tsconfig.json` files are:
- copied from somewhere
- accumulated over years
- full of redundant or outdated options

Developers often:
- don’t know what half the options do
- are afraid to remove anything
- end up with overly complex configs

**ts-reconf exists to fix that.**

---

## Installation & usage

```bash
npm install -g ts-reconf
ts-reconf analyze [./tsconfig.json]
```

## Run without installation

You can run `ts-reconf` instantly without installing it globally:

```bash
npx ts-reconf analyze
```

## Run from the source

Clone the repository and run the CLI locally:

```bash
npx tsx src/cli.ts analyze [./tsconfig.json]
```

---

## Example

### Input

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "skipLibCheck": true,
  }
}
```

### Output tsconfig findings:

#### Redundant
- `noImplicitAny` is redundant because `strict` already enables it

#### Explanation
- `skipLibCheck` skips type checking of declaration files (*.d.ts)
  → improves build speed but may hide type issues


---

## Contributing

Rules are small and easy to write. If you’ve ever thought:
“this tsconfig option is confusing or unnecessary”
— why not turn that into a rule .
