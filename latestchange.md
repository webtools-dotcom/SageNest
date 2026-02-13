# Latest Change Log

## 2026-02-13

- Added guidance for handling the Codex limitation: when a pull request has been modified outside Codex, create a brand-new PR from the latest branch head instead of trying to update the original PR.
- Confirmed this repository contains no unresolved git conflict markers.

### Vibe-coder friendly steps to create a new PR safely

1. Commit all current local changes.
2. Push your working branch to GitHub.
3. Open GitHub and click **Compare & pull request** for that branch.
4. Use a fresh PR title/description (do not reopen the old locked PR flow).
5. Verify the PR diff has no conflict symbols and `package.json` is valid JSON.
6. Merge only after Cloudflare build passes.

## 2026-02-14

- Verified codebase is clean of git conflict markers using the repository conflict check script.
- Added explicit GitHub conflict-resolution steps for PR UI so merge-marker text is not committed by mistake.

### How to resolve this in GitHub (simple steps)

1. Open the PR and click **Resolve conflicts**.
2. For each file, keep only final code (no conflict marker lines).
3. Click **Mark as resolved** for every conflicted file.
4. Click **Commit merge**.
5. Re-run Cloudflare deploy.
6. If deploy fails again, run `npm run check:conflicts` locally before pushing.
