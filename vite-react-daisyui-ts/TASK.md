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

## Current Tasks

### Implement Tauri Desktop App (2025-10-22)

- [x] Install Tauri CLI and dependencies
- [x] Configure Tauri for the project
- [x] Create Tauri backend with CMD command execution capability
- [x] Create Terminal React component with CMD/PowerShell support
- [x] Add Terminal page to routing and navigation
- [x] Create unit tests for Terminal component
- [x] Add documentation for desktop app usage (TAURI_SETUP.md)
- [ ] Install Rust toolchain (user prerequisite - requires manual installation)
- [ ] Test desktop app build (requires Rust installation)
- [ ] Create unit tests for Rust commands (requires Rust installation)

### Implement Multiple Views Feature (2025-10-24)

- [x] Create new branch `features/multiple-views`
- [x] Design feature architecture with iframe-based view isolation
- [x] Create MultiViewGrid main component with state management
- [x] Create ViewContainer component for individual views
- [x] Create ControlPanel component with input, sliders, and buttons
- [x] Create DebugPanel component for view inspection
- [x] Define TypeScript types for views and components
- [x] Add routing and navigation integration
- [x] Create comprehensive unit tests
- [x] Add feature documentation (README.md)
- [ ] Test with actual URLs and applications
- [ ] Optimize performance for multiple views
- [ ] Add localStorage persistence for view configurations

## Future Enhancements

- [ ] Add ability to create new tasks
- [ ] Add ability to edit task content
- [ ] Add persistence for kanban board state (localStorage or backend)
- [ ] Add color coding for different task types
- [ ] Improve mobile responsiveness
