# Test directory — Template CLI execution tests

This directory is used to test the template CLI (the local
`create-react-template` generator) by running it end-to-end and then running the
generated project's build and test steps.

The project includes convenience scripts in `package.json` that create temporary
example projects, install dependencies, build them, and run their tests. Use
`pnpm` (or `npm`/`npx` when noted) to run these scripts from this `test/`
directory.

## Purpose

- Provide a place to verify the template generator works correctly across
  supported templates.
- Each script clears a previous test folder, runs the generator to create a new
  test project, installs dependencies, builds the generated project, and runs
  its test suite.

## Available scripts and usage

All commands below should be run from the `test/` directory (project root:
`.../create-react-template/test`).

- Test Next.js (App Router) template

    ```bash
    pnpm run test:next-app
    ```

    What it does:
    - Remove any existing `next-app-test` folder.
    - Run the local generator entry point using `npx tsx` to create a new
      project named `next-app-test` with framework `next/app`.
    - Change into the newly created `next-app-test` directory, install
      dependencies using `pnpm`, build the generated project, and run its tests.

- Test Next.js (Pages Router) template

    ```bash
    pnpm run test:next-pages
    ```

    What it does:
    - Remove any existing `next-pages-test` folder.
    - Run the generator to create `next-pages-test` with framework `next/pages`.
    - Install dependencies, build, and run tests inside `next-pages-test`.

- Test TanStack Router template

    ```bash
    pnpm run test:tanstack
    ```

    What it does:
    - Remove any existing `tanstack-test` folder.
    - Run the generator to create `tanstack-test` with framework
      `tanstack-router`.
    - Install dependencies, build, and run tests inside `tanstack-test`.

## Notes and environment

- These scripts call `npx tsx ../src/create-template/index.ts` to execute the
  local generator. Make sure `tsx` is available (it will be downloaded by `npx`
  if necessary).
- The `test/` scripts expect `pnpm` to be installed globally (the repository
  uses pnpm). If you prefer `npm`, you can manually run the steps after the
  generator finishes.
- Running these scripts will download dependencies and may take several minutes
  depending on your network and machine.
- If you want to inspect the generated project without running `pnpm i` or
  tests, you can run the generator manually:

    ```bash
    npx tsx ../src/create-template/index.ts -n my-test-project -f next/app
    ```

    Then `cd my-test-project` and run whatever steps you prefer.

## Troubleshooting

- If a test fails during installation or build, check the generated project's
  `package.json` and `pnpm-lock.yaml` and confirm your Node.js and pnpm versions
  are compatible.
- Remove generated folders manually if the automated removal fails and try
  again.

---

Happy testing!
