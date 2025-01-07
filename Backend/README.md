# ScienCENIA API

## Setup
This repository uses [Bun](https://bun.sh/) as the JS runtime, package manager, and bundler. To install it, run the following command:

```bash
curl -fsSL https://bun.sh/install | bash # For Linux and macOS
powershell -c "irm bun.sh/install.ps1 | iex" # For Windows
```

After installing Bun, run the following command to install the project dependencies:

```bash
bun install
```

You'll then want to create a `.env` file in the root of the project and copy the contents of the `.env.template` file. The defaults provided should work for local development if you use Docker Compose to set up the database.

Installing Bun on your local development environment is recommended even if you use Docker Compose, as it'll allow you to easily run scripts.

### Docker Compose
To set up a full development environment, you can use Docker Compose. You'll first need to create a network:

```bash
docker network create app-network
```

Then, you can start the database and the API:
```bash
docker compose up
```

The API will be available at `http://localhost:3000`.

## Development
For development, it's recommended to enable Docker Compose's Watch feature, which will sync changes to the API container, where Bun will automatically restart the server. To use this feature, just add the `--watch` flag to the `up` command:
```bash
docker compose up --watch
```

### Linting
The project uses ESLint for linting. To run the linter, use the following command:
```bash
bun lint
```

### Type checking
The project uses TypeScript for type checking. If you're using VSCode, this should work out of the box. If you want to run the type checker manually, use the following command:
```bash
bun type-check
```

### Hot reloading
While using the `--watch` will allow Bun to [automatically restart the server when changes are made](https://bun.sh/docs/runtime/hot#watch-mode), you might want to use Bun's [Hot reloading](https://bun.sh/guides/http/hot) instead, which will give you almost instant refreshes every time you update the code.

To do this, you can override the Bun script that Compose will run by using the `BUN_SCRIPT` environment variable (the default is `dev`):

```bash
BUN_SCRIPT=dev:hot docker compose up --watch
```

The only downside is that this is less useful for changes that affect the startup cycle of the app (e.g. changing model schemas), as any updates won't be reflected unless you manually restart the server.


### Debugging

> [!WARNING]
> Debugging through VSCode while running in the app under Compose is not currently supported due to limitations in the VSCode Bun extension. See [this issue](https://github.com/oven-sh/bun/issues/7490).

If you want to debug the app while using Docker Compose, you can use Bun's web-based debugger. To do this, just start the app and navigate to [https://debug.bun.sh/#localhost:6499/api](https://debug.bun.sh/#localhost:6499/api). You can find a tutorial on how to use the debugger [here](https://bun.sh/docs/runtime/debugger#debuggers).

Note that the links that appear while launching the app will not work, so you need to use the above link instead.

## Deployment
This project defines its infrastructure as code using [SST](https://sst.dev/). The specification of this infrastructure can be found in the file [`sst.config.ts`](./sst.config.ts).

To deploy the project, you'll need to [configure your AWS credentials](https://sst.dev/docs/iam-credentials#credentials), as well as set a `CLOUDFLARE_API_TOKEN` environment variable with the value of your Cloudflare API token. This token needs to have at least DNS edit permissions and view access to account settings.

You can use your own AWS account if you want, though you need to make sure the domain under `sst.config.ts` is available from your Cloudflare account. If you're redeploying the app in a new domain, just change it to a domain or subdomain that is under your Cloudflare account.

After that, you can deploy the app (to production) using:

```bash
bun run deploy
```

If you instead want to deploy to a personal stage:
```bash
bun run deploy:personal
```

And if you want to use the real infrastructure to back your development process, you can use:
```bash
bun run dev:sst
```

This will temporarily deploy the database for the app, but load a local version of the API (and tie the credentials automatically). This can be helpful if debugging problems that only appear with the real AWS RDS database.