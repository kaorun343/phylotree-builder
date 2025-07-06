# User Interaction Design

## Tree Node Interactions

### Default Click Behavior

- **All nodes**: Select/deselect for visual feedback

### Modifier Key Actions

- **Ctrl/Cmd + Click**: Add new leaf node to clicked node (if internal)
- **Shift + Click**: Remove the clicked node (any node type)

### Touch-Friendly UI (Future)

- **Remove Mode Toggle**: Button to enable removal mode for touch devices
- **Visual Mode Indicator**: Shows current interaction mode

## Implementation

```typescript
onNodeClick(node: VisualNode, event: MouseEvent): void {
  if (event.shiftKey) {
    this.removeNode(node.id);
  } else if (event.ctrlKey || event.metaKey) {
    if (!node.isLeaf) {
      this.treeService.addLeafToInternal(node.id);
    }
  } else {
    this.toggleSelection(node.id);
  }
}
```

## Summary

| Action               | Leaf Node       | Internal Node     |
| -------------------- | --------------- | ----------------- |
| **Click**            | Select/deselect | Select/deselect   |
| **Ctrl/Cmd + Click** | No action       | Add new leaf      |
| **Shift + Click**    | Remove          | Remove            |
