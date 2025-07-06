# Editor Panel Specification

## Overview

The Editor Panel is the right pane of the phylogenetic tree builder application. It provides context-sensitive editing capabilities based on the current selection state in the tree view. The panel displays different components depending on what is selected in the tree visualization.

## Panel States

### 1. Node Editor

**Trigger**: When a node is selected in the tree view
**Purpose**: Edit properties of individual nodes

#### Features:

- Node identification (ID, type: leaf/internal)
- Node statistics (depth, children count, parent status)
- Editable properties:
  - Node name/label
  - Branch length (distance to parent)
- Node-specific actions:
  - Delete node
  - Add child node (for internal nodes)
  - Move node

#### UI Components:

- Node information card with icon and type
- Statistics grid showing node metrics
- Form fields for editable properties
- Action buttons for node operations

### 2. Branch Editor

**Trigger**: When a branch (edge) is selected in the tree view
**Purpose**: Edit properties of branches/edges between nodes

#### Features:

- Branch identification (parent → child relationship)
- Editable properties:
  - Branch length
  - Branch support values
  - Branch labels/annotations
- Branch-specific actions:
  - Split branch (insert intermediate node)
  - Remove branch
  - Swap branches

#### UI Components:

- Branch information showing connected nodes
- Form fields for branch properties
- Visual branch representation
- Action buttons for branch operations

### 3. Tree/SVG Editor

**Trigger**: When nothing is selected (default state)
**Purpose**: Global tree and visualization settings

#### Features:

- **SVG Canvas Settings**:
  - Canvas width
  - Canvas height
  - Real-time dimension updates
  - Reset to defaults functionality
- Tree metadata:
  - Tree name/title
  - Tree description
  - Creation date
- Advanced visualization settings:
  - Zoom level
  - Layout algorithm (rectangular, circular, radial)
  - Color scheme
  - Node/branch styling
- Tree-wide operations:
  - Import/Export tree (Newick, Nexus formats)
  - Reset view
  - Auto-layout
  - Validate tree structure

#### UI Components:

- **SVG Settings Card** (implemented):
  - Canvas width/height form fields with validation
  - Current size display
  - Reset to defaults button
- Tree metadata form (future)
- Advanced visualization settings panel (future)
- Layout controls (future)
- Import/Export buttons (future)
- Global action buttons (future)

## Implementation Structure

```
EditorPanel (container)
├── NodeEditor (when node selected)
├── BranchEditor (when branch selected)
└── TreeEditor (when nothing selected - default)
```

## State Management

The editor panel state is managed through:

- `selectedNodeId`: string | null
- `selectedBranchId`: string | null
- `selectionType`: 'node' | 'branch' | 'none'

Selection priority:

1. Branch selection takes precedence over node selection
2. Node selection clears branch selection
3. Clicking empty space clears all selections

## Responsive Behavior

- **Desktop**: Fixed 300px width right panel
- **Tablet**: Collapsible panel, overlay on small screens
- **Mobile**: Full-width bottom sheet or modal

## Data Flow

1. Tree viewer component handles click events
2. Selection state updated in shared service
3. Editor panel reacts to state changes
4. Form changes trigger tree updates through service
5. Tree viewer reflects updated data

## Future Enhancements

- Undo/Redo functionality for edits
- Batch operations (multi-select)
- Custom node/branch annotations
- Advanced layout algorithms
- Real-time collaboration features
