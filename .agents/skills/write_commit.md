# Skill: write_commit

**Role:** Commit Historian
**Runs:** At the end of every implementation cycle, or whenever the user asks for a commit suggestion.
**Output file:** `production_artifacts/commit_suggestions.md`

## Objective

Write commit message suggestions for the work that was just implemented, following Conventional Commits 1.0.0.
You only SUGGEST. Never run `git add`, `git commit`, or any git command that changes the repository.

## Inputs

- The approved spec in `production_artifacts/`
- The files changed in this cycle
- The QA audit result

## Commit format

```
<type>[optional scope][!]: <description>

[optional body]

[optional footer]
```

## Rules

1. **Type** (required): choose the one that matches the real intent: `feat`, `fix`, `refactor`, `perf`, `style`, `test`, `docs`, `build`, `ci`, `chore`, `revert`.
2. **Scope** (optional): use only when it adds clarity (a module or feature area). Omit it when the change is broad or the scope is obvious.
3. **Description** (required): imperative mood, lowercase, no trailing period, max 72 characters. Say what changed.
4. **Body** (optional, off by default): add it ONLY when the description alone does not explain the change.
   - The body answers two questions and nothing else: **WHAT** changed and **WHY** it was needed.
   - NEVER explain HOW it was implemented (classes, methods, libraries, steps, algorithms). The code already shows that.
   - If the body would just repeat the description, omit it.
   - Blank line between description and body. Wrap lines at 72 characters.
5. **Footer** (optional): use only for `BREAKING CHANGE: <what breaks and why>` or issue references. For breaking changes, also add `!` after the type/scope.
6. **Atomic commits**: one logical change per commit. If the cycle produced unrelated changes, suggest several commits, in the order they should be made. Never bundle unrelated changes together.
7. Do not invent changes. Base every suggestion on the actual diff and the approved spec.

## Body examples

Good (what and why):

```
feat(tasks): group tasks by period of the day

Users could not see when each task fits in their day. Grouping by
morning, afternoon and night makes the daily plan easier to scan.
```

Bad (explains how):

```
feat(tasks): group tasks by period of the day

Created a TaskPeriodSection component that filters the list using
the start time and renders a FlatList for each period.
```

No body needed (the description is enough):

```
fix(auth): return 401 for expired tokens
```

## Writing to the output file

The file `production_artifacts/commit_suggestions.md` is a running history. It must NEVER be overwritten.

1. If the file does not exist, create it with only this header: `# Commit Suggestions`
2. If it exists, read it first, then ADD the new entry at the END of the file. Use an append/edit operation, never a full rewrite.
3. NEVER edit, reorder, reformat, or delete previous entries.
4. Each entry uses this structure:
