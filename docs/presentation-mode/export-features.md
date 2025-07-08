# Presentation Mode: Export Features

## Overview

Presentation Mode provides a clean, publication-ready view of phylogenetic trees with comprehensive export capabilities. The right panel transforms from editing controls to export options, enabling users to generate publication-quality outputs.

## Export Panel Features

### Download Options

#### Vector Formats

- **SVG Export**: Scalable vector graphics for publications
  - Maintains full quality at any size
  - Editable in vector graphics software
  - Suitable for scientific publications
  - Preserves all styling and colors

#### Raster Formats

- **PNG Export**: High-quality raster images
  - Configurable resolution (72-300 DPI)
  - Transparent background option
  - Suitable for presentations and web use
  - Multiple size presets available

#### Data Formats

- **Newick Format**: Standard phylogenetic tree format
  - Includes branch lengths and node labels
  - Compatible with other phylogenetic software
  - Lightweight text-based format
  - Preserves tree topology and measurements

### Export Configuration

#### Image Settings

- **Resolution**: 72, 150, 300 DPI options
- **Dimensions**: Custom width/height or preset sizes
- **Background**: Transparent or white background
- **Margins**: Configurable padding around tree

#### Tree Appearance

- **Clean rendering**: No editing artifacts
- **Node circles**: Hidden for clean presentation
- **Branch styling**: Preserved colors and styling
- **Label positioning**: Optimized for readability

## Visual Differences from Author Mode

### Simplified Interface

- **No node circles**: Clean appearance without selection indicators
- **No hover effects**: Static display optimized for output
- **No selection highlights**: Removes interactive visual elements
- **Streamlined styling**: Focus on tree structure and data

### Export-Optimized Rendering

- **High-quality output**: Crisp lines and text at any resolution
- **Consistent styling**: Uniform appearance across export formats
- **Proper scaling**: Maintains proportions in different output sizes
- **Font optimization**: Readable text at various scales

## User Workflow

### Export Process

1. **Switch to Presentation Mode**: Toggle from Author Mode
2. **Review appearance**: Verify tree looks correct for export
3. **Select export format**: Choose appropriate format for use case
4. **Configure settings**: Adjust resolution, size, background as needed
5. **Generate export**: Download formatted file

### Quality Assurance

- **Preview functionality**: See exactly what will be exported
- **Resolution testing**: Preview at different sizes
- **Format validation**: Ensure output meets requirements
- **Quick iteration**: Easy to adjust settings and re-export

## Technical Implementation

### Export Pipeline

- **SVG source**: Base format for all exports
- **Vector preservation**: Maintains quality during format conversion
- **Batch processing**: Multiple formats simultaneously
- **File system integration**: Browser download APIs

### Performance Optimization

- **Efficient rendering**: Fast export generation
- **Memory management**: Handles large trees efficiently
- **Progressive enhancement**: Advanced features when supported
- **Error handling**: Graceful fallbacks for unsupported features

## Planned Features

### Additional Formats

- **PDF Export**: Publication-ready vector format
- **EPS Export**: PostScript format for scientific publishing
- **JSON Export**: Structured data format for developers

### Advanced Options

- **Batch export**: Multiple formats simultaneously
- **Template system**: Preset configurations for common use cases
- **Metadata inclusion**: Embed tree information in exports
- **Custom styling**: Export-specific appearance settings

## Integration Notes

### File System Access

- **Browser downloads**: Standard download folder integration
- **Filename generation**: Automatic naming with timestamps
- **Format extensions**: Appropriate file extensions for each format
- **Error handling**: Clear feedback for failed exports

### Cross-Platform Compatibility

- **Browser support**: Works across modern browsers
- **Operating system**: Compatible with Windows, Mac, Linux
- **Mobile support**: Touch-friendly export controls
- **Accessibility**: Screen reader compatible export options
