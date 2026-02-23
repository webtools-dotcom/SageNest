# SECURITY — Agentic Audit & Remediation Guide

> **For AI coding agents (Claude Code, Cursor, Copilot, etc.):**
> This file defines how to conduct and act on a security audit of this codebase.
> When triggered to run a security audit, **scan the entire codebase, identify every violation below, and fix each one directly** — do not just report. Apply fixes with the least invasive correct solution. Leave comments only when a fix requires human decisions (e.g. rotating a live secret, choosing an auth provider).

---

## Audit Trigger

When a human says any of the following, treat it as a full security audit command:
- "run a security audit"
- "fix security issues"
- "security check"
- "harden the codebase"

On trigger: scan every file, match against all categories below, fix what can be fixed automatically, and summarize what was changed and what requires human action.

---

## 1. Secrets & Credentials

**Detect and fix:**
- Hardcoded API keys, tokens, passwords, private keys, or secrets anywhere in source code, config files, or scripts
- Secrets committed in any non-ignored file (even in comments or test files)
- `.env` files that are not listed in `.gitignore`
- Secret values that appear in logs, error messages, or server responses

**How to fix:**
- Replace hardcoded secrets with environment variable references (e.g. `process.env.SECRET_KEY`, `os.environ.get("SECRET_KEY")`)
- Add a `.env.example` with placeholder values if one doesn't exist
- Ensure `.env`, `.env.local`, `.env.*.local` and similar are in `.gitignore`
- If a secret is found in git history, flag it for rotation — do not try to rewrite git history automatically
- Never log secrets; strip them from any debug output you encounter

---

## 2. Input Validation & Injection

**Detect and fix:**
- Any user-controlled input passed directly to: SQL queries, shell commands, file paths, HTML output, eval(), template engines, XML/LDAP parsers, or redirects
- String concatenation used to build queries or commands
- Missing or insufficient validation on form inputs, URL params, headers, and API payloads
- Unescaped output rendered in HTML (XSS)

**How to fix:**
- SQL: Replace string-concatenated queries with parameterized queries or an ORM's safe query methods
- Shell: Replace `exec(userInput)` patterns with allowlisted command execution or eliminate shell calls entirely
- HTML output: Ensure all rendered user content is escaped; use framework-native escaping (e.g. JSX auto-escaping, Jinja2 `{{ }}`, Django templates)
- Add input schema validation at API and form entry points (e.g. Zod, Joi, Pydantic, class-validator)
- Sanitize file path inputs; resolve to an absolute path and verify it stays within the intended base directory (path traversal prevention)

---

## 3. Authentication & Authorization

**Detect and fix:**
- Routes or endpoints that perform privileged actions without verifying the caller's identity
- Missing authorization checks — where authentication passes but role/ownership is never verified
- Insecure session handling: non-HttpOnly cookies, missing Secure flag, missing SameSite attribute, long-lived sessions with no expiry
- Passwords stored in plaintext or with weak hashing (MD5, SHA-1, unsalted)
- JWT tokens accepted without signature verification, or with `alg: none` accepted
- Auth tokens stored in `localStorage` (accessible to XSS); prefer `HttpOnly` cookies

**How to fix:**
- Add authentication middleware/guards to all protected routes
- Add ownership checks (e.g. `resource.userId === currentUser.id`) before returning or mutating data
- Set cookie flags: `HttpOnly`, `Secure`, `SameSite=Strict` or `SameSite=Lax`
- Replace plaintext/weak password storage with bcrypt, scrypt, or Argon2 with appropriate cost factors
- Enforce JWT signature verification; reject tokens with unexpected algorithms
- Move auth tokens from localStorage to HttpOnly cookies

---

## 4. Security Headers & Transport

**Detect and fix:**
- Missing HTTP security headers on server responses
- HTTP endpoints that should be HTTPS
- CORS configured with wildcard (`*`) origins on authenticated endpoints
- Cookies set without `Secure` flag in production

**How to fix:**
- Add the following headers to all responses (or via middleware):
  - `Content-Security-Policy` (start with a restrictive policy)
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` or `SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` (disable unused browser features)
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains` (for HTTPS sites)
- Restrict CORS `allowedOrigins` to explicit domains; never use `*` on credentialed endpoints
- Redirect HTTP to HTTPS at the server/middleware level

---

## 5. Dependency Vulnerabilities

**Detect and fix:**
- Dependencies with known CVEs (check `package.json`, `requirements.txt`, `Gemfile`, `go.mod`, `Cargo.toml`, `pom.xml`, etc.)
- Unpinned dependency versions that could silently pull in malicious updates
- Unused dependencies that increase attack surface

**How to fix:**
- Run the package manager's audit tool (`npm audit fix`, `pip-audit`, `bundle audit`, `cargo audit`, `govulncheck`) and apply safe auto-fixes
- Upgrade packages with known vulnerabilities to the minimum safe version
- Flag packages that require a major version bump or have breaking changes — don't auto-upgrade those, leave a comment
- Remove dependencies that are imported but never used

---

## 6. Data Exposure & Privacy

**Detect and fix:**
- API responses that return more fields than the client needs (over-fetching sensitive data like passwords, tokens, internal IDs, PII)
- Error messages that reveal stack traces, file paths, database schema, or internal system details to end users
- Verbose logging in production that captures passwords, tokens, or PII
- Sensitive data stored unencrypted at rest when encryption is feasible

**How to fix:**
- Add explicit field selection or serializer allowlists to API responses — never return raw database objects
- Replace detailed error messages sent to clients with generic messages; log full details server-side only
- Audit log statements and strip any that capture auth credentials or sensitive user data
- Flag unencrypted storage of sensitive fields (SSNs, payment info, health data) for encryption with a comment

---

## 7. Rate Limiting & Abuse Prevention

**Detect and fix:**
- Authentication endpoints (login, signup, password reset, OTP) with no rate limiting
- APIs that allow bulk operations or enumeration without throttling
- File upload endpoints with no size or type restrictions

**How to fix:**
- Apply rate limiting middleware to auth endpoints (e.g. express-rate-limit, slowapi, rack-attack)
- Add CAPTCHA or proof-of-work on publicly exposed auth flows where rate limiting alone is insufficient
- Enforce file upload limits: max file size, allowlist of accepted MIME types, store outside the web root

---

## 8. Cryptography

**Detect and fix:**
- Use of broken algorithms: MD5, SHA-1, DES, RC4, ECB mode encryption
- Hardcoded encryption keys or IVs
- Random number generation using non-cryptographic PRNGs for security-sensitive values (tokens, session IDs)
- Self-signed or expired TLS certificates in production config

**How to fix:**
- Replace broken hash functions with SHA-256+ for integrity, bcrypt/Argon2 for passwords
- Replace hardcoded keys with environment-variable-sourced keys
- Replace `Math.random()` / `random.random()` with `crypto.randomBytes()` / `secrets.token_bytes()` for security-sensitive randomness
- Flag expired or self-signed certs for replacement — do not auto-replace production certs

---

## 9. File & Path Security

**Detect and fix:**
- Path traversal: user input used in file path construction without sanitization
- Files served from directories that should not be publicly accessible
- Executable files that can be uploaded and later served back

**How to fix:**
- Resolve file paths to absolute form and assert they are within an allowed base directory before any read/write
- Separate upload storage from the web-served static directory
- Validate file extensions and MIME types on upload; never execute uploaded content

---

## 10. Code Quality Patterns That Create Security Risk

**Detect and fix:**
- `TODO: fix security`, `FIXME`, `HACK`, or `TEMP` comments adjacent to auth, crypto, or data handling code
- Debug routes, admin backdoors, or test credentials left in production code
- Disabled security middleware or commented-out auth checks
- Use of `dangerouslySetInnerHTML`, `eval()`, `innerHTML =`, `document.write()` with any non-static content

**How to fix:**
- Resolve or remove insecure TODOs; do not leave known security debt unaddressed
- Delete debug routes, test users, and backdoor logic entirely
- Re-enable disabled security middleware; remove the bypass code
- Replace dangerous DOM injection with safe alternatives (e.g. `textContent`, sanitized rendering)

---

## Audit Output Format

After completing the audit, produce a summary in this format:

```
## Security Audit Summary

### Fixed Automatically
- [category] Brief description of what was fixed and where

### Requires Human Action
- [category] Brief description of what was found, why it can't be auto-fixed, and what action is needed
```

Do not produce the summary without having actually applied all auto-fixable changes first.

---

## Guiding Principles for the Agent

- **Fix, don't just report.** The purpose of reading this file is to take action.
- **Minimal footprint.** Make the smallest correct change that eliminates the vulnerability. Don't refactor unrelated code.
- **Preserve behavior.** Security fixes must not change functional behavior. If a fix might break something, leave a comment and add it to the human-action list.
- **No security through obscurity.** Don't hide problems — fix them or surface them clearly.
- **Fail securely.** When in doubt about a fix, default to the more restrictive option.
