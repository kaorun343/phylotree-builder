# Author Mode: User Interactions

## Tree Node Interactions

### Click Behavior

- **All nodes**: Select/deselect for visual feedback and editor panel activation
- **Visual selection**: Orange dashed rings with subtle animation around selected nodes

### Modifier Key Actions

- **Ctrl/Cmd + Click**: Add new leaf node to clicked node (internal nodes only)
- **No action on leaf nodes**: Ctrl+Click has no effect on leaf nodes

### Node Visual States

- **Leaf nodes**: Green circles (radius 6), larger when selected
- **Internal nodes**: Blue circles (radius 4), larger when selected
- **Selected nodes**: Orange dashed selection rings with animation

## Branch Interactions

### Click Behavior

- **Branch selection**: Click on branch paths to select and edit
- **Visual feedback**: Orange highlighting on hover and selection

### Branch Operations

- **Split branch**: Insert intermediate node via editor panel
- **Modify properties**: Length, color adjustments through editor
- **Remove branch**: Delete branch and associated subtree

## Implementation Details

```typescript
onNodeClick(node: VisualNode, event: MouseEvent): void {
  if (event.ctrlKey || event.metaKey) {
    if (!node.isLeaf) {
      this.treeService.addLeafToInternal(node.id);
    }
  } else {
    this.toggleSelection(node.id);
  }
}
```

## Interactive Features Summary

| Action               | Leaf Node       | Internal Node   |
| -------------------- | --------------- | --------------- |
| **Click**            | Select/deselect | Select/deselect |
| **Ctrl/Cmd + Click** | No action       | Add new leaf    |
| **Branch Click**     | Select branch   | Select branch   |

## User Experience Notes

- **Immediate feedback**: All interactions provide instant visual response
- **Contextual editing**: Editor panel updates based on current selection
- **Touch-friendly**: All interactive elements sized for touch devices
- **Keyboard accessible**: Focus management and keyboard navigation support
