# Application Layout

## Overview

The PhyloTree Builder application uses a responsive grid-based layout designed to provide optimal user experience across different devices and screen sizes.

## Layout Structure

### Header

- Application title and branding
- Navigation menu with File, Edit, View actions
- Action buttons: Save, Share, Settings
- Mode toggle (Author/Presentation) - _planned_

### Main Content Area

The main content area uses a two-pane layout:

#### Left Pane: Tree Visualization

- **Primary Purpose**: Interactive phylogenetic tree display
- **Technology**: SVG-based rendering for scalability and precision
- **Features**:
  - Pan and zoom capabilities
  - Click-to-select nodes and branches
  - Visual feedback for selections
  - Hover effects and animations
  - Responsive scaling

#### Right Pane: Context Panel

- **Width**: Fixed 300px on desktop
- **Content**: Mode-dependent functionality
  - **Author Mode**: Editor panels (Node/Branch/Tree editors)
  - **Presentation Mode**: Export and download options
- **Responsive**: Maintained width with scrollable content

### Footer

- Status information
- Application metadata
- Additional controls as needed

## Component Hierarchy

```
App (Root)
├── Header Component
│   ├── Navigation Menu
│   ├── Action Buttons
│   └── Mode Toggle (planned)
├── Main Layout Component
│   ├── Tree Viewer (SVG Visualization)
│   └── Context Panel
│       ├── Author Mode: Editor Panel
│       └── Presentation Mode: Export Panel (planned)
└── Footer Component
```

## Responsive Design

- **Mobile-first approach**: Optimized for touch interactions
- **Breakpoint strategy**: Adapts to different screen sizes
- **Touch-friendly controls**: All interactive elements sized appropriately
- **Flexible content sizing**: Tree visualization scales with available space

## Material Design Integration

- **Angular Material**: Consistent UI components and theming
- **Design tokens**: Standardized spacing, colors, and typography
- **Accessibility**: WCAG compliance and keyboard navigation
- **Theme support**: Light theme with planned dark theme support

## Performance Considerations

- **SVG optimization**: Efficient rendering for large trees
- **Lazy loading**: Planned for very large datasets
- **Smooth animations**: 60fps interactions and transitions
- **Memory efficiency**: Optimized for complex tree structures

## Layout Modes

### Author Mode Layout

- **Focus**: Interactive editing and tree construction
- **Right panel**: Context-sensitive editors
- **Visual elements**: Full editing interface with node circles and selection indicators

### Presentation Mode Layout

- **Focus**: Clean output presentation
- **Right panel**: Export and download options
- **Visual elements**: Simplified interface optimized for final output

## Technical Implementation

- **CSS Grid**: Modern layout system for responsive design
- **Angular CDK**: Layout utilities and responsive breakpoints
- **Signal-based updates**: Efficient DOM updates
- **Standalone components**: Modular architecture for maintainability
