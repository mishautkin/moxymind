# Moxymind technical tasks

## Table of contents

- [Overview](#overview)
- [Technical task #1](#technical-task-1)
- [Technical task #2](#technical-task-2)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Project Structure](#project-structure)
- [Running Tests](#running-tests)
  - [Saucedemo Test Execution](#saucedemo-test-execution)
  - [REST API Test Execution](#rest-api-test-execution)
  - [Test Filtering](#test-filtering)
- [Test Reports](#test-reports)
- [Configuration](#configuration)
- [CI/CD Integration](#cicd-integration)
- [Code standards](#coding-standards)
- [License](#license)

## Overview

Repository with technical tasks accomplished by M. Utkin for Moxymind.

## Technical task #1

Frontend test automation - [see `docs/`](./docs/sausedemo.md).

## Technical task #2

API test automation - [see `docs/`](./docs/rest-api.md).

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/mishautkin/moxymind.git
cd moxymind

# Install dependencies and playwright
npm run setup:tests
```

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
│   ├── restapi/
│   │   ├── _test.setup.ts         # REST API storage state setup
│   │   ├── _test.data.ts          # REST API test data
│   │   └── restapi.spec.ts        # REST API test suite
├── utils/
│   ├── test.ts                    # Playwright Test fixtures
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

### Saucedemo Test Execution

```bash
# Run all tests
npm run test:saucedemo
```

### REST API Test Execution

```bash
# Run all tests
npm run test:restapi
```

### Test Filtering

```bash
# Run specific test case
npx playwright test --grep "TC-01"

# Run specific test case in debug mode
npx playwright test --grep "TC-01" --debug
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
BASE_URL_RESTAPI='https://reqres.in' # test site base URL
STORAGE_STATE_RESTAPI='./storage-state-restapi.json' # storage state file
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

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
