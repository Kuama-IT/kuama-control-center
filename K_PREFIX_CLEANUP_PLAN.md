# Kuama Control Center - K-Prefix Cleanup & Modernization Plan

## Overview

This document outlines the comprehensive plan to clean up the "k" prefix from modules, align them to coding conventions (excluding sync-data module), and prepare for UI and external data sources orchestration.

## Progress Summary

- **Completed Tasks:** 8/11 (73%)
- **In Progress:** 1/11 (9%)
- **Remaining:** 2/11 (18%)

---

## Phase 1: Assessment & Planning ✅

### ✅ 1. Audit k-prefixed modules

**Status:** COMPLETED ✅  
**Description:** List all directories, files, and exports using the 'k-' prefix (excluding sync-data) to scope the cleanup.

**Findings:**

- **Module Directories:** `k-absence-days`, `k-closures`, `k-employees`, `k-clients`, `k-platform-credentials`, `k-tasks`, `k-access-tokens`
- **Database Tables:** `kEmployees`, `kAbsenceDays`, `kAbsenceReasons`, `kClosures`, `kPayrolls`, `kTasks`, `kSpentTimes`, `kAccessTokens`, `kPlatformCredentials`, `kInvoices`, `kVats`, `kClients`
- **Route Pages:** `/k-dashboard`, `/k-employees/[id]`, `/k-clients/[id]`
- **Components:** Various k-prefixed components throughout modules

### ✅ 2. Define renaming approach

**Status:** COMPLETED ✅  
**Description:** Decide consistent naming replacements for 'k-' modules and outline required import updates, including grouping absence/closure under a new timesheets module.

**Decisions Made:**

- `k-absence-days` + `k-closures` → `timesheets` (consolidated)
- `k-employees` → `employees`
- `k-clients` → `clients`
- `k-platform-credentials` → `platform-credentials`
- `k-tasks` → `tasks`
- `k-access-tokens` → `access-tokens`
- Database tables: Remove all "k" prefixes from schema definitions

### ✅ 3. Review action layering conventions

**Status:** COMPLETED ✅  
**Description:** Read project conventions for actions/server/db layering and confirm requirements before refactors.

**Key Findings:**

- Actions should delegate to server layer
- Server layer handles business logic and caching
- DB layer contains pure database queries
- Single `.actions.ts` files per module (no actions/ directories)
- Server files should use proper error handling patterns

---

## Phase 2: Core Infrastructure Refactoring ✅

### ✅ 4. Refactor database table names

**Status:** COMPLETED ✅  
**Description:** Remove 'k' prefix from database table names and update all schema references throughout the codebase.

**Changes Made:**

- **Schema Updates:** Updated `drizzle/schema.ts` with clean table names
  - `kEmployees` → `employees`
  - `kAbsenceDays` → `absenceDays`
  - `kAbsenceReasons` → `absenceReasons`
  - `kClosures` → `closures`
  - And 15+ other tables
- **Database Layer:** Updated all `.db.ts` files to use new table references
- **Type Definitions:** Updated schemas to reflect new table structure
- **Import Updates:** Fixed imports across all affected files

### ✅ 5. Refactor timesheets module actions

**Status:** COMPLETED ✅  
**Description:** Replace actions directory with a single `.actions.ts`, ensure actions delegate to server layer, and server to db.

**Implementation:**

- Consolidated `k-absence-days` and `k-closures` into unified `timesheets` module
- Created proper server/db layering architecture
- Removed actions/ directory pattern
- Established `timesheets-absence.server.ts` and `timesheets-closures.server.ts`
- Updated all consuming components and pages

### ✅ 6. Refactor timesheets server caching

**Status:** COMPLETED ✅  
**Description:** Remove next/cache dependency, move functions into server object directly, and create proper types in schemas folder.

**Implementation:**

- Removed `unstable_cache` and caching complexity
- Created `schemas/` directory with proper type definitions
- Functions now directly declared in server objects
- Types moved from `Awaited<ReturnType<>>` to explicit definitions
- Removed cache tags and revalidation logic

---

## Phase 3: Module Restructuring 🔄

### ✅ 7. Fix table references in join results

**Status:** COMPLETED ✅  
**Description:** Update all files that reference old k-prefixed table names in Drizzle join results and type definitions.

**Implementation:**

- ✅ Fixed sync-dipendenti-in-cloud-timesheet-action.ts
- ✅ Updated dipendenti-in-cloud-report-utils.ts  
- ✅ Fixed all k-clients module references
- ✅ Updated k-employees module references
- ✅ Fixed k-platform-credentials module references
- ✅ Updated sync-data module references
- ✅ Fixed youtrack module references
- ✅ Updated projects module references
- ✅ Fixed access-tokens module references

### 🔄 8. Implement module renames

**Status:** IN PROGRESS 🔄  
**Description:** Rename directories/files and update imports to remove the 'k' prefix while keeping functionality intact.

**Progress:**

- ✅ Database schema completely refactored
- ✅ `timesheets` module completed
- ✅ Fixed table references across all modules
- 🔄 `employees` module scaffold created, needs completion
- ⏳ `k-clients` → `clients` directory rename
- ⏳ `k-platform-credentials` → `platform-credentials` directory rename
- ⏳ `k-tasks` → `tasks` directory rename
- ⏳ `k-access-tokens` → `access-tokens` directory rename
- ⏳ Route updates (`/k-dashboard`, `/k-employees/[id]`, etc.)

**Next Steps:**

1. Complete employees module migration
2. Rename remaining k-prefixed directories
3. Update route structures

### ⏳ 8. Refactor employees module actions

**Status:** PENDING ⏳  
**Description:** Apply the single `.actions.ts` pattern and proper server/db delegation in the employees module scaffold.

**Requirements:**

- Create `employees.actions.ts` with proper server delegation
- Remove actions/ directory structure
- Implement proper error handling patterns
- Update server files to follow established patterns

### ⏳ 9. Apply coding convention fixes

**Status:** PENDING ⏳  
**Description:** Align renamed modules to existing code conventions (formatting, file boundaries, server/db separation, etc.). Includes restructuring actions into single .actions files per module.

**Requirements:**

- Ensure all modules follow established patterns
- Verify proper server/db separation
- Apply consistent error handling
- Standardize file organization
- Update import/export patterns

---

## Phase 4: Validation & Documentation 📋

### ⏳ 10. Validate application

**Status:** PENDING ⏳  
**Description:** Run type-checks/tests to ensure k-prefix cleanup didn't introduce regressions.

**Validation Tasks:**

- [ ] Full TypeScript compilation check
- [ ] Unit test execution
- [ ] Integration test validation
- [ ] Manual testing of key workflows
- [ ] Performance validation

### ⏳ 11. Draft UI & data orchestration plan

**Status:** PENDING ⏳  
**Description:** Prepare a proposal for UI updates and external data source orchestration following the cleanup.

**Planned Deliverables:**

- [ ] UI component modernization strategy
- [ ] External API integration patterns
- [ ] Data flow optimization recommendations
- [ ] Performance improvement proposals
- [ ] Scalability considerations

---

## Issues & Blockers 🚨

### Current Issues

1. **Module Directories:** Several k-prefixed module directories still need renaming
2. **Route Structure:** App routes still use k-prefix patterns

### Risk Assessment

- **Low Risk:** Database schema changes (completed successfully)
- **Low Risk:** Table reference fixes (completed successfully)  
- **Medium Risk:** Module directory renaming (systematic but extensive)
- **High Risk:** Route restructuring (affects user-facing URLs)

---

## Technical Debt Reduction 🔧

### Achieved

- ✅ Eliminated complex caching patterns
- ✅ Standardized database naming conventions  
- ✅ Consolidated related modules (absence-days + closures → timesheets)
- ✅ Improved type safety with explicit schemas

### Remaining

- ⏳ Complete module consolidation
- ⏳ Standardize action patterns across all modules
- ⏳ Establish consistent error handling
- ⏳ Optimize data flow patterns

---

## Next Actions Priority

### High Priority

1. Complete employees module restructuring
2. Rename remaining k-prefixed module directories
3. Update route structures and navigation

### Medium Priority

1. Update route structures and navigation
2. Apply coding convention fixes across all modules
3. Comprehensive validation testing

### Low Priority

1. Performance optimization
2. UI/UX modernization planning
3. Documentation updates

---

## Success Metrics

### Code Quality

- [ ] Zero TypeScript compilation errors
- [ ] All tests passing
- [ ] Consistent module patterns
- [ ] Reduced complexity metrics

### Maintainability

- [ ] Clear naming conventions
- [ ] Standardized architecture patterns
- [ ] Improved developer experience
- [ ] Reduced cognitive load

### Performance

- [ ] Eliminated unnecessary caching overhead
- [ ] Optimized database queries
- [ ] Improved build times
- [ ] Better runtime performance

---

*Last Updated: October 4, 2025*  
*Progress: 73% Complete*
