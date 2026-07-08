# AGENTS.md

## Project Context

This is an application repository. Treat it as user-owned application code, keep changes focused on the user's request, and preserve existing project conventions.

Start with `README.md` for local setup, environment variables, and project workflow.

## Project References

- Review the project structure before making changes.
- Follow the existing coding style and project architecture.
- Reuse existing components and utilities whenever possible.

## Key Files

- `src/`: Frontend application source.
- `src/api/`: API service layer.
- `vite.config.js`: Vite configuration.
- `.env.local`: Local environment variables; never commit secrets.

## Working Notes

- Use `npm install` to install project dependencies.
- Use `npm run dev` to start the local development server.
- Reuse the existing project structure and component patterns before adding new files.
- Run the relevant checks from `package.json` before finishing code changes.
- Keep commits focused and avoid unnecessary modifications to unrelated files.
