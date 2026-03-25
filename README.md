# FreightShip Frontend

An Angular-based frontend application for the FreightShip platform.

## Development Server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running Unit Tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running End-to-End Tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

---

## 🐳 Run with Docker

The easiest way to run the frontend on any machine — no need to install Node.js or Angular CLI manually.

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed on your system.

### Step 1 — Pull the Image

```bash
docker pull jainras/freightship-frontend
```

### Step 2 — Run the Container

```bash
docker run -d -p 4200:80 --name fs-frontend jainras/freightship-frontend
```

| Flag | Description |
|---|---|
| `-d` | Run in background (detached mode) |
| `-p 4200:80` | Map host port 4200 → container port 80 (Nginx) |
| `--name fs-frontend` | Assign a name to the container |

### Step 3 — Verify It's Running

Open your browser and visit:

```
http://localhost:4200
```

Or check from the terminal:

```bash
docker ps
```

### Useful Docker Commands

```bash
# View logs
docker logs fs-frontend

# Follow logs in real-time
docker logs -f fs-frontend

# Stop the container
docker stop fs-frontend

# Restart the container
docker start fs-frontend

# Remove the container (must be stopped first)
docker rm fs-frontend
```

### Updating the Image After Code Changes

After making changes to the code, rebuild and push the updated image:

```bash
# 1. Rebuild the image
docker build -t jainras/freightship-frontend:latest .

# 2. Push the updated image to Docker Hub
docker push jainras/freightship-frontend:latest
```

On the target machine, pull and restart with the latest version:

```bash
# 3. Pull the latest image
docker pull jainras/freightship-frontend:latest

# 4. Stop and remove the old container
docker stop fs-frontend
docker rm fs-frontend

# 5. Run the new version
docker run -d -p 4200:80 --name fs-frontend jainras/freightship-frontend:latest
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
