# Tree Modification Operations

## Overview

This document describes the available operations for modifying phylogenetic trees in the PhyloTree Builder application. These operations allow users to interactively edit tree topology, node properties, and branch characteristics.

## Newick Format Basics

The Newick format represents phylogenetic trees as nested parentheses with branch lengths and node labels:

- `(A,B,C);` - Simple tree with three leaves
- `(A:0.1,B:0.2):0.05;` - Tree with branch lengths
- `((A,B)internal:0.1,C):0.05;` - Tree with internal node labels
- `((A,B)0.95:0.1,C):0.05;` - Tree with support values

## Tree Operations with Newick Examples

## Node Operations

### Add Node

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

**Add Subtree**: Insert a pre-existing subtree (single operation)

```
Original: (A,B);
Add single subtree: (A,B,(X,Y));
Note: Subtree must be created separately or imported
```

### Remove Node

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

**Prune Branch**: Remove branch and descendants

```
Original: (((A,B),C),D);
Prune (A,B): (C,D);
```

### Node Properties

**Rename Node**: Change node labels

```
Original: (A,B,C);
Rename A to Species1: (Species1,B,C);
```

**Add Node Annotation**: Include metadata (extended Newick)

```
Original: (A,B,C);
Add color: (A[&color="red"],B[&color="blue"],C);
```

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

**Note**: Tree-wide operations like normalization would require multiple individual operations

**Note**: Converting to ultrametric would require adjusting multiple branches individually

### Branch Properties

**Branch Support Values**: Add bootstrap/posterior probabilities

```
Original: ((A,B),C);
Add support: ((A,B)0.95,C);
Add detailed: ((A,B)0.95:0.1,C)1.0:0.05;
```

**Branch Labels**: Add text labels to branches

```
Original: (A:0.1,B:0.1);
Add labels: (A:0.1"branch_to_A",B:0.1"branch_to_B");
```

## Tree Structure Operations

### Topology Modification

**Swap Subtrees**: Exchange positions of subtrees

```
Original: ((A,B),(C,D));
Swap subtrees: ((C,D),(A,B));
```

**Rotate Node**: Change order of children

```
Original: (A,B,C);
Rotate: (C,A,B);
Rotate: (B,C,A);
```

**Reroot Tree**: Change root position

```
Original: ((A,B),(C,D));
Reroot at C: (((A,B),D),C);
Reroot on branch: ((A,B),((C,D),root));
```

**Collapse Node**: Create polytomies

```
Original: ((A,B):0.1,C):0.2;
Collapse internal: (A,B,C);
Collapse with lengths: (A:0.3,B:0.3,C:0.2);
```

**Resolve Polytomy**: Convert to binary

```
Original: (A,B,C,D);
Resolve: (((A,B),C),D);
Alternative: ((A,B),(C,D));
```

### Tree Transformation

**Ladderize Tree**: Sort by subtree size

```
Original: ((A,(B,C)),D);
Ladderized: (D,(A,(B,C)));
```

**Mirror Tree**: Flip subtree order

```
Original: ((A,B),(C,D));
Mirrored: ((C,D),(A,B));
```

## Advanced Operations

### Subtree Manipulation

**Cut Subtree**: Remove for later insertion

```
Original: ((A,B),(C,D),E);
Cut (C,D): ((A,B),E); // (C,D) stored in clipboard
```

**Copy Subtree**: Duplicate structure

```
Original: ((A,B),C);
Copy (A,B): ((A,B),C); // (A,B) copied to clipboard
```

**Paste Subtree**: Insert copied/cut subtree

```
Tree: (X,Y);
Paste (A,B): ((A,B),X,Y);
```

**Graft Subtree**: Attach to new location

```
Tree1: ((A,B),C);
Tree2: (X,Y);
Graft Tree2 to Tree1: (((A,B),C),(X,Y));
```

### Individual Operations Only

**Note**: All operations are performed on individual nodes/branches one at a time. Batch operations are not supported.

**Single Node Rename**: Rename one node at a time

```
Original: (species1,species2,species3);
Rename one: (Genus_species1,species2,species3);
```

**Single Branch Length Edit**: Modify one branch at a time

```
Original: (A:0.1,B:0.2,C:0.3);
Edit one branch: (A:0.05,B:0.2,C:0.3);
```

## Complex Newick Examples

### Extended Newick with Annotations

```
// Tree with colors, support values, and comments
((A[&color="red"]:0.1,B[&color="blue"]:0.2)0.95[&note="well-supported"]:0.05,
 (C:0.15,D:0.18)0.87:0.03)1.0:0.0;
```

### Tree with Multiple Data Types

```
// Branch lengths, support values, node names, and confidence
((Homo_sapiens:0.024,Pan_troglodytes:0.028)Homininae:0.012,
 Gorilla_gorilla:0.036)0.98:0.015;
```

### Polytomy Examples

```
// Unresolved polytomy
(A,B,C,D,E);

// Partially resolved
((A,B),C,D,E);

// Soft polytomy with branch lengths
(A:0.1,B:0.1,C:0.1,D:0.1):0.05;
```

### Time-calibrated Trees

```
// Ultrametric tree with absolute time
((A:65,B:65):35,C:100)[&age=100];
```

## Interactive Operations

### Selection and Editing

- **Select Node**: Click to select individual nodes (one at a time)
- **Select Subtree**: Select entire subtrees (for single operations like move/delete)
- **Note**: Multi-selection is for display purposes only; operations affect one element at a time

### Drag and Drop

- **Drag Node**: Move nodes to new positions
- **Drag Branch**: Adjust branch positions
- **Drag Subtree**: Relocate entire subtrees
- **Snap to Grid**: Align nodes to invisible grid lines

## Validation and Constraints

### Tree Integrity

- **Validate Tree Structure**: Ensure tree remains valid after operations
- **Check Connectivity**: Verify all nodes remain connected
- **Branch Length Validation**: Ensure positive branch lengths
- **Node Naming Constraints**: Validate unique node names if required

### Operation Restrictions

- **Preserve Root**: Maintain tree root unless explicitly rerooting
- **Minimum Nodes**: Ensure tree maintains minimum required nodes
- **Maximum Depth**: Limit tree depth to prevent performance issues
- **Leaf Node Protection**: Prevent accidental deletion of important taxa

## Undo/Redo System

### History Management

- **Undo Operation**: Reverse the last modification
- **Redo Operation**: Reapply a previously undone operation
- **Operation History**: View list of all performed operations
- **Checkpoint System**: Create save points for complex editing sessions

### Batch Undo

- **Undo Multiple**: Reverse several operations at once
- **Selective Undo**: Undo specific operations from history
- **Reset to Checkpoint**: Return to a previously saved state

## Import/Export Operations

### Tree Import

- **Load from File**: Import trees from Newick, NEXUS, or PhyloXML formats
- **Parse Text**: Convert text-based tree representations
- **Merge Trees**: Combine multiple trees into one

### Tree Export

- **Save Tree**: Export in various formats (Newick, NEXUS, PhyloXML)
- **Export Image**: Save tree as SVG, PNG, or PDF
- **Export Data**: Extract node and branch data to CSV/JSON

## Performance Considerations

### Large Trees

- **Lazy Loading**: Load tree sections on demand
- **Level of Detail**: Simplify display for large trees
- **Progressive Enhancement**: Add details as user zooms in
- **Memory Management**: Efficient handling of large datasets

### Real-time Updates

- **Incremental Rendering**: Update only changed portions
- **Debounced Operations**: Batch rapid successive changes
- **Background Processing**: Handle complex operations asynchronously

## User Interface Integration

### Context Menus

- **Right-click Operations**: Access common operations via context menu
- **Node-specific Actions**: Show relevant operations for selected nodes
- **Branch-specific Actions**: Display branch-related operations

### Keyboard Shortcuts

- **Delete Key**: Remove selected nodes
- **Ctrl+Z/Y**: Undo/Redo operations
- **Ctrl+A**: Select all nodes
- **Arrow Keys**: Navigate tree structure

## Error Handling

### Operation Failures

- **Validation Errors**: Clear messages for invalid operations
- **Graceful Degradation**: Maintain tree integrity on failures
- **Error Recovery**: Suggest alternative operations when possible
- **User Feedback**: Provide clear error messages and solutions
