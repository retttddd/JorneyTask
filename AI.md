# AI workflow

## Tools and guidance

- **Codex:** used as the coding agent for implementation support, boilerplate, review, and test generation.
- **Product Design skill in Codex:** used to explore and refine the visual direction, map interaction, booking flow, and mobile layout.
- **[Frontend contribution guide](journey-frontend/AGENTS.md):** used as the project guidance for the React, TypeScript, accessibility, API-driven state, and responsive-design requirements.

## Prompt approach

I used short, task-focused prompts rather than one large request. Typical prompt directions were:

- Review the booking flow for API validation, unavailable-cabana feedback, and immediate map updates.
- Refine the desktop and mobile layout while keeping the supplied map assets central to the experience.

## Workflow

The work took four main stages:

1. Read the task brief and frontend guidance, then define the API contract and map/booking states.
2. Use the Product Design skill to establish the visual direction and responsive interaction model.
3. Use Codex to iterate on the NestJS backend, React frontend, asset components.
4. Review the generated changes, complete task-specific logic manually, verify the booking flow, and run the full test suite.
