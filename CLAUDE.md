Standard Workflow
1. First think through the problem, read the codebase for relevant files, and write a plan to todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, perform a code review of all changes and add a review section to the todo.md file with a summary of the changes you made and any other relevant information.

## Development Environment Notes

### Expo Go Setup
- Use `npx expo start --clear --tunnel` to run the development server
- The `--clear` flag clears the cache to avoid dependency conflicts
- The `--tunnel` flag enables tunneling for device testing
- Always test with Expo Go app on physical devices

### Dependency Management
- The project must maintain compatibility with Expo Go for development
- Avoid dependencies that require custom native code or ejecting from Expo
- When adding new dependencies, always use `expo install` rather than `npm install`
- Before adding any native modules, verify they're supported in Expo Go
- If dependency conflicts arise, clear cache with `--clear` flag first
- Document any Expo Go limitations that affect feature implementation

### Troubleshooting
- If experiencing dependency conflicts, run `npx expo start --clear --tunnel`
- Check that all dependencies are Expo Go compatible before installation
- Use `expo doctor` to diagnose common issues
