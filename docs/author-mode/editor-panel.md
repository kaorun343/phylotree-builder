# Author Mode: Editor Panel

## Overview

The Editor Panel is the right pane in Author Mode that provides context-sensitive editing capabilities based on the current selection state in the tree view. It displays different editors depending on what is selected in the tree visualization.

## Panel States

### 1. Node Editor

**Trigger**: When a node is selected in the tree view  
**Purpose**: Edit properties of individual nodes

#### Features:

- Node identification (ID, type: leaf/internal)
- Node statistics (depth, children count, parent status)
- Editable properties:
  - Node name/label
- Node-specific actions:
  - Delete node
  - Reset node name

#### UI Components:

- Node information card with type indicator
- Statistics display showing node metrics
- Form fields for editable properties
- Action buttons for node operations

### 2. Branch Editor

**Trigger**: When a branch (edge) is selected in the tree view  
**Purpose**: Edit properties of branches/edges between nodes

#### Features:

- Branch identification (parent → child relationship)
- Editable properties:
  - Branch length (with integer step validation)
  - Branch color
- Branch-specific actions:
  - Split branch (insert intermediate node)
  - Reset branch length and color
  - Remove branch

#### UI Components:

- Branch information showing connected nodes
- Form fields for branch properties
- Color picker for branch styling
- Action buttons for branch operations

### 3. Tree Editor (Default)

**Trigger**: When nothing is selected (default state)  
**Purpose**: Global tree and canvas settings

#### Features:

- **SVG Canvas Settings**:
  - Canvas width and height
  - Canvas margins (top, right, bottom, left)
  - Root branch length (pixel-based)
  - Real-time dimension updates
  - Reset to defaults functionality

#### UI Components:

- Canvas dimension form fields with validation
- Margin controls for layout spacing
- Root branch length slider
- Reset to defaults button

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

1. Node selection takes precedence
2. Branch selection clears node selection
3. Clicking empty space clears all selections

## Interactive Features

### Node Interactions

- **Click**: Select/deselect nodes
- **Ctrl+Click**: Add new leaf nodes to selected internal nodes
- **Visual feedback**: Selected nodes show orange dashed rings with animation

### Branch Interactions

- **Click**: Select branches for editing
- **Hover effects**: Orange highlighting on mouseover
- **Branch operations**: Split, modify, remove through editor panel

## Data Flow

1. Tree viewer component handles click events
2. Selection state updated in TreeService
3. Editor panel reacts to state changes via computed signals
4. Form changes trigger tree updates through service
5. Tree viewer reflects updated data immediately

## Responsive Behavior

- **Desktop**: Fixed 300px width right panel
- **Mobile**: Maintained width with scrollable content
- **Touch-friendly**: All controls sized for touch interaction
