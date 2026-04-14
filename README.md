# Zest Dark Theme

A semantic dark theme for VS Code where each hue family has a single job: identify names, reveal structure, and separate data.

## Design System

This theme is built around three color families plus grayscale.

### Color Legend

| Family | Shades                          | Meaning                    | Applied to                                                                                             |
| ------ | ------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------ |
| Green  | #B8E8C8 #98D0A8 #80C098 #68A880 | Identifiers (named things) | Function definitions (brightest), function calls (bold), variables, parameters (italic)                |
| Purple | #C8B0E0 #A898C8 #8878A8 #D078A8 | Structure and control      | Types, interfaces, keywords, type parameters (italic), decorators (bold italic)                        |
| Amber  | #E0C898 #C8A878 #A89068         | Data and properties        | Constants (brightest), properties, object keys, numbers                                                |
| Gray   | #505550 #585D58 #686D68 #787D78 | Invisible plumbing         | Comments (italic), punctuation, operators, brackets, angle brackets, separators, quote marks, booleans |

### Font Style Legend

- Regular: Default information.
- Italic: Referring to something (parameters, this or super, type parameters, namespaces, comments).
- Bold: Action is happening (function calls).
- Bold italic: Meta-level annotation (decorators).

## Reading Model

Every visible difference in color indicates a distinct semantic role. Structural noise is intentionally dimmed into gray so your eyes can track only three channels at speed:

- Identifiers
- Structure and control
- Data

## Install

### VSIX

1. Run: npm install -g @vscode/vsce
2. Run: vsce package
3. Run: code --install-extension zest-theme-1.0.0.vsix

### Marketplace

Search for Zest Dark by tasteink in the VS Code Extensions panel.

## Build

From this folder, run: vsce package

## Author

tasteink
