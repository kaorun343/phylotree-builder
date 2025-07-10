# PhyloTree Builder

An interactive web application designed primarily for creating educational phylogenetic tree figures and teaching the concepts of phylogenetic relationships.

## 📚 Purpose

PhyloTree Builder is specifically designed for **educational purposes** to help teach phylogenetic concepts and create illustrative tree diagrams. Perfect for:

- **Instructors** creating teaching materials
- **Students** learning about evolutionary relationships
- **Anyone** who needs to illustrate phylogenetic tree structures and concepts rather than present actual research data

While the tool can handle real data, its strength lies in making it easy to create clear, customizable tree figures for educational content, presentations, and conceptual explanations.

## ✨ Key Features

- **Interactive Editing:** Click to select nodes and branches for real-time editing
- **Visual Customization:** Adjust branch lengths, colors, and widths
- **Tree Operations:** Add/remove nodes, move branches, and auto-collapse structures
- **Multiple Layouts:** Support for 4-directional tree orientations
- **Dual Modes:** Author mode for editing and Presentation mode for clean display
- **Export Options:** Save trees as SVG or PNG images

## 🚀 Getting Started

1. Switch to **Author mode** to begin editing
2. Click on nodes or branches to select and edit them
3. Use Ctrl+Click on branches to add new leaf nodes
4. Adjust tree direction and visual settings as needed
5. Switch to **Presentation mode** for clean viewing

## 🛠️ Built With

- Angular 20 with standalone components
- Angular Material UI
- D3.js for tree layout algorithms
- TypeScript with strict mode
- Zoneless change detection for optimal performance

## 💻 Development

### Prerequisites

- Node.js (Latest LTS version)
- Yarn package manager

### Development Server

To start a local development server:

```bash
yarn start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you modify source files.

### Building

To build the project:

```bash
yarn build
# or
ng build
```

Build artifacts will be stored in the `dist/` directory.

### Testing

To execute unit tests:

```bash
yarn test
# or
ng test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The MIT License allows you to use, modify, and distribute this software freely, making it perfect for educational institutions and open science initiatives.

## 🤝 Contributing

Contributions are welcome! This tool is designed to support phylogenetic education, so improvements that enhance its educational value are especially appreciated.

## 📚 Additional Resources

- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
- [D3.js Documentation](https://d3js.org/)
- [Angular Material Components](https://material.angular.io/)
