# SECURITY.md

**Version:** 1.0  
**Last Updated:** February 14, 2026  
**Project:** SageNest - Privacy-First Pregnancy Calculator  
**Security Level:** Critical (Handles Sensitive Health Information)

---

## MANDATORY: AI Agent Execution Framework

**THIS DOCUMENT IS BINDING FOR ALL AI ASSISTANTS**

Any AI agent (Claude Code, Codex, Cursor, Antigravity, etc.) performing code modifications, fixes, or feature implementations on this repository **MUST** adhere to the protocols defined in this document. Violations will result in PR rejection.

---

## 1. AI REMEDIATION & FEATURE IMPLEMENTATION RULES

### The "Anti-Mess" Protocol

#### 1.1 Surgical Fixes - Minimum Change Principle

**RULE:** Prioritize 1-line fixes over 10-line rewrites.

```
✅ CORRECT:
- Changed: Line 47 in calc.ts
- Reason: Fixed off-by-one error in gestational age calculation

❌ INCORRECT:
- Refactored: Entire calc.ts file to use functional programming patterns
- Reason: Made code "more maintainable"
```

**ENFORCEMENT:**
- Only modify code that is broken, buggy, or explicitly requested for change
- Do not refactor working code unless specifically asked
- Do not "improve" adjacent code during a fix
- Do not change formatting/style of untouched code
- Keep diffs minimal and reviewable

**EXCEPTIONS:**
- Security vulnerabilities require full remediation regardless of scope
- Critical bugs that cascade through multiple files
- Explicit refactoring requests from maintainers

#### 1.2 Pattern Matching - Consistency is Mandatory

**RULE:** All new code must strictly follow existing patterns.

**Variable Naming:**
```typescript
// ✅ CORRECT - Matches existing patterns
const dueDateFromLMP = (lmp: Date, cycleLength: number): Date => {...}
const gestationalAge = (lmp: Date, onDate?: Date): GestationalAgeResult => {...}

// ❌ INCORRECT - Introduces new pattern
const getDueDateFromLmp = (lmpDate: Date, cycleLengthDays: number): Date => {...}
```

**File Structure:**
```
✅ CORRECT:
src/
  components/
    NewComponent.tsx       # Component logic
  lib/
    newHelper.ts          # Pure functions
  styles/
    global.css            # All styles in one file

❌ INCORRECT:
src/
  components/
    NewComponent.tsx
    NewComponent.styles.css    # Don't create per-component CSS
  utils/                       # Don't create new top-level folders
    newHelper.ts
```

**React Component Patterns:**
```typescript
// ✅ CORRECT - Named export, props interface
interface NewComponentProps {
  value: number;
}

export const NewComponent = ({ value }: NewComponentProps) => {
  return <div>{value}</div>;
};

// ❌ INCORRECT - Default export, inline types
export default function NewComponent(props: { value: number }) {
  return <div>{props.value}</div>;
}
```

**Import Order:**
```typescript
// ✅ CORRECT - Matches existing pattern
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { formatDate } from '../lib/calc';
import { SEOHead } from '../components/SEOHead';

// ❌ INCORRECT - Random order
import { SEOHead } from '../components/SEOHead';
import { formatDate } from '../lib/calc';
import { useState } from 'react';
```

**ENFORCEMENT:**
- Read at least 3 similar existing files before creating new code
- Match indentation (2 spaces, not tabs)
- Match quote style (single quotes for imports, double for JSX)
- Match semicolon usage (always present)
- Match async/await patterns (use void for fire-and-forget)

#### 1.3 Dependency Minimalism - No Unnecessary Packages

**RULE:** Forbidden from suggesting new packages for problems solvable with native code or existing dependencies.

**Current Dependencies (package.json):**
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "@supabase/supabase-js": "^2.49.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "typescript": "^5.6.3",
    "vite": "^5.4.10",
    "vitest": "^2.1.4"
  }
}
```

**FORBIDDEN:**
- ❌ moment.js / date-fns (use native Date)
- ❌ lodash (use native array methods)
- ❌ axios (use native fetch)
- ❌ uuid (use crypto.randomUUID())
- ❌ classnames (use template literals)
- ❌ styled-components (use global.css)
- ❌ any CSS-in-JS library
- ❌ any testing library beyond vitest
- ❌ any animation library (use CSS)

**ALLOWED (with justification):**
- ✅ Type-only packages (e.g., @types/*)
- ✅ Build tooling updates (Vite, TypeScript)
- ✅ Critical security patches
- ✅ Replacements for deprecated dependencies

**ENFORCEMENT:**
- Before suggesting any new dependency, prove native code cannot solve it
- Provide bundle size impact analysis
- Show maintenance burden justification
- Get explicit approval from maintainer

#### 1.4 Complexity Check - Simplify Before Submitting

**RULE:** If a fix increases nesting or cyclomatic complexity, simplify it first.

**Maximum Allowed:**
- Nesting depth: 3 levels
- Cyclomatic complexity: 10 per function
- Function length: 50 lines (excluding types/comments)

**BAD (High Complexity):**
```typescript
// ❌ Nesting: 5 levels, Complexity: 12
const processData = (data: Data) => {
  if (data) {
    if (data.items) {
      for (const item of data.items) {
        if (item.valid) {
          if (item.value > 10) {
            if (item.status === 'active') {
              // deeply nested logic
            }
          }
        }
      }
    }
  }
};
```

**GOOD (Reduced Complexity):**
```typescript
// ✅ Nesting: 2 levels, Complexity: 5
const processData = (data: Data) => {
  if (!data?.items) return;
  
  const validItems = data.items.filter(item => 
    item.valid && item.value > 10 && item.status === 'active'
  );
  
  validItems.forEach(item => {
    // simplified logic
  });
};
```

**ENFORCEMENT:**
- Use early returns to reduce nesting
- Extract nested logic into named functions
- Use array methods (filter, map, reduce) over loops
- Split complex conditions into named boolean variables
- If function exceeds 50 lines, split into smaller functions

**MEASUREMENT:**
Run these checks before submitting:
```bash
# TypeScript will catch many issues
npm run build

# Tests must pass
npm run test

# Manual review of diff
git diff --stat
```

---

## 2. SECURITY GUARDRAILS

### 2.1 Zero-Trust Input Validation

**RULE:** All new endpoints, functions, or user inputs MUST include validation.

#### Client-Side Validation (Required)

**Date Inputs:**
```typescript
// ✅ CORRECT
export const validateLMP = (lmp: Date): ValidationResult => {
  const today = normalizeDate(new Date());
  const d = normalizeDate(lmp);
  
  if (d > today) {
    return { valid: false, message: 'Last menstrual period cannot be in the future.' };
  }
  
  if (d < addDays(today, -366)) {
    return { valid: false, message: 'Last menstrual period must be within the past 12 months.' };
  }
  
  return { valid: true };
};

// ❌ INCORRECT - No validation
const calculateDueDate = (lmp: Date) => {
  return addDays(lmp, 280);
};
```

**Numeric Inputs:**
```typescript
// ✅ CORRECT
const setCycleLength = (value: number) => {
  const sanitized = Math.floor(Number(value));
  
  if (!Number.isFinite(sanitized)) {
    setError('Cycle length must be a number');
    return;
  }
  
  if (sanitized < 21 || sanitized > 40) {
    setError('Cycle length must be between 21 and 40 days');
    return;
  }
  
  setCycleLength(sanitized);
};

// ❌ INCORRECT - Direct assignment
const setCycleLength = (value: number) => {
  setCycleLength(value);
};
```

**String Inputs (Admin Only):**
```typescript
// ✅ CORRECT
const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')    // Remove invalid chars
    .replace(/\s+/g, '-')             // Spaces to hyphens
    .replace(/-+/g, '-');             // Collapse hyphens
};

// ❌ INCORRECT - No sanitization
const slugify = (value: string): string => {
  return value.toLowerCase().replace(/ /g, '-');
};
```

#### Server-Side Validation (Supabase/Admin)

**RULE:** Never trust client-side validation alone for admin operations.

**Row Level Security (RLS) Policies:**
```sql
-- ✅ CORRECT - Admin email whitelist
CREATE POLICY "Only testforsavr@gmail.com can insert"
ON blog FOR INSERT
TO authenticated
USING (auth.email() = 'testforsavr@gmail.com');

-- ❌ INCORRECT - Any authenticated user
CREATE POLICY "Authenticated users can insert"
ON blog FOR INSERT
TO authenticated
USING (true);
```

**Client-Side Admin Check:**
```typescript
// ✅ CORRECT - Verify before operations
const { data } = await supabase.auth.getUser();

if ((data.user?.email ?? '').toLowerCase() !== ADMIN_EMAIL) {
  throw new Error('Unauthorized');
}

// Proceed with admin operation

// ❌ INCORRECT - No verification
const { data } = await supabase.auth.getUser();
// Proceed with admin operation
```

### 2.2 Secrets Management

**RULE:** Never hardcode credentials. Always use environment variables.

#### Environment Variables (.env.local)

```bash
# ✅ CORRECT - Pattern to follow
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ❌ INCORRECT - Never commit real values
VITE_SUPABASE_URL=https://kjhsdfkjhsdf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Usage Pattern

```typescript
// ✅ CORRECT - With fallback and warning
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables.');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');

// ❌ INCORRECT - Hardcoded
export const supabase = createClient(
  'https://kjhsdfkjhsdf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
);
```

#### .gitignore Protection

**MANDATORY ENTRIES:**
```
.env
.env.local
.env.*.local
*.key
*.pem
secrets/
```

**ENFORCEMENT:**
- Run `npm run check:conflicts` before commits (checks for conflict markers)
- Run `npm run check:package` before commits (validates package.json)
- Never commit files matching above patterns
- Rotate any accidentally committed secrets immediately

#### Cloudflare Pages Environment Variables

```bash
# ✅ CORRECT - Set in Cloudflare dashboard
Settings > Environment Variables > Production
VITE_SUPABASE_URL = [value]
VITE_SUPABASE_ANON_KEY = [value]

# ❌ INCORRECT - Hardcode in build command
Build command: VITE_SUPABASE_URL=xxx npm run build
```

### 2.3 Error Handling & Logging

**RULE:** Use consistent error patterns. No generic console.log/print.

#### Async/Await Error Pattern

```typescript
// ✅ CORRECT
const loadPosts = async () => {
  const { data, error } = await supabase
    .from('blog')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    setMessage(`Failed to load posts: ${error.message}`);
    return;
  }

  setPosts(data ?? []);
};

// Usage with void for fire-and-forget
useEffect(() => {
  void loadPosts();
}, []);

// ❌ INCORRECT - No error handling
const loadPosts = async () => {
  const { data } = await supabase.from('blog').select('*');
  setPosts(data);
};
```

#### Try/Catch Pattern (When Needed)

```typescript
// ✅ CORRECT - Specific error handling
try {
  const data = await someRiskyOperation();
  processData(data);
} catch (error) {
  console.error('Operation failed:', error);
  setError(error instanceof Error ? error.message : 'Unknown error');
}

// ❌ INCORRECT - Silent failure
try {
  const data = await someRiskyOperation();
  processData(data);
} catch (error) {
  // Silent fail
}

// ❌ INCORRECT - Generic logging
try {
  const data = await someRiskyOperation();
} catch (error) {
  console.log(error);
}
```

#### User-Facing Error Messages

```typescript
// ✅ CORRECT - Helpful and actionable
setError('Cycle length must be between 21 and 40 days');
setMessage('Post published successfully.');
setError('Failed to load posts: Network error. Please try again.');

// ❌ INCORRECT - Technical jargon
setError('ERR_INVALID_INPUT_RANGE');
setError('Supabase query failed');
setError('Something went wrong');
```

#### ARIA Live Regions for Errors

```tsx
// ✅ CORRECT - Accessible error display
{error && (
  <p id="field-error" className="error" role="alert">
    {error}
  </p>
)}

// ❌ INCORRECT - No accessibility
{error && <p>{error}</p>}
```

---

## 3. TESTING REQUIREMENTS

### 3.1 Mandatory Test Coverage

**RULE:** Every security fix or feature MUST include tests.

#### Test Types Required

| Change Type | Required Tests |
|------------|---------------|
| New calculation function | Unit test with edge cases |
| New UI component | Unit test for logic, manual QA for UI |
| New validation rule | Unit test with valid/invalid inputs |
| Bug fix | Regression test that would have caught bug |
| Refactoring | All existing tests must still pass |
| Dependency update | Full test suite must pass |

#### Existing Test Structure

```
tests/
  calc.test.ts              # Core pregnancy math
  dateHelpers.test.ts       # UI date formatting
  progressWheel.test.ts     # Progress mapping
```

#### Test Patterns

**Core Math Functions:**
```typescript
// ✅ CORRECT - Comprehensive edge cases
describe('lmpToDueDate', () => {
  test('standard 28-day cycle', () => {
    expect(lmpToDueDate(new Date('2026-02-13'), 28).toISOString().slice(0, 10))
      .toBe('2026-11-20');
  });

  test('longer 32-day cycle adds adjustment', () => {
    expect(lmpToDueDate(new Date('2025-12-01'), 32).toISOString().slice(0, 10))
      .toBe('2026-09-11');
  });

  test('leap year handling', () => {
    expect(lmpToDueDate(new Date('2024-02-29'), 28).toISOString().slice(0, 10))
      .toBe('2024-12-05');
  });
});

// ❌ INCORRECT - Only happy path
test('lmpToDueDate works', () => {
  expect(lmpToDueDate(new Date('2026-02-13'), 28)).toBeDefined();
});
```

**Validation Functions:**
```typescript
// ✅ CORRECT - Test boundaries
describe('validateLMP', () => {
  test('rejects future dates', () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    expect(validateLMP(future).valid).toBe(false);
  });

  test('rejects dates >12 months old', () => {
    expect(validateLMP(new Date('2020-01-01')).valid).toBe(false);
  });

  test('accepts valid recent date', () => {
    const recent = new Date();
    recent.setDate(recent.getDate() - 30);
    expect(validateLMP(recent).valid).toBe(true);
  });
});
```

**Helper Functions:**
```typescript
// ✅ CORRECT - Test edge cases
describe('formatWeeksAndDays', () => {
  test('formats standard values', () => {
    expect(formatWeeksAndDays(12, 3)).toBe('12w 3d');
  });

  test('normalizes overflow days into weeks', () => {
    expect(formatWeeksAndDays(10, 9)).toBe('11w 2d');
  });

  test('clamps invalid negative values', () => {
    expect(formatWeeksAndDays(-2, -1)).toBe('0w 0d');
  });

  test('handles NaN and Infinity', () => {
    expect(formatWeeksAndDays(Number.NaN, Number.POSITIVE_INFINITY)).toBe('0w 0d');
  });
});
```

### 3.2 Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode (during development)
npm run test -- --watch

# Run specific test file
npm run test calc.test.ts

# Run with coverage (not configured yet, but should be)
npm run test -- --coverage
```

### 3.3 Pre-Commit Checklist

**MANDATORY before every commit:**

```bash
# 1. TypeScript compilation
npm run build
# Must complete without errors

# 2. Test suite
npm run test
# All tests must pass

# 3. Package.json validation
npm run check:package
# Catches malformed JSON

# 4. Conflict marker check
npm run check:conflicts
# Catches uncommitted merge conflicts
```

**CI/CD Validation:**
- Cloudflare Pages runs `npm run build` on every push
- Build must succeed before deployment
- Any TypeScript errors block deployment

### 3.4 Test Writing Guidelines

**DO:**
- Test edge cases (null, undefined, empty, boundary values)
- Test error paths, not just happy paths
- Use descriptive test names that explain what's being tested
- Group related tests with `describe` blocks
- Keep tests isolated (no shared state)

**DON'T:**
- Test implementation details (test behavior, not internals)
- Write tests that depend on execution order
- Mock everything (test real integrations when possible)
- Skip tests with `.skip()` in commits
- Commit commented-out tests

---

## 4. SECURITY VULNERABILITY REPORTING

### 4.1 Internal Reporting (Private Repository)

**Primary Contact:**
- **Name:** Nishant
- **Email:** testforsavr@gmail.com
- **Response SLA:** 48 hours for acknowledgment

### 4.2 Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| **Critical** | Data exposure, authentication bypass, RCE | 24 hours |
| **High** | XSS, CSRF, SQL injection (admin panel) | 72 hours |
| **Medium** | Input validation issues, logic errors | 1 week |
| **Low** | Cosmetic issues, minor bugs | 2 weeks |

### 4.3 Reporting Format

**Email Subject:** `[SECURITY] [SEVERITY] Brief Description`

**Email Body:**
```
Severity: [Critical/High/Medium/Low]

Affected Component: [Calculator/Admin/Blog/etc.]

Description:
[Clear description of the vulnerability]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Impact:
[What data/functionality is at risk]

Suggested Fix (Optional):
[If you have a solution]

Environment:
- Browser: [Chrome 120 / Firefox 121 / etc.]
- OS: [Windows 11 / macOS 14 / etc.]
- URL: [Specific page if applicable]
```

### 4.4 Critical Bug Channel

**Direct Contact:** testforsavr@gmail.com

**Triggers for Critical Reporting:**
- Any exposure of user pregnancy data
- Authentication bypass in admin panel
- Supabase credential leakage
- XSS vulnerability that could steal admin session
- Build process compromise
- Dependency with known critical CVE

### 4.5 Disclosure Policy

**Timeline:**
1. **Day 0:** Report received
2. **Day 2:** Acknowledgment sent
3. **Day 7:** Fix developed and tested
4. **Day 14:** Fix deployed to production
5. **Day 30:** Public disclosure (if applicable)

**Exception:** Zero-day exploits in active use get emergency 24-hour turnaround.

---

## 5. DEPENDENCY SECURITY

### 5.1 Dependency Update Policy

**Automated Checks:**
```bash
# Check for outdated packages
npm outdated

# Check for known vulnerabilities
npm audit

# Update to fix vulnerabilities only
npm audit fix
```

**Update Schedule:**
- **Critical security patches:** Immediate (same day)
- **High severity:** Within 1 week
- **Medium severity:** Monthly maintenance window
- **Minor updates:** Quarterly review
- **Major updates:** Requires explicit approval and testing

### 5.2 Allowed Update Types (AI Guidance)

**AI CAN suggest:**
- ✅ Patch updates (1.2.3 → 1.2.4)
- ✅ Minor updates if backward compatible (1.2.0 → 1.3.0)
- ✅ Security patches regardless of version jump
- ✅ Updates to @types/* packages

**AI MUST GET APPROVAL for:**
- ⚠️ Major version bumps (1.x → 2.x)
- ⚠️ React/React DOM updates
- ⚠️ TypeScript major versions
- ⚠️ Vite major versions
- ⚠️ Any update that changes public APIs

**AI FORBIDDEN from:**
- ❌ Adding new runtime dependencies without approval
- ❌ Updating peer dependencies that cause conflicts
- ❌ Updating packages just because they're "old"

### 5.3 Known Vulnerable Patterns to Avoid

**XSS Vulnerabilities:**
```tsx
// ❌ NEVER do this
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Only use with sanitized markdown (existing pattern)
<div dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }} />
```

**Open Redirect:**
```typescript
// ❌ NEVER do this
const redirect = new URLSearchParams(window.location.search).get('redirect');
window.location.href = redirect;

// ✅ Whitelist allowed redirects
const allowedPaths = ['/calculator', '/blog', '/about', '/privacy'];
if (allowedPaths.includes(redirect)) {
  window.location.href = redirect;
}
```

**Prototype Pollution:**
```typescript
// ❌ NEVER do this
Object.assign({}, JSON.parse(userInput));

// ✅ Use type-safe parsing
const parsed = JSON.parse(input) as KnownType;
```

---

## 6. DEPLOYMENT SECURITY

### 6.1 Cloudflare Pages Configuration

**Required Headers (set in Cloudflare):**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Content Security Policy (if added):**
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://*.supabase.co;
```

### 6.2 Build Security

**Pre-Deploy Checks:**
```bash
# These run automatically in prebuild script
npm run check:package      # Validates package.json
npm run check:conflicts    # Checks for merge conflicts
npm run build             # Compiles TypeScript
```

**Build Output Validation:**
- ✅ No source maps in production (Vite default)
- ✅ No console.logs in production (manual review)
- ✅ No environment variables leaked to client (Vite VITE_ prefix protects)

### 6.3 Domain Security

**DNS Configuration:**
```
# HTTPS only
Cloudflare SSL/TLS: Full (strict)
Always Use HTTPS: On
Automatic HTTPS Rewrites: On
Minimum TLS Version: 1.2

# Security headers
HSTS: Enabled
HSTS Max Age: 31536000 (1 year)
```

---

## 7. PRIVACY & DATA PROTECTION

### 7.1 Client-Side Only Architecture

**Security Advantage:** No server-side data storage = no data breaches.

**Guaranteed by Design:**
- All pregnancy calculations happen in browser
- No form data sent to backend
- No cookies storing sensitive data
- No tracking or analytics on calculator

**AI MUST PRESERVE:**
- Client-side calculation architecture
- No data collection from calculator
- No localStorage for pregnancy data (unless explicitly approved)
- Privacy-first messaging in UI

### 7.2 Admin Panel (Supabase)

**Only Sensitive Data:** Blog posts (not user health data)

**Protection Layers:**
1. **Authentication:** Google OAuth only
2. **Authorization:** Email whitelist (testforsavr@gmail.com)
3. **Row Level Security:** Enforced at database level
4. **Session Management:** Handled by Supabase

**AI Restrictions:**
- ❌ Cannot modify admin email whitelist without approval
- ❌ Cannot disable RLS policies
- ❌ Cannot add new authentication methods
- ✅ Can suggest improvements to admin UX

### 7.3 Third-Party Services

**Current External Services:**
1. **Google Fonts** - Font delivery (minimal privacy impact)
2. **Supabase** - Admin blog management only
3. **Cloudflare Pages** - Static hosting

**AI Rules:**
- ❌ Cannot add analytics (Google Analytics, Mixpanel, etc.)
- ❌ Cannot add advertising networks
- ❌ Cannot add social media widgets
- ❌ Cannot add CDNs beyond Google Fonts
- ✅ Can optimize existing service usage

---

## 8. INCIDENT RESPONSE

### 8.1 Security Incident Classification

**Incident Types:**
1. **Data Breach:** Any unauthorized access to admin panel or blog data
2. **Service Disruption:** Website down, broken calculator
3. **Account Compromise:** Admin Google account compromised
4. **Dependency Vulnerability:** Critical CVE in npm package
5. **Build Failure:** Deployment blocked by security check

### 8.2 Incident Response Protocol

**Step 1: Detection**
- Automated: npm audit, Cloudflare alerts, build failures
- Manual: User reports, maintainer observation

**Step 2: Assessment** (Within 1 hour)
- Severity: Critical/High/Medium/Low
- Impact: What data/functionality is affected
- Scope: How many users impacted

**Step 3: Containment** (Immediate for Critical)
- Rotate compromised credentials
- Disable affected features
- Roll back to last known good deployment

**Step 4: Eradication**
- Fix root cause
- Deploy patch
- Verify fix in production

**Step 5: Recovery**
- Re-enable features
- Monitor for recurrence
- Communicate with users if needed

**Step 6: Lessons Learned**
- Document incident
- Update this SECURITY.md if needed
- Add regression tests

### 8.3 Emergency Contacts

| Role | Contact | Use Case |
|------|---------|----------|
| Primary Owner | testforsavr@gmail.com | All security issues |
| Supabase Support | Supabase Dashboard | Database/auth issues |
| Cloudflare Support | Cloudflare Dashboard | Hosting/DNS issues |

---

## 9. CODE REVIEW REQUIREMENTS

### 9.1 Security Review Checklist

**Every PR touching security-sensitive code must verify:**

- [ ] No hardcoded secrets or credentials
- [ ] Input validation for all user inputs
- [ ] Error handling with user-friendly messages
- [ ] No new dependencies without justification
- [ ] Tests cover security edge cases
- [ ] No console.logs in production code
- [ ] ARIA attributes on interactive elements
- [ ] No XSS vulnerabilities (check dangerouslySetInnerHTML)
- [ ] No open redirects
- [ ] Environment variables used correctly
- [ ] Admin operations have email verification

### 9.2 AI Self-Review Process

**Before submitting PR, AI MUST:**

1. Run full test suite: `npm run test`
2. Build successfully: `npm run build`
3. Check file count: Only modify files relevant to fix
4. Review diff: Ensure changes match "Anti-Mess" protocol
5. Verify patterns: New code matches existing code style
6. Check complexity: No deep nesting introduced
7. Validate tests: New/modified functions have tests
8. Review dependencies: No new packages added unnecessarily

---

## 10. COMPLIANCE & BEST PRACTICES

### 10.1 Accessibility (Security-Adjacent)

**WCAG 2.1 AA Compliance Required:**
- Color contrast ratios meet minimums
- Keyboard navigation functional
- Screen reader compatible
- Focus indicators visible
- ARIA labels on custom widgets

**Why Security Cares:**
- Accessible error messages help users avoid mistakes
- Keyboard nav prevents mouse-only attacks
- Screen readers announce security warnings

### 10.2 HTTPS Everywhere

**Enforcement:**
- All external resources loaded via HTTPS
- No mixed content warnings
- HSTS headers enabled
- Cloudflare forces SSL

### 10.3 Subresource Integrity (Future)

**Not yet implemented, but recommended:**
```html
<!-- Future improvement for Google Fonts -->
<link 
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
  rel="stylesheet"
  integrity="sha384-..."
  crossorigin="anonymous"
>
```

---

## 11. AI AGENT COMPLIANCE VERIFICATION

### 11.1 Pre-Submission Checklist for AI

**MANDATORY - AI must confirm each item:**

```
□ I have read and understood the entire SECURITY.md file
□ My changes follow the "Anti-Mess" protocol (minimal diffs)
□ My code matches existing patterns (naming, structure, style)
□ I have not added any new dependencies without justification
□ All new functions have cyclomatic complexity ≤ 10
□ All new user inputs have validation
□ All secrets use environment variables
□ Error handling follows project patterns
□ Tests cover my changes (unit or integration)
□ All tests pass (npm run test)
□ Build succeeds (npm run build)
□ No hardcoded credentials in my changes
□ No console.logs in production code
□ Accessibility maintained (ARIA, keyboard nav)
□ Privacy architecture preserved (client-side calculations)
```

### 11.2 AI Remediation Template

**Every fix/feature PR from AI must include:**

```markdown
## Change Summary
[One-sentence description]

## Files Changed
- file1.tsx (15 lines added, 3 removed)
- file2.ts (5 lines added, 0 removed)

## Compliance Checklist
- [x] Minimal change (surgical fix)
- [x] Pattern matching (follows existing code)
- [x] No new dependencies
- [x] Complexity check passed
- [x] Input validation added
- [x] Tests included
- [x] All tests pass
- [x] Build succeeds

## Security Impact
[None / Low / Medium / High]
[If not None, explain why this is secure]

## Test Coverage
- [x] Unit tests for new functions
- [x] Integration tests for API changes
- [x] Manual QA performed

## Breaking Changes
[Yes / No]
[If Yes, explain what breaks and migration path]
```

### 11.3 Automated Enforcement (CI/CD)

**Cloudflare Pages runs automatically:**
```bash
npm run check:package    # Validates JSON
npm run check:conflicts  # Checks merge markers
npm run build           # TypeScript compilation
```

**Future Additions (Recommended):**
```bash
npm run lint            # ESLint (not configured)
npm run test:coverage   # Test coverage threshold (not configured)
npm audit --audit-level=moderate  # Dependency vulnerabilities
```

---

## 12. SECURITY MAINTENANCE

### 12.1 Monthly Security Tasks

**First Monday of each month:**
- [ ] Run `npm audit` and review findings
- [ ] Run `npm outdated` and plan updates
- [ ] Review Cloudflare security alerts
- [ ] Review Supabase security logs
- [ ] Check for updates to this SECURITY.md

### 12.2 Quarterly Security Review

**Every 3 months:**
- [ ] Full dependency update cycle
- [ ] Review and rotate Supabase credentials
- [ ] Audit admin panel access logs
- [ ] Review and update RLS policies
- [ ] Test incident response procedures
- [ ] Update security documentation

### 12.3 Annual Security Audit

**Once per year:**
- [ ] External security assessment (if budget allows)
- [ ] Penetration testing on admin panel
- [ ] Review all third-party services
- [ ] Update security policies
- [ ] Train team on new threats

---

## APPENDIX A: Quick Reference

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm run test            # Run all tests
npm run test -- --watch # Watch mode

# Pre-commit
npm run check:package   # Validate package.json
npm run check:conflicts # Check for merge markers

# Security
npm audit               # Check for vulnerabilities
npm audit fix          # Auto-fix vulnerabilities
npm outdated           # Check outdated packages
```

### Emergency Contacts

- **Security Issues:** testforsavr@gmail.com
- **Critical Bugs:** testforsavr@gmail.com  
- **General Questions:** testforsavr@gmail.com

### Key Files

- `package.json` - Dependencies and scripts
- `.env.local` - Local environment variables (gitignored)
- `src/supabase/client.ts` - Admin authentication
- `scripts/check-conflicts.sh` - Merge conflict detection
- `scripts/check-package-json.mjs` - JSON validation

---

## APPENDIX B: Security Resources

### External Resources

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **React Security:** https://react.dev/learn/security
- **TypeScript Security:** https://www.typescriptlang.org/docs/handbook/security.html
- **Supabase Security:** https://supabase.com/docs/guides/auth/security
- **Cloudflare Security:** https://developers.cloudflare.com/pages/configuration/headers/

### Internal Documentation

- `README.md` - Project overview and setup
- `frontend.md` - UI/UX design system
- `codex.md` - Behavioral coding guidelines

---

**END OF SECURITY.md**

**Version:** 1.0  
**Last Updated:** February 14, 2026  
**Next Review:** May 14, 2026

**This document is binding for all code contributions to this repository.**
