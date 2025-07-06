# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a phylogenetic tree builder application built with Angular 20. The project follows Angular's standalone component architecture using the new zoneless change detection and modern Angular features.

## Key Commands

- **Development server**: `ng serve` or `yarn start` (serves at http://localhost:4200)
- **Build**: `ng build` or `yarn build` (outputs to `dist/`)
- **Watch mode**: `ng build --watch --configuration development` or `yarn watch`
- **Tests**: `ng test` or `yarn test` (runs Karma/Jasmine tests)
- **Generate components**: `ng generate component component-name`

## Architecture

- **Main application**: Bootstrap happens in `src/main.ts` → `src/app/app.ts`
- **Configuration**: Application config is in `src/app/app.config.ts` with zoneless change detection enabled
- **Routing**: Routes are defined in `src/app/app.routes.ts` (currently empty)
- **Styling**: Global styles in `src/styles.css`, component styles co-located with components
- **TypeScript**: Strict mode enabled with Angular-specific compiler options
- **Documentation**: Design docs and specifications in `docs/` directory

## Development Notes

- Uses Angular 20 with standalone components (no NgModules)
- Zoneless change detection is enabled (`provideZonelessChangeDetection()`)
- Package manager is Yarn (specified in package.json)
- Prettier is configured for HTML files with Angular parser
- TypeScript is configured with strict settings and Angular-specific options
- Build budgets are set: 500kB warning/1MB error for initial bundle, 4kB warning/8kB error for component styles
