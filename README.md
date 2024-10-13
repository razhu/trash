# Pando Services - NestJS Backend

This project is a NestJS backend for managing EV charging stations.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node version 20+
- [Docker](https://www.docker.com/get-started) (version 20 or later)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 1.29 or later)
- [Prisma](https://www.prisma.io/docs/getting-started) (Installed with `npm install prisma@5.19.1 --save-dev`

  **_Install the same Prisma version found in package.json_**

## Local Development

Follow these steps to set up your local development environment:

1. **Clone the Repository:**

   ```bash
   git clone git@gitlab.com:pando_electric/pando-services.git
   cd pando-services
   ```

2. **Install Dependencies and Setup Husky:**

   ```bash
   npm i
   npm run prepare
   ```

3. **Create and Configure the `.env` File:**

   Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file to set your local environment variables.

4. **Build and Start the Application:**

   For Development:

   ```bash
   docker compose up --build
   ```

   This command builds the Docker image and starts the containers.

5. **Migrate the Database:**

   - For development, create and apply migrations for schema changes:

     ```bash
     docker compose exec app npm run prisma:migrate:dev -- --name <migration_name>
     ```

     This command creates a new migration file with the specified name and applies it to the database.

   - For production, apply the latest migration without creating a new migration file:

     ```bash
     docker compose exec app npm run prisma:migrate:deploy
     ```

     **5.1 Seed database with roles and permissions:**

     After creating and applying your database migrations, run the seed script to populate your database with initial data for roles and permissions. This should be done only once in both development and production.

     ```bash
     docker compose exec app npm run prisma:seed
     ```

     In production, execute this in a task definition or as part of your CI/CD pipeline.

6. **Access the Application:**

   Open your browser and navigate to:

   - API: [http://localhost:3000/api](http://localhost:3000/api)
   - API Documentation: [http://localhost:3000/api-doc](http://localhost:3000/api-doc)

7. **Open Prisma Studio:**

   To interact with your database visually, run:

   ```bash
   docker compose exec app npm run prisma:studio
   ```

   Then, visit [Prisma Studio](http://localhost:5555) in your browser.

8. **Run Unit Tests:**

   Execute the following command to run unit tests:

   ```bash
   docker compose run --rm app npm run test
   ```

9. **Stopping the Application:**

   To stop the running containers, use:

   ```bash
   docker compose down
   ```

## Common Prisma Commands

Here are some helpful Prisma commands to use during development. All commands are run within the Docker container.

### 1. Generate Prisma Client

To generate the Prisma client after making changes to the schema, run:

```bash
docker compose exec app npm run prisma:generate
```

### 2. Format Schema

To format your `prisma.schema` file, use:

```bash
docker compose exec app npm run prisma:format
```

This command will format the Prisma schema according to the specified rules, ensuring consistent styling and syntax.

### 3. Reset the Database

To reset the database and apply all migrations from scratch, use:

```bash
docker compose exec app npm run prisma:reset
```

This command will drop and recreate the database, apply migrations, and prompt for confirmation.
