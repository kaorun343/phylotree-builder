# Application Modes

This document describes the two primary modes of the phylogenetic tree builder application and their distinct functionalities.

## Mode Overview

The application supports two distinct modes that provide different user experiences:

1. **Author Mode** - Interactive editing and tree construction
2. **Presentation Mode** - Clean output view optimized for sharing and export

## Author Mode (Current Implementation)

Author mode is the primary working environment where users create, modify, and refine phylogenetic trees.

### Key Features

- **Interactive Node Editing**: Click nodes to select and edit their properties
- **Branch Manipulation**: Select branches to modify length, color, and relationships
- **Visual Feedback**: Node circles are displayed for easy selection and identification
- **Contextual Side Panel**: Shows different editors based on current selection:
  - **Tree Editor**: Canvas settings (dimensions, margins, root branch)
  - **Node Editor**: Node properties (name, information, actions)
  - **Branch Editor**: Branch properties (length, color, operations)

### Visual Elements

- **Node Circles**: Visible indicators for all nodes
  - Leaf nodes: Green circles (radius 6)
  - Internal nodes: Blue circles (radius 4)
  - Selected nodes: Larger with orange dashed rings
- **Interactive Controls**: Full editing capabilities in side panel
- **Selection Indicators**: Orange highlighting for active elements

### User Interactions

- **Click**: Select nodes or branches
- **Ctrl+Click**: Add new leaf nodes
- **Branch Operations**: Split, modify length/color, remove
- **Node Operations**: Edit names, remove nodes, reset properties

## Presentation Mode (Planned Implementation)

Presentation mode provides a clean, publication-ready view of the phylogenetic tree optimized for sharing and export.

### Key Features

- **Clean Visual Output**: Removes editing artifacts for professional presentation
- **Export Functionality**: Side panel contains download options
- **Simplified Interface**: Focus on tree visualization without editing distractions

### Visual Elements

- **No Node Circles**: Clean appearance without selection indicators
- **Streamlined Tree**: Only essential visual elements (branches, labels)
- **Export-Optimized**: Appearance suitable for publications and presentations

### Side Panel Content

- **Download Options**:
  - **SVG Export**: Vector format for scalable graphics
  - **PNG Export**: Raster format for general use
  - **Additional formats**: Newick, PDF, or other scientific formats

### User Experience

- **Read-Only**: No editing capabilities to prevent accidental changes
- **Focus on Output**: Optimized for final presentation and sharing
- **Quick Export**: Streamlined workflow for generating publication-ready figures

## Mode Comparison

| Feature              | Author Mode         | Presentation Mode  |
| -------------------- | ------------------- | ------------------ |
| Node Circles         | ✓ Visible           | ✗ Hidden           |
| Interactive Editing  | ✓ Full editing      | ✗ Read-only        |
| Side Panel           | Contextual editors  | Download options   |
| Selection Indicators | ✓ Orange highlights | ✗ Clean appearance |
| Export Features      | ✗ Not available     | ✓ Multiple formats |
| Purpose              | Tree construction   | Final presentation |

## Implementation Notes

### Current State

- Author mode is fully implemented with contextual editing
- Presentation mode requires implementation of:
  - Mode toggle functionality
  - Export/download features
  - Visual state management (hiding node circles)
  - Side panel content switching

### Technical Considerations

- Mode state should be managed at the application level
- Visual elements need conditional rendering based on mode
- Export functionality requires integration with file system APIs
- Side panel content should be dynamically switched based on mode

## User Workflow

1. **Author Mode**: Create and refine phylogenetic tree
2. **Mode Switch**: Toggle to presentation mode when ready
3. **Presentation Mode**: Review final appearance and export as needed
4. **Return to Author**: Switch back for additional edits

This dual-mode approach provides the flexibility of interactive editing while ensuring clean, professional output for scientific publications and presentations.
