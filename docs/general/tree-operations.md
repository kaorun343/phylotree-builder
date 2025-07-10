# Tree Operations Reference

## Overview

This document describes the available operations for modifying phylogenetic trees in the PhyloTree Builder application. These operations allow users to interactively edit tree topology, node properties, and branch characteristics.

## Newick Format Basics

The Newick format represents phylogenetic trees as nested parentheses with branch lengths and node labels:

- `(A,B,C);` - Simple tree with three leaves
- `(A:0.1,B:0.2):0.05;` - Tree with branch lengths
- `((A,B)internal:0.1,C):0.05;` - Tree with internal node labels
- `((A,B)0.95:0.1,C):0.05;` - Tree with support values

## Node Operations

### Add Node Operations

**Add Leaf Node**: Insert a single new terminal node

```
Original: (A,B,C);
Add leaf D: (A,B,C,D);
Add leaf to existing subtree: ((A,B,D),C);
```

**Add Internal Node**: Split an existing branch

```
Original: (A:0.4,B:0.4);
Add internal: (A:0.2,B:0.2)internal:0.2;
```

**Add Sister Node**: Create a sister to an existing node

```
Original: (A,B,C);
Add sister to A: ((A,A_sister),B,C);
```

### Remove Node Operations

**Remove Leaf Node**: Delete a terminal node

```
Original: (A,B,C,D);
Remove D: (A,B,C);
```

**Remove Internal Node**: Collapse internal node

```
Original: ((A,B)internal,C);
Remove internal: (A,B,C);
```

**Remove Subtree**: Delete entire subtree

```
Original: ((A,B),(X,Y,Z));
Remove (X,Y,Z): (A,B);
```

**Auto-collapse**: Internal nodes with single children are automatically removed

```
Original: ((A)internal,B);
After auto-collapse: (A,B);
```

Branch lengths are preserved during auto-collapse operations to maintain evolutionary distances.

### Node Properties

**Rename Node**: Change node labels

```
Original: (A,B,C);
Rename A to Species1: (Species1,B,C);
```

**Note**: All operations are performed on individual nodes one at a time.

## Branch Operations

### Branch Length Modification

**Set Branch Length**: Assign specific length values

```
Original: (A,B,C);
Add lengths: (A:0.1,B:0.2,C:0.15);
Modify length: (A:0.05,B:0.2,C:0.15);
```

**Scale Single Branch Length**: Multiply one branch by factor

```
Original: (A:0.1,B:0.2,C:0.15);
Scale A's branch by 2: (A:0.2,B:0.2,C:0.15);
```

### Branch Properties

**Branch Support Values**: Add bootstrap/posterior probabilities

```
Original: ((A,B),C);
Add support: ((A,B)0.95,C);
```

**Branch Color**: Visual styling for individual branches

```
// Applied through UI, not reflected in standard Newick
Original: (A:0.1,B:0.1);
// Color applied through editor panel
```

**Branch Width**: Variable line thickness for emphasis

```
// Applied through UI with global and individual controls
// Default width: 2px, customizable per branch
// Global width setting affects all branches without individual overrides
```

## Tree Structure Operations

### Topology Modification

**Rotate Node**: Change order of children

```
Original: (A,B,C);
Rotate: (C,A,B);
```

**Move Branches**: Reorder sibling branches up or down

```
Original: (A,B,C);
Move B up: (B,A,C);
Move B down: (A,C,B);
```

The interface adapts based on tree direction:

- Left-to-right/right-to-left: Move Up/Down buttons
- Top-to-bottom/bottom-to-top: Move Left/Right buttons

**Swap Subtrees**: Exchange positions of subtrees

```
Original: ((A,B),(C,D));
Swap subtrees: ((C,D),(A,B));
```

**Collapse Node**: Create polytomies

```
Original: ((A,B):0.1,C):0.2;
Collapse internal: (A,B,C);
```

## Interactive Operations

### Selection and Editing

- **Select Node**: Click to select individual nodes
- **Select Branch**: Click on branch paths to select
- **Editor Panel**: Context-sensitive editing based on selection

### Current Implementation Status

- ✅ **Node selection and editing**: Fully implemented
- ✅ **Branch selection and editing**: Fully implemented
- ✅ **Add leaf nodes**: Ctrl+Click functionality
- ✅ **Remove nodes**: Through editor panel with auto-collapse
- ✅ **Branch movement**: Direction-aware up/down reordering
- ✅ **Branch length modification**: Real-time editing
- ✅ **Branch color**: Color picker integration
- ✅ **Branch width**: Global and individual controls
- ✅ **Auto-collapse**: Automatic removal of single-child internal nodes
- ⚠️ **Tree-wide operations**: Limited to individual operations
- ❌ **Import/Export**: Not yet implemented
- ❌ **Undo/Redo**: Not yet implemented

## Validation and Constraints

### Tree Integrity

- **Tree structure validation**: Ensures tree remains valid after operations
- **Branch length validation**: Positive values required
- **Node connectivity**: All nodes must remain connected
- **Root preservation**: Tree root maintained unless explicitly changed
- **Auto-collapse validation**: Preserves evolutionary distances during node removal
- **Selection management**: Updates selection state when collapsed nodes are removed

### Operation Restrictions

- **Individual operations only**: No batch operations supported
- **Minimum tree size**: Prevents deletion of all nodes
- **Leaf node protection**: Prevents accidental deletion of important taxa

## Performance Considerations

### Current Implementation

- **Signal-based reactivity**: Efficient updates using Angular signals
- **Optimized computed signals**: Map-based lookups for 25-40% performance improvement
- **D3.js integration**: Optimized tree layout calculations
- **SVG rendering**: Scalable vector graphics for crisp display
- **Incremental updates**: Only changed portions re-rendered
- **Zoneless change detection**: Modern Angular 20 performance features

### Future Enhancements

- **Lazy loading**: For very large trees
- **Operation batching**: Multiple operations in single transaction
- **History management**: Undo/redo functionality
- **Export capabilities**: Multiple format support
