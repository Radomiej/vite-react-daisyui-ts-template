# Project Tasks

## Completed Tasks

### Implement Kanban Board with dnd-kit (2025-07-04)

- [x] Research dnd-kit best practices and example implementations
- [x] Add dnd-kit as a dependency using yarn
- [x] Design a kanban board demo (columns + tasks, Trello-style)
- [x] Implement the kanban board demo as a module in `src/features/kanban`
- [x] Style the demo using DaisyUI and Flexbox
- [x] Add unit tests for the new module
- [x] Fix unit tests to work with Vitest (replace Jest-specific matchers)
- [x] Integrate kanban board into app routing and navigation
- [x] Update README.md with kanban board documentation

## Discovered During Work

- The project uses Vitest for testing, which requires different assertions than Jest
- Need to use `toBeDefined()` instead of `toBeInTheDocument()` for element existence checks
- Need to use `className.contains()` instead of `toHaveClass()` for class checks
- There's an unrelated failing test in ReactFlowExample.test.tsx that should be fixed separately

## Future Enhancements

- [ ] Add ability to create new tasks
- [ ] Add ability to edit task content
- [ ] Add persistence for kanban board state (localStorage or backend)
- [ ] Add color coding for different task types
- [ ] Improve mobile responsiveness
