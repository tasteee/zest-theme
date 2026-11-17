#!/usr/bin/env node

/**
 * VS Code to Zed Theme Converter
 *
 * This script converts VS Code theme JSON files to Zed theme format.
 *
 * Usage:
 *   bun run script.ts <dark-theme.json> [-l <light-theme.json>] [-o <output-path>]
 *
 * Arguments:
 *   <dark-theme.json>         Path to the VS Code dark theme JSON file (required)
 *   -l, --light <path>        Path to the VS Code light theme JSON file (optional)
 *   -o, --output <path>       Output path for the Zed theme file (optional)
 *
 * If -o is not provided, the theme will be saved in the current working directory.
 * If both dark and light themes are provided, they will be merged into a single
 * Zed theme file with both variants.
 */

import * as fs from "fs"
import * as path from "path"

// ============================================================================
// VS Code to Zed Color Mapping
// ============================================================================

const colorMapping = {
  // Terminal colors
  "terminal.background": "terminal.background",
  "terminal.foreground": "terminal.foreground",
  "terminal.ansiBlack": "terminal.ansi.black",
  "terminal.ansiRed": "terminal.ansi.red",
  "terminal.ansiGreen": "terminal.ansi.green",
  "terminal.ansiYellow": "terminal.ansi.yellow",
  "terminal.ansiBlue": "terminal.ansi.blue",
  "terminal.ansiMagenta": "terminal.ansi.magenta",
  "terminal.ansiCyan": "terminal.ansi.cyan",
  "terminal.ansiWhite": "terminal.ansi.white",
  "terminal.ansiBrightBlack": "terminal.ansi.bright_black",
  "terminal.ansiBrightRed": "terminal.ansi.bright_red",
  "terminal.ansiBrightGreen": "terminal.ansi.bright_green",
  "terminal.ansiBrightYellow": "terminal.ansi.bright_yellow",
  "terminal.ansiBrightBlue": "terminal.ansi.bright_blue",
  "terminal.ansiBrightMagenta": "terminal.ansi.bright_magenta",
  "terminal.ansiBrightCyan": "terminal.ansi.bright_cyan",
  "terminal.ansiBrightWhite": "terminal.ansi.bright_white",

  // Base colors
  foreground: "text",
  focusBorder: "border.focused",
  errorForeground: "error",

  // Button colors
  "button.background": "element.background",
  "button.secondaryBackground": "ghost_element.background",
  "button.secondaryHoverBackground": "ghost_element.hover",

  // Dropdown colors
  "dropdown.background": "elevated_surface.background",
  "dropdown.foreground": "text",

  // Input colors
  "input.background": "element.background",
  "input.foreground": "text",
  "input.placeholderForeground": "text.placeholder",
  "inputOption.activeBorder": "border.selected",
  "inputValidation.infoBorder": "info.border",
  "inputValidation.warningBorder": "warning.border",
  "inputValidation.errorBorder": "error.border",

  // Badge colors
  "badge.background": "element.background",
  "badge.foreground": "text",

  // Progress bar
  "progressBar.background": "element.background",

  // List colors
  "list.activeSelectionBackground": "element.selected",
  "list.dropBackground": "drop_target.background",
  "list.highlightForeground": "text.accent",
  "list.hoverBackground": "element.hover",
  "list.inactiveSelectionBackground": "element.selected",
  "list.warningForeground": "warning",
  "list.errorForeground": "error",

  // Activity bar
  "activityBar.background": "surface.background",
  "activityBar.foreground": "text",
  "activityBar.inactiveForeground": "text.muted",
  "activityBar.activeBorder": "border.selected",
  "activityBar.activeBackground": "element.selected",
  "activityBarBadge.background": "element.background",
  "activityBarBadge.foreground": "text",

  // Side bar
  "sideBar.background": "panel.background",
  "sideBarTitle.foreground": "text",
  "sideBarSectionHeader.background": "surface.background",
  "sideBarSectionHeader.border": "border.variant",

  // Editor groups
  "editorGroup.border": "pane_group.border",
  "editorGroup.dropBackground": "drop_target.background",
  "editorGroupHeader.tabsBackground": "tab_bar.background",

  // Tab colors
  "tab.activeBackground": "tab.active_background",
  "tab.activeForeground": "text",
  "tab.inactiveBackground": "tab.inactive_background",
  "tab.inactiveForeground": "text.muted",

  // Editor colors
  "editor.background": "editor.background",
  "editor.foreground": "editor.foreground",
  "editorLineNumber.foreground": "editor.line_number",
  "editor.selectionBackground": "editor.document_highlight.read_background",
  "editor.selectionHighlightBackground":
    "editor.document_highlight.read_background",
  "editor.wordHighlightBackground": "editor.document_highlight.read_background",
  "editor.wordHighlightStrongBackground":
    "editor.document_highlight.write_background",
  "editor.findMatchBackground": "search.active_match_background",
  "editor.findMatchHighlightBackground": "search.match_background",
  "editor.findRangeHighlightBackground": "search.match_background",
  "editor.hoverHighlightBackground": "element.hover",
  "editor.lineHighlightBorder": "editor.active_wrap_guide",
  "editorLink.activeForeground": "link_text.hover",
  "editor.rangeHighlightBackground": "editor.highlighted_line.background",
  "editorWhitespace.foreground": "editor.invisible",
  "editorIndentGuide.background": "editor.indent_guide",
  "editorIndentGuide.activeBackground": "editor.indent_guide_active",
  "editorRuler.foreground": "editor.wrap_guide",
  "editorError.foreground": "error",
  "editorWarning.foreground": "warning",

  // Editor gutter
  "editorGutter.modifiedBackground": "version_control.modified",
  "editorGutter.addedBackground": "version_control.added",
  "editorGutter.deletedBackground": "version_control.deleted",

  // Overview ruler
  "editorOverviewRuler.modifiedForeground": "version_control.modified",
  "editorOverviewRuler.addedForeground": "version_control.added",
  "editorOverviewRuler.deletedForeground": "version_control.deleted",
  "editorOverviewRuler.errorForeground": "error",
  "editorOverviewRuler.warningForeground": "warning",
  "editorOverviewRuler.infoForeground": "info",
  "editorOverviewRuler.currentContentForeground":
    "version_control.conflict_marker.ours",
  "editorOverviewRuler.incomingContentForeground":
    "version_control.conflict_marker.theirs",

  // Diff editor
  "diffEditor.insertedTextBackground": "version_control.word_added",
  "diffEditor.removedTextBackground": "version_control.word_deleted",

  // Editor widget
  "editorWidget.background": "elevated_surface.background",
  "editorSuggestWidget.background": "elevated_surface.background",
  "editorSuggestWidget.foreground": "text",
  "editorSuggestWidget.selectedBackground": "element.selected",
  "editorHoverWidget.background": "elevated_surface.background",
  "editorHoverWidget.border": "border",
  "editorMarkerNavigation.background": "elevated_surface.background",

  // Peek view
  "peekView.border": "border",
  "peekViewEditor.background": "surface.background",
  "peekViewEditor.matchHighlightBackground": "search.match_background",
  "peekViewResult.background": "surface.background",
  "peekViewResult.fileForeground": "text",
  "peekViewResult.lineForeground": "text.muted",
  "peekViewResult.matchHighlightBackground": "search.match_background",
  "peekViewResult.selectionBackground": "element.selected",
  "peekViewResult.selectionForeground": "text",
  "peekViewTitle.background": "surface.background",
  "peekViewTitleDescription.foreground": "text.muted",
  "peekViewTitleLabel.foreground": "text",

  // Merge conflicts
  "merge.currentHeaderBackground": "version_control.conflict_marker.ours",
  "merge.incomingHeaderBackground": "version_control.conflict_marker.theirs",

  // Panel colors
  "panel.background": "panel.background",
  "panelTitle.activeBorder": "border.selected",
  "panelTitle.activeForeground": "text",
  "panelTitle.inactiveForeground": "text.muted",

  // Status bar
  "statusBar.background": "status_bar.background",
  "statusBar.foreground": "text",
  "statusBarItem.prominentHoverBackground": "element.hover",

  // Title bar
  "titleBar.activeBackground": "title_bar.background",
  "titleBar.activeForeground": "text",
  "titleBar.inactiveBackground": "title_bar.inactive_background",
  "titleBar.inactiveForeground": "text.muted",

  // Extension button
  "extensionButton.prominentBackground": "element.background",
  "extensionButton.prominentHoverBackground": "element.hover",

  // Picker group
  "pickerGroup.border": "border.variant",
  "pickerGroup.foreground": "text",

  // Debug toolbar
  "debugToolBar.background": "toolbar.background",

  // Settings
  "settings.headerForeground": "text",
  "settings.modifiedItemIndicator": "modified",
  "settings.dropdownBackground": "element.background",
  "settings.dropdownForeground": "text",
  "settings.dropdownBorder": "border",
  "settings.checkboxBackground": "element.background",
  "settings.checkboxForeground": "text",
  "settings.checkboxBorder": "border",
  "settings.textInputBackground": "element.background",
  "settings.textInputForeground": "text",
  "settings.textInputBorder": "border",
  "settings.numberInputBackground": "element.background",
  "settings.numberInputForeground": "text",
  "settings.numberInputBorder": "border",

  // Breadcrumb
  "breadcrumb.foreground": "text",
  "breadcrumb.background": "background",
  "breadcrumb.focusForeground": "text.accent",
  "breadcrumb.activeSelectionForeground": "text.accent",
  "breadcrumbPicker.background": "elevated_surface.background",

  // List filter widget
  "listFilterWidget.background": "elevated_surface.background",
  "listFilterWidget.outline": "border.focused",
  "listFilterWidget.noMatchesOutline": "error.border",

  // Git decoration
  "gitDecoration.modifiedResourceForeground": "modified",
  "gitDecoration.deletedResourceForeground": "deleted",
  "gitDecoration.untrackedResourceForeground": "created",
  "gitDecoration.ignoredResourceForeground": "ignored",
  "gitDecoration.conflictingResourceForeground": "conflict"
}

// ============================================================================
// Token Color to Syntax Mapping
// ============================================================================

const tokenToSyntaxMapping = {
  // Comments
  comment: "comment",
  "punctuation.definition.comment": "comment",
  "comment keyword.codetag.notation": "comment.doc",
  "comment.block.documentation keyword": "comment.doc",

  // Constants
  constant: "constant",
  "variable.other.constant": "constant",
  "constant.character.escape": "string.escape",
  "constant.character.string.escape": "string.escape",
  "constant.regexp": "string.regex",
  "constant.other.date": "constant",
  "constant.other.timestamp": "constant",

  // Entities
  "entity.name.tag": "tag",
  "entity.other.attribute-name": "attribute",
  "entity.name.function": "function",
  "entity.name.type": "type",
  "entity.name.type.class": "type",
  "entity.name.class": "type",
  "entity.other.inherited-class": "type",

  // Keywords
  keyword: "keyword",
  "punctuation.definition.keyword": "keyword",
  storage: "keyword",
  "storage.modifier": "keyword",
  "storage.type": "keyword",

  // Strings
  string: "string",
  "string.regexp": "string.regex",
  "string.quoted.docstring.multi": "comment.doc",
  "string.quoted.docstring.multi.python": "comment.doc",
  "string.template": "string",
  "string.unquoted.heredoc": "string",

  // Variables
  variable: "variable",
  "variable.language": "variable.special",
  "variable.parameter": "variable",
  "variable.other.readwrite": "variable",

  // Support
  "support.function": "function.builtin",
  "support.variable": "variable",
  "support.constant": "constant",
  "support.type": "type",

  // Meta
  "meta.decorator": "attribute",

  // Markup
  "markup.inserted": "",
  "markup.deleted": "",
  "markup.changed": "",
  "markup.underline.link": "link_uri",
  "markup.bold": "emphasis.strong",
  "markup.italic": "emphasis",

  // Invalid
  invalid: "",
  "invalid.deprecated": "",

  // Log
  "log.error": "",
  "log.warning": "",

  // Text styles
  emphasis: "emphasis",
  strong: "emphasis.strong",
  header: "title",
  "markup.underline": "emphasis",
  "markup.heading": "title",

  // Punctuation
  "punctuation.definition.bracket": "punctuation.bracket",
  "punctuation.section.scope": "punctuation.bracket",
  "punctuation.definition.string.begin": "string",
  "punctuation.definition.string.end": "string"
}

// ============================================================================
// Utility Functions
// ============================================================================

export function hexToRgba(hex, alpha) {
  // Remove # if present
  hex = hex.replace("#", "")

  // Parse hex
  let r, g, b
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
  } else if (hex.length === 8) {
    // Already has alpha
    return `#${hex}`
  } else {
    return hex
  }

  // Convert alpha to hex
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0")

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}${a}`
}

export function adjustColor(hex, amount) {
  hex = hex.replace("#", "")

  let r, g, b
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
  } else {
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
  }

  r = Math.max(0, Math.min(255, r + amount))
  g = Math.max(0, Math.min(255, g + amount))
  b = Math.max(0, Math.min(255, b + amount))

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

export function isLightColor(hex) {
  hex = hex.replace("#", "")

  let r, g, b
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
  } else {
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
  }

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}

// ============================================================================
// Theme Conversion Functions
// ============================================================================

function convertColors(vsCodeColors) {
  const zedStyle = {}

  // Map known colors
  for (const [vsCodeKey, zedKey] of Object.entries(colorMapping)) {
    if (vsCodeColors[vsCodeKey]) {
      zedStyle[zedKey] = vsCodeColors[vsCodeKey]
    }
  }

  // Derive additional colors
  deriveAdditionalColors(zedStyle, vsCodeColors)

  return zedStyle
}

function deriveAdditionalColors(zedStyle, vsCodeColors) {
  const editorBg =
    vsCodeColors["editor.background"] ||
    vsCodeColors["terminal.background"] ||
    "#1e1e1e"
  const editorFg =
    vsCodeColors["editor.foreground"] ||
    vsCodeColors["terminal.foreground"] ||
    "#d4d4d4"
  const isLight = isLightColor(editorBg)

  // Derive surface background if not set
  if (!zedStyle["surface.background"]) {
    zedStyle["surface.background"] = adjustColor(editorBg, isLight ? -10 : 10)
  }

  // Derive elevated surface
  if (!zedStyle["elevated_surface.background"]) {
    zedStyle["elevated_surface.background"] = adjustColor(
      editorBg,
      isLight ? -20 : 20
    )
  }

  // Derive background
  if (!zedStyle["background"]) {
    zedStyle["background"] = editorBg
  }

  // Derive text colors
  if (!zedStyle["text.muted"]) {
    zedStyle["text.muted"] = adjustColor(editorFg, isLight ? -80 : -80)
  }

  if (!zedStyle["text.disabled"]) {
    zedStyle["text.disabled"] = adjustColor(editorFg, isLight ? -120 : -120)
  }

  if (!zedStyle["text.accent"]) {
    const accent =
      vsCodeColors["button.background"] ||
      vsCodeColors["activityBarBadge.background"] ||
      editorFg
    zedStyle["text.accent"] = accent
  }

  // Derive border colors
  if (!zedStyle["border"]) {
    zedStyle["border"] = adjustColor(editorBg, isLight ? -30 : 30)
  }

  if (!zedStyle["border.variant"]) {
    zedStyle["border.variant"] = adjustColor(editorBg, isLight ? -20 : 20)
  }

  if (!zedStyle["border.transparent"]) {
    zedStyle["border.transparent"] = hexToRgba(
      zedStyle["border"] || "#808080",
      0
    )
  }

  // Derive element states
  if (!zedStyle["element.hover"]) {
    zedStyle["element.hover"] = adjustColor(
      zedStyle["element.background"] || editorFg,
      isLight ? -20 : 20
    )
  }

  if (!zedStyle["element.active"]) {
    zedStyle["element.active"] = adjustColor(
      zedStyle["element.background"] || editorFg,
      isLight ? -40 : 40
    )
  }

  if (!zedStyle["element.disabled"]) {
    zedStyle["element.disabled"] = adjustColor(
      zedStyle["element.background"] || editorFg,
      isLight ? -60 : -60
    )
  }

  // Derive ghost element colors
  if (!zedStyle["ghost_element.background"]) {
    zedStyle["ghost_element.background"] = hexToRgba(editorBg, 0)
  }

  if (!zedStyle["ghost_element.hover"]) {
    zedStyle["ghost_element.hover"] = hexToRgba(editorFg, 0.1)
  }

  if (!zedStyle["ghost_element.active"]) {
    zedStyle["ghost_element.active"] = hexToRgba(editorFg, 0.2)
  }

  if (!zedStyle["ghost_element.selected"]) {
    zedStyle["ghost_element.selected"] = hexToRgba(editorFg, 0.15)
  }

  // Derive editor colors
  if (!zedStyle["editor.gutter.background"]) {
    zedStyle["editor.gutter.background"] = editorBg
  }

  if (!zedStyle["editor.active_line_number"]) {
    zedStyle["editor.active_line_number"] = zedStyle["text.accent"] || editorFg
  }

  if (!zedStyle["editor.hover_line_number"]) {
    zedStyle["editor.hover_line_number"] = zedStyle["text.muted"] || editorFg
  }

  if (!zedStyle["editor.active_line.background"]) {
    zedStyle["editor.active_line.background"] = hexToRgba(editorFg, 0.05)
  }

  if (!zedStyle["editor.highlighted_line.background"]) {
    zedStyle["editor.highlighted_line.background"] = hexToRgba(editorFg, 0.1)
  }

  // Derive scrollbar colors
  if (!zedStyle["scrollbar.thumb.background"]) {
    zedStyle["scrollbar.thumb.background"] = adjustColor(
      editorBg,
      isLight ? -40 : 40
    )
  }

  if (!zedStyle["scrollbar.thumb.hover_background"]) {
    zedStyle["scrollbar.thumb.hover_background"] = adjustColor(
      zedStyle["scrollbar.thumb.background"] || editorFg,
      isLight ? -20 : 20
    )
  }

  if (!zedStyle["scrollbar.thumb.active_background"]) {
    zedStyle["scrollbar.thumb.active_background"] = adjustColor(
      zedStyle["scrollbar.thumb.background"] || editorFg,
      isLight ? -40 : 40
    )
  }

  if (!zedStyle["scrollbar.track.background"]) {
    zedStyle["scrollbar.track.background"] = hexToRgba(editorBg, 0)
  }

  // Derive terminal dim colors from normal colors
  const ansiColors = [
    "black",
    "red",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "white"
  ]

  for (const color of ansiColors) {
    const normalKey = `terminal.ansi.${color}`
    const dimKey = `terminal.ansi.dim_${color}`

    if (zedStyle[normalKey] && !zedStyle[dimKey]) {
      zedStyle[dimKey] = adjustColor(zedStyle[normalKey], -40)
    }
  }

  // Derive terminal bright foreground
  if (!zedStyle["terminal.bright_foreground"]) {
    zedStyle["terminal.bright_foreground"] = editorFg
  }

  if (!zedStyle["terminal.dim_foreground"]) {
    zedStyle["terminal.dim_foreground"] = zedStyle["text.muted"] || editorFg
  }

  // Derive status indicator backgrounds and borders
  const indicators = [
    "error",
    "warning",
    "info",
    "success",
    "hint",
    "created",
    "deleted",
    "modified",
    "renamed",
    "conflict",
    "hidden",
    "ignored",
    "unreachable",
    "predictive"
  ]

  for (const indicator of indicators) {
    const colorKey = indicator
    const bgKey = `${indicator}.background`
    const borderKey = `${indicator}.border`

    if (zedStyle[colorKey]) {
      if (!zedStyle[bgKey]) {
        zedStyle[bgKey] = hexToRgba(zedStyle[colorKey], 0.1)
      }
      if (!zedStyle[borderKey]) {
        zedStyle[borderKey] = zedStyle[colorKey]
      }
    }
  }

  // Derive icon colors
  if (!zedStyle["icon"]) {
    zedStyle["icon"] = editorFg
  }

  if (!zedStyle["icon.accent"]) {
    zedStyle["icon.accent"] = zedStyle["text.accent"] || editorFg
  }

  if (!zedStyle["icon.disabled"]) {
    zedStyle["icon.disabled"] = zedStyle["text.disabled"] || editorFg
  }

  if (!zedStyle["icon.muted"]) {
    zedStyle["icon.muted"] = zedStyle["text.muted"] || editorFg
  }

  if (!zedStyle["icon.placeholder"]) {
    zedStyle["icon.placeholder"] = zedStyle["text.placeholder"] || editorFg
  }

  // Derive drop target
  if (!zedStyle["drop_target.background"]) {
    zedStyle["drop_target.background"] = hexToRgba(
      zedStyle["text.accent"] || editorFg,
      0.2
    )
  }
}

function convertTokenColors(tokenColors) {
  const syntax = {}

  for (const token of tokenColors) {
    const scopes = Array.isArray(token.scope)
      ? token.scope
      : [token.scope || ""]

    for (const scope of scopes) {
      const zedSyntaxKey = tokenToSyntaxMapping[scope]

      if (zedSyntaxKey && zedSyntaxKey !== "") {
        // Only set if not already set (first match wins)
        if (!syntax[zedSyntaxKey]) {
          syntax[zedSyntaxKey] = {}

          if (token.settings.foreground) {
            syntax[zedSyntaxKey].color = token.settings.foreground
          }

          if (token.settings.background) {
            syntax[zedSyntaxKey].background_color = token.settings.background
          }

          if (token.settings.fontStyle) {
            const styles = token.settings.fontStyle.split(" ")
            if (styles.includes("italic")) {
              syntax[zedSyntaxKey].font_style = "italic"
            }
            if (styles.includes("bold")) {
              syntax[zedSyntaxKey].font_weight = 700
            }
          }
        }
      }
    }
  }

  return syntax
}

function generatePlayerColors(editorBg, isLight) {
  // Generate a set of distinct player colors for collaboration
  const baseColors = isLight
    ? [
        "#e74c3c",
        "#3498db",
        "#2ecc71",
        "#f39c12",
        "#9b59b6",
        "#1abc9c",
        "#e91e63",
        "#ff5722"
      ]
    : [
        "#ff6b6b",
        "#4ecdc4",
        "#45b7d1",
        "#96ceb4",
        "#ffeaa7",
        "#dfe6e9",
        "#fd79a8",
        "#a29bfe"
      ]

  return baseColors.map(color => ({
    background: hexToRgba(color, 0.3),
    cursor: color,
    selection: hexToRgba(color, 0.3)
  }))
}

function convertThemeToVariant(vsCodeTheme) {
  const appearance = vsCodeTheme.type || "dark"
  const themeName = vsCodeTheme.name || "Converted Theme"

  // Convert colors
  const colors = vsCodeTheme.colors || {}
  const style = convertColors(colors)

  // Convert token colors to syntax
  if (vsCodeTheme.tokenColors && vsCodeTheme.tokenColors.length > 0) {
    style.syntax = convertTokenColors(vsCodeTheme.tokenColors)
  }

  // Generate player colors
  const editorBg =
    colors["editor.background"] || colors["terminal.background"] || "#1e1e1e"
  const isLight = appearance === "light"
  style.players = generatePlayerColors(editorBg, isLight)

  // Generate accents from theme colors
  const accentColors = []
  if (colors["button.background"])
    accentColors.push(colors["button.background"])
  if (colors["activityBarBadge.background"])
    accentColors.push(colors["activityBarBadge.background"])
  if (colors["editorLink.activeForeground"])
    accentColors.push(colors["editorLink.activeForeground"])
  if (accentColors.length === 0) {
    accentColors.push(isLight ? "#007acc" : "#007acc")
  }
  style.accents = accentColors

  const zedThemeVariant = {
    name: themeName,
    appearance: appearance,
    style: style
  }

  return zedThemeVariant
}

function createZedTheme(darkVariant, lightVariant, themeName, author) {
  const themes = [darkVariant]
  if (lightVariant) {
    themes.push(lightVariant)
  }

  const zedTheme = {
    $schema: "https://zed.dev/schema/themes/v0.2.0.json",
    name: themeName || darkVariant.name,
    author: author || "",
    themes: themes
  }

  return zedTheme
}

function parseArgs(args) {
  const result = {}
  let i = 0

  while (i < args.length) {
    const arg = args[i]

    if (arg === "-l" || arg === "--light") {
      i++
      if (i >= args.length) {
        console.error("Error: -l/--light flag requires a path argument")
        process.exit(1)
      }
      result.lightThemePath = args[i]
    } else if (arg === "-o" || arg === "--output") {
      i++
      if (i >= args.length) {
        console.error("Error: -o/--output flag requires a path argument")
        process.exit(1)
      }
      result.outputPath = args[i]
    } else if (!arg.startsWith("-")) {
      // Positional argument - dark theme path
      if (result.darkThemePath) {
        console.error(
          "Error: Only one dark theme path should be provided as a positional argument"
        )
        process.exit(1)
      }
      result.darkThemePath = arg
    } else {
      console.error(`Error: Unknown flag: ${arg}`)
      process.exit(1)
    }
    i++
  }

  if (!result.darkThemePath) {
    console.error("Error: Dark theme path is required as a positional argument")
    printUsage()
    process.exit(1)
  }

  return result
}

function printUsage() {
  console.error(
    "Usage: bun run script.ts <dark-theme.json> [-l <light-theme.json>] [-o <output-path>]"
  )
  console.error("")
  console.error("Arguments:")
  console.error(
    "  <dark-theme.json>         Path to the VS Code dark theme JSON file (required)"
  )
  console.error(
    "  -l, --light <path>        Path to the VS Code light theme JSON file (optional)"
  )
  console.error(
    "  -o, --output <path>       Output path for the Zed theme file (optional)"
  )
  console.error("")
  console.error("Examples:")
  console.error("  bun run script.ts dark-theme.json")
  console.error("  bun run script.ts dark-theme.json -l light-theme.json")
  console.error(
    "  bun run script.ts dark-theme.json -l light-theme.json -o ./themes/my-theme.json"
  )
}

function loadVSCodeTheme(themePath) {
  const resolvedPath = path.resolve(themePath)

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Error: Theme file not found: ${resolvedPath}`)
    process.exit(1)
  }

  try {
    const content = fs.readFileSync(resolvedPath, "utf-8")
    return JSON.parse(content)
  } catch (error) {
    console.error(`Error: Failed to parse theme file ${resolvedPath}: ${error}`)
    process.exit(1)
  }
}

// ============================================================================
// Main Function
// ============================================================================

function main() {
  const args = process.argv.slice(2)

  if (args.length < 1 || args.includes("-h") || args.includes("--help")) {
    printUsage()
    if (args.length < 1) {
      process.exit(1)
    }
    process.exit(0)
  }

  const parsedArgs = parseArgs(args)

  // Load dark theme
  console.log(`Loading dark theme: ${parsedArgs.darkThemePath}...`)
  const darkVSCodeTheme = loadVSCodeTheme(parsedArgs.darkThemePath)
  const darkVariant = convertThemeToVariant(darkVSCodeTheme)

  // Load light theme if provided
  let lightVariant
  if (parsedArgs.lightThemePath) {
    console.log(`Loading light theme: ${parsedArgs.lightThemePath}...`)
    const lightVSCodeTheme = loadVSCodeTheme(parsedArgs.lightThemePath)
    lightVariant = convertThemeToVariant(lightVSCodeTheme)
  }

  // Create the Zed theme
  const zedTheme = createZedTheme(
    darkVariant,
    lightVariant,
    darkVSCodeTheme.name,
    darkVSCodeTheme.author
  )

  // Determine output path
  let outputPath
  if (parsedArgs.outputPath) {
    // Use specified output path
    outputPath = path.resolve(parsedArgs.outputPath)
  } else {
    // Default to current working directory with dark theme base name
    const baseName = path.basename(parsedArgs.darkThemePath, ".json")
    const outputFileName = `${baseName}.json`
    outputPath = path.join(process.cwd(), outputFileName)
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) {
    console.log(`Creating output directory: ${outputDir}`)
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Write output
  try {
    const output = JSON.stringify(zedTheme, null, 2)
    fs.writeFileSync(outputPath, output, "utf-8")
    console.log(`✓ Successfully converted theme to: ${outputPath}`)
    if (lightVariant) {
      console.log(`  - Includes dark and light variants`)
    } else {
      console.log(`  - Includes dark variant only`)
    }
  } catch (error) {
    console.error(`Error: Failed to write output file: ${error}`)
    process.exit(1)
  }
}

// Run main function
main()
