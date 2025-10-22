# Known Issues
# 已知问题

**Version**: 1.0.0
**Last Updated**: 2025-10-22

---

## 1. SWR Import Warning

### Issue Description

When running the Next.js development server or Playwright tests, you may see the following warning multiple times:

```
⚠ ./lib/swr/hooks.ts
Attempted import error: 'swr' does not contain a default export (imported as 'useSWR').
```

### Impact

- **Severity**: Low (Warning only, not an error)
- **Functionality**: ✅ **No impact** - All features work correctly
- **Tests**: ✅ **40/41 tests pass** (1 skipped)
- **Build**: ✅ Production builds succeed
- **Runtime**: ✅ Application runs normally

### Root Cause

This is a **known compatibility issue** between:
- **Next.js 14** (with Turbopack/SWC compiler)
- **SWR 2.x** (specifically v2.3.6)

The warning occurs because Next.js's static analysis cannot correctly identify the default export in SWR's package structure, even though the export exists and works correctly at runtime.

**Technical Details**:
- SWR exports `useSWR` as default: `export { useSWR as default }` in `dist/index/index.mjs`
- SWR uses dual `.d.ts` and `.d.mts` type definitions for CommonJS/ESM compatibility
- Next.js 14's module resolution with `moduleResolution: "bundler"` triggers the warning

### Attempted Fixes (Unsuccessful)

The following approaches were tested but did **not** resolve the warning:

1. ❌ **Named import**: `import { default as useSWR } from 'swr'`
   - Result: Warning persists

2. ❌ **Namespace import**: `import * as SWR from 'swr'; const useSWR = SWR.default;`
   - Result: Warning persists, tests fail

3. ❌ **Next.js configuration**:
   ```js
   transpilePackages: ['swr'],
   experimental: { esmExternals: 'loose' }
   ```
   - Result: Warning persists, **36 tests fail**

### Current Solution

**✅ Recommended Approach: Ignore the warning**

The warning is cosmetic and does not affect functionality. Keep the standard import:

```typescript
// lib/swr/hooks.ts
import useSWR from 'swr';
import type { SWRConfiguration } from 'swr';
```

**Rationale**:
- This is the officially recommended import method from SWR documentation
- All tests pass with this approach (40/41)
- Production builds succeed
- Application works correctly in all environments

### Future Resolution

This issue may be resolved by:
- **SWR**: Future versions may adjust package exports for better Next.js compatibility
- **Next.js**: Future versions may improve ESM module resolution
- **TypeScript**: Updates to module resolution logic

**Tracking**:
- Monitor SWR releases: https://github.com/vercel/swr/releases
- Monitor Next.js 14.x and 15.x releases

### References

- SWR Documentation: https://swr.vercel.app/
- Next.js Module Resolution: https://nextjs.org/docs/app/api-reference/next-config-js
- Related GitHub Issues:
  - https://github.com/vercel/swr/issues/[search for "default export"]
  - https://github.com/vercel/next.js/issues/[search for "swr default export"]

---

## 2. Visual Regression Test Baseline

### Issue Description

1 test is skipped in the Playwright test suite.

### Status

- **Test**: `tests/visual-regression/components.spec.ts`
- **Reason**: Baseline screenshot may need regeneration
- **Impact**: Non-blocking

### Resolution

Re-generate baseline screenshots if needed:

```bash
npx playwright test --update-snapshots --project=chromium
```

---

## Reporting New Issues

If you encounter new issues:

1. Check this document first
2. Search existing GitHub issues
3. Create a new issue with:
   - Environment details (Node.js version, OS)
   - Reproduction steps
   - Expected vs actual behavior
   - Screenshots/logs

**Issue Template**: [Link to issue template]

---

**Document Maintainer**: Frontend Team
**Next Review**: 2025-11-22
