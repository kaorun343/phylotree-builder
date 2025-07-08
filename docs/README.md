# PhyloTree Builder Documentation

This directory contains comprehensive documentation for the PhyloTree Builder application, a modern phylogenetic tree visualization and editing tool built with Angular.

## Documentation Structure

### 📝 General Documentation

- **[Application Modes](application-modes.md)** - Overview of Author and Presentation modes
- **[Layout](general/layout.md)** - Application layout and responsive design
- **[Tree Operations](general/tree-operations.md)** - Complete reference for tree manipulation

### ✏️ Author Mode Documentation

- **[Editor Panel](author-mode/editor-panel.md)** - Context-sensitive editing interface
- **[User Interactions](author-mode/interactions.md)** - Click behaviors and keyboard shortcuts

### 📊 Presentation Mode Documentation

- **[Export Features](presentation-mode/export-features.md)** - Export capabilities and formats

## Quick Start

### Author Mode

The primary working environment for creating and editing phylogenetic trees:

- **Interactive editing**: Click nodes and branches to modify properties
- **Context-sensitive panel**: Editor changes based on current selection
- **Real-time updates**: Immediate visual feedback for all changes

### Presentation Mode

Clean output view optimized for sharing and publication:

- **Export-ready appearance**: Removes editing artifacts
- **Multiple formats**: SVG, PNG, and Newick export options
- **Publication quality**: High-resolution output suitable for research

## Key Features

### Current Implementation

- ✅ **Author Mode**: Full interactive editing capabilities
- ✅ **Node Operations**: Add, remove, rename, and modify nodes
- ✅ **Branch Operations**: Adjust lengths, colors, and topology
- ✅ **Real-time Editing**: Instant visual feedback
- ✅ **Responsive Design**: Works on desktop and mobile devices

### Planned Features

- 🔄 **Presentation Mode**: Export-optimized view
- 🔄 **Export System**: Multiple format support
- 🔄 **Import Capabilities**: Load trees from various formats
- 🔄 **Undo/Redo**: Operation history management

## Application Architecture

### Core Components

- **TreeViewer**: SVG-based tree visualization with D3.js
- **EditorPanel**: Context-sensitive editing interface
- **TreeService**: Tree data management and operations
- **SvgSettingsService**: Canvas and display configuration

### Technology Stack

- **Angular 20**: Modern framework with standalone components
- **D3.js**: Tree layout and mathematical calculations
- **Angular Material**: UI components and theming
- **TypeScript**: Type-safe development
- **SVG**: Scalable vector graphics for tree display

## Development Notes

### File Structure

```
docs/
├── README.md                           # This file
├── application-modes.md                # Mode overview
├── general/
│   ├── layout.md                      # Application layout
│   └── tree-operations.md             # Tree manipulation reference
├── author-mode/
│   ├── editor-panel.md                # Editor interface
│   └── interactions.md                # User interactions
└── presentation-mode/
    └── export-features.md             # Export capabilities
```

### Documentation Guidelines

- **Mode-specific**: Documentation separated by application mode
- **Comprehensive**: Complete feature coverage with examples
- **Implementation-focused**: Reflects actual current capabilities
- **Future-ready**: Includes planned features and enhancements

## Contributing

When adding new features or modifying existing functionality:

1. Update relevant documentation files
2. Add new files to appropriate mode directories
3. Update this README with new features
4. Include examples and implementation notes

## Related Files

- **[CLAUDE.md](../CLAUDE.md)** - Development instructions for Claude Code
- **[Source Code](../src/)** - Application implementation
- **[Tests](../src/)** - Test specifications
