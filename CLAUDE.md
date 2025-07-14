# Standard Workflow
1. First think through the problem, read the codebase for relevant files, and write a plan to todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, perform a code review of all changes and add a review section to the todo.md file with a summary of the changes you made and any other relevant information.

## Mobile-Specific Guidelines
- Always test changes on both Android and iOS when possible
- Check Expo Development Builds compatibility before implementing any native features
- Verify app builds successfully after significant changes
- Consider performance impact on mobile devices
- Test UI changes on different screen sizes
- Remember this is an Expo Development Build project (EAS workflow)

## Expo Development Builds Considerations
- Use Expo SDK APIs when available instead of native alternatives
- Run `npx expo-doctor` after major dependency changes or when troubleshooting issues
- Run `npx expo-doctor` before finalizing any significant feature implementation
- Verify compatibility with current Expo SDK version
- Use `npx expo start` for development server (compatible with development builds)
- For builds, use `eas build` instead of `expo build` (this project uses EAS workflow)
- For OTA updates, use `eas update` instead of `expo publish`
- Check `eas.json` configuration when making build-related changes
- Native dependencies require rebuilding the development build with `eas build`
- If `npx expo-doctor` reports issues, address them before proceeding with additional changes

## Development Build Workflow Notes
- Code changes (JS/TS) can be tested immediately with hot reload
- Native dependency changes require a new development build
- Always verify that new packages are compatible with development builds
- Test thoroughly on the actual development build, not just Expo Go
- Consider impact on both debug and release builds

## Communication Preferences
- Provide build/test status updates after each major change
- Report `npx expo-doctor` results when run
- Flag any breaking changes or dependency updates immediately
- Mention if manual testing is recommended for specific features
- Specify if a new development build is needed after native dependency changes
- Note any EAS configuration changes that might be required

## Command Reference for This Project
- Development server: `npx expo start`
- Health check: `npx expo-doctor`
- Build development build: `eas build --profile development`
- Build preview: `eas build --profile preview`
- Build production: `eas build --profile production`
- Deploy OTA update: `eas update`
- Install EAS CLI: `npm install -g @expo/eas-cli`