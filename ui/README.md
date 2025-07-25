# TensorZero UI

The TensorZero UI provides a web interface to help manage your TensorZero deployments.
The UI provides functionality for observability, optimization, and more.

## Running the UI

The easiest way to run the UI is to use the `tensorzero/ui` Docker image.
See the [Quick Start](https://www.tensorzero.com/docs/quickstart/) and the [TensorZero UI Deployment Guide](https://www.tensorzero.com/docs/ui/deployment/) for more information.

## Development Setup

> [!NOTE]
>
> **_The following instructions are for people building TensorZero itself, not for people using TensorZero for their applications._**

We provide fixture data for development purposes, but you can also use the UI with any relevant configuration.
The instructions below assume you're using the provided setup with fixture data.

1. Build the `evaluations` binary. Run: `cargo build -p evaluations`
2. Build the MiniJinja WASM module. See `./app/utils/minijinja/README.md` for reference.
3. Set the environment variables for the gateway. Create a `.env` file in `fixtures/` with credentials. See `fixtures/.env.example` for reference.
4. Launch the TensorZero Gateway and ClickHouse with `docker compose -f fixtures/docker-compose.yml up`.
5. Set the UI environment variables in the shell (not `.env`). See `./.env.example` for reference.
6. Build the internal N-API client for TensorZero using `pnpm -r build`. If you have changed your Rust code, you may also have to run `pnpm build-bindings` from `internal/tensorzero-node`.
7. Run `pnpm` scripts from the root of the repository to start the app:
   - Run `pnpm install` to install the dependencies.
   - Run `pnpm ui:dev` to start the development server.
   - You can also run tests with `pnpm ui:test` and Storybook with `pnpm ui:storybook`.
