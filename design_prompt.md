# Design Prompt: Tralo.ai Theme

Recreate the signature "Tralo.ai" aesthetic with this structured design prompt.

## Theme Overview
- **Color Palette**: OKLCH-based. Mustard/Gold (`oklch(0.65 0.1 75)`) as the primary accent. Pure white backgrounds in light mode, deep charcoal (`oklch(0.12 0.01 250)`) in dark mode.
- **Grid System**: 40px square grid lines with a radial mask centered at the top.
- **Typography**: Geist Sans for headings and body, Geist Mono for code and data.
- **Styling**: Heavy use of glassmorphism (blur, subtle borders) and glow effects on interactive cards.

## LLM Prompt
> "Act as a Senior UI/UX Designer. Create a modern web interface with the 'Tralo.ai' theme. Use an OKLCH color palette where the primary accent is a Mustard/Gold (`oklch(0.65 0.1 75)`). The background should be pure white in light mode and deep charcoal (`oklch(0.12 0.01 250)`) in dark mode. Implement a 40px square grid background using linear gradients, masked with a radial gradient centered at the top to create a focused spotlight effect. Use Geist Sans as the primary typeface and Geist Mono for technical details. Design interactive 'glow cards' using glassmorphism: high backdrop blur (20px), subtle borders, and a hover transition that lifts the card and intensifies the primary color border. Emphasize visual depth, clean lines, and a premium, high-tech feel."

## Core CSS Snippet
Refer to `theme_preview_snippet.css` for the exact implementation of the variables and grid system.
