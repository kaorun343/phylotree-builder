# Global Layout Description

## Overview

This document describes the global layout structure for the PhyloTree Builder application.

## Layout Structure

### Header

- Application title/logo
- Navigation menu (if applicable)
- User actions/controls

### Main Content Area

The main content area consists of two primary panes:

#### Main Pane Component

- **Primary Purpose**: Displays the phylogenetic tree as SVG (preferred over canvas)
- **Interactive Features**:
  - Clickable edges and nodes for selection
  - Draggable nodes and edges for repositioning
  - Visual feedback for selected elements
  - Pan and zoom capabilities
- **Rendering**: SVG-based for scalability and precision
- **Performance**: Optimized for large tree structures

#### Editor Pane Component

- **Primary Purpose**: Edit properties of selected edges and nodes
- **Editable Properties**:
  - Branch length values
  - Node names and labels
  - Branch names and annotations
  - Colors for nodes and edges
  - Node shapes and sizes
  - Branch styles and thickness
- **UI Features**:
  - Form controls for property editing
  - Color picker for visual elements
  - Real-time preview of changes
  - Undo/redo functionality
- **Layout**: Collapsible panel that can be docked or floating

### Sidebar (Optional)

- Tree structure explorer
- Settings panel
- Data management tools

### Footer

- Status information
- Export/save options
- Application metadata

## Component Hierarchy

```
App (Root)
├── Header Component
├── Main Layout Component
│   ├── Main Pane Component (SVG Tree Visualization)
│   ├── Editor Pane Component (Property Editor)
│   └── Sidebar Component (optional)
└── Footer Component
```

## Responsive Design

- Mobile-first approach
- Collapsible sidebar for smaller screens
- Flexible content area sizing
- Touch-friendly controls

## Material Design Integration

- Angular Material components for consistent UI
- Azure Blue theme
- Proper spacing and typography
- Accessibility features

## Notes

- Layout should accommodate complex tree visualizations
- Consider performance for large datasets
- Provide clear visual hierarchy
- Support both light and dark themes (future enhancement)
