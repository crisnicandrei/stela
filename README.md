[![lint](https://github.com/PermanentOrg/stela/actions/workflows/lint.yml/badge.svg)](https://github.com/PermanentOrg/stela/actions/workflows/lint.yml)
[![unit tests](https://github.com/PermanentOrg/stela/actions/workflows/test.yml/badge.svg)](https://github.com/PermanentOrg/stela/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/PermanentOrg/stela/branch/main/graph/badge.svg?token=4LYJGPGU57)](https://codecov.io/gh/PermanentOrg/stela)

# Stela: A Monolithic Typescript Backend for Permanent.org

## Setup

1. Create a `.env` file

```bash
cp .env.template .env
```

Update values as needed (see [Environment Variables](#environment-variables).

2. Install Node.js version 18 (doing this using [nvm](https://github.com/nvm-sh/nvm) is recommended).

3. Install dependencies

```bash
npm install
```

## Environment Variables

| Variable                          | Default                                                     | Notes                                                                  |
| --------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| DATABASE_URL                      | postgres://postgres:permanent@localhost:5432/test_permanent | Run tests to generate default database                                 |
| PORT                              | 8080                                                        | Tells stela what port to run on                                        |
| FUSIONAUTH_HOST                   | none                                                        | Can be found in `back-end`'s library/base/constants/base.constants.php |
| FUSIONAUTH_API_KEY                | none                                                        | Can be found in `back-end`'s library/base/constants/base.constants.php |
| FUSIONAUTH_TENANT                 | none                                                        | Can be found in `back-end`'s library/base/constants/base.constants.php |
| FUSIONAUTH_BACKEND_APPLICATION_ID | none                                                        | Can be found in `back-end`'s library/base/constants/base.constants.php |
| FUSIONAUTH_ADMIN_APPLICATION_ID   | none                                                        | Can be found in the FusionAuth Admin application                       |

## Testing

Run tests with

```bash
npm run test
```

Note that the database tests run against is dropped and recreated at the beginning of each test run.

## Running Locally

Preferred method: From the `devenv` repo, run

```bash
docker compose up -d
```

or if you've added or updated dependencies, run

```bash
docker compose up -d --build stela
```

Outside a container: Run

```bash
npm run start
```
