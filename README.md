# Moxymind technical tasks

## Table of contents

- [Overview](#overview)
- [Technical task #1](#technical-task-1)
- [Technical task #2](#technical-task-2)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Local Installation](#local-installation)
  - [Project Structure](#project-structure)
- [Running Tests](#running-tests)
  - [Parallel Execution](#parallel-execution)
  - [Run all tests](#run-all-tests)
  - [Saucedemo Test Execution](#saucedemo-test-execution)
  - [REST API Test Execution](#rest-api-test-execution)
  - [Test Filtering](#test-filtering)
- [Test Reports](#test-reports)
- [Configuration](#configuration)
- [CI/CD Integration](#cicd-integration)
- [Code standards](#coding-standards)
- [License](#license)

## Overview

Repository with technical tasks accomplished by M. Utkin.

- **Test framework:** Playwright + Typescript
- **Execution options:** local + CI/CD (GitHub Actions)

## Technical task #1

Frontend test automation - [see `docs/`](./docs/sausedemo.md).

## Technical task #2

API test automation - [see `docs/`](./docs/rest-api.md).

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm package manager

### Local Installation

1. Clone the repository:

```bash
git clone https://github.com/mishautkin/moxymind.git
cd moxymind
```

2. Install dependencies and playwright:

```bash
npm run setup:tests
```

3. In the project root create `.env` file with variables from [Environment Variables](#environment-variables) section.



### Project Structure

```
moxymind/
├── .github/                       # CI/CD workflows
├── docs/                          # Additional documentation
├── resources/
│   └── types.ts                   # Types declarations
├── tests/
│   ├── saucedemo/
│   │   ├── _test.setup.ts         # Saucedemo storage state setup
│   │   ├── _test.data.ts          # Saucedemo test data
│   │   └── saucedemo.spec.ts      # Saucedemo test suite
│   ├── rest-api/
│   │   ├── _test.data.ts          # REST API test data
│   │   └── rest-api.spec.ts        # REST API test suite
├── utils/
│   ├── test.ts                    # Playwright Test fixtures
│   ├── rest-client.ts             # REST API client class
│   ├── base-page.ts               # Parent POM class for other page fixtures
│   ├── login-page.ts              # POM class for loginPage fixture
│   ├── inventory-page.ts          # POM class for inventoryPage fixture
│   └── ...                        # Other POM files, utils and helpers
├── playwright.config.ts           # Playwright configuration
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

## Running Tests

### Parallel Execution

All given tests can be executed in parallel.

Parallel execution can be configured in `playwright.config.ts`:

- Enable/disable parallel execution by `fullyParallel` param.
- Number of tests running in parallel by `workers` param.

**Alternative CLI commands:**

```bash
# Run all Saucedemo tests using 1 worker (non-parallel)
npx playwright test --project=saucedemo* --workers=1
```

## Run all tests

```bash
# Run all tests
npm run test:all
```

### Saucedemo Test Execution

```bash
# Run all Saucedemo tests
npm run test:saucedemo

# Run Saucedemo tests only in Chrome 
npm run test:saucedemo:chrome

# Run Saucedemo tests only in Firefox 
npm run test:saucedemo:firefox

# Run Saucedemo tests only in Safari 
npm run test:saucedemo:webkit
```

### REST API Test Execution

```bash
# Run all tests
npm run test:restapi
```

### Test Filtering

```bash
# Run specific test case
npx playwright test --grep "TC-01" --project=saucedemo-chrome

# Run specific test case in debug mode
npx playwright test --grep "TC-01" --project=saucedemo-chrome --debug
```

## Test Reports

Test suite is configured to list running tests and statuses in terminal and output html report: `playwright-report/index.html`.

## Configuration

### Test Configuration

Key configuration options in `playwright.config.ts`:
- **Parallel Execution**: Tests run in parallel for faster execution
- **Retries**: Automatic retry on failure (configurable for CI/local)
- **Screenshots**: Captured on test failures
- **Videos**: Recorded on test retries
- **Multiple Browsers**: Chrome, Firefox, Safari, and mobile

### Environment Variables

```bash
# Saucedemo vars
BASE_URL_SAUCEDEMO='https://www.saucedemo.com' # test site base URL
STORAGE_STATE_SAUCEDEMO='./storage-state-saucedemo.json' # storage state file

# REST API vars
BASE_URL_RESTAPI='https://reqres.in/api' # test site base URL
RESTAPI_KEY='***' # API key (free API key: reqres-free-v1)
```

## CI/CD Integration

Two GitHub Action workflows are located in [`./.github`](./.github/workflows/) directory.

- Workflows are triggered on push to main branch
- Workflows require environment variables and secrets (see [Environment Variables](#environment-variables) section) to be added on GutHub.

## Coding standards

ESLint with standard libraries is used for code standardization.

Usage:

```bash
# Check for linting issues
npm run lint

# Automatically fix issues
npm run lint:fix
```


## License

This project is licensed under the MIT License - see the LICENSE file for details.
