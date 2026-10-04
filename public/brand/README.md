# Brand assets

Official neuron mark vectors from `neuron-logo-brand-package` (the brand sheet
lives alongside the source package). The app renders the logo from
`components/brand/Logo.tsx`, whose geometry is generated from these same files
(`components/brand/mark-geometry.ts`). Use these files for downloads, email
signatures and anything outside the React tree.

| File | Variant |
|---|---|
| `metadatum-mark.svg` | Primary, light background (with soft colour sheen) |
| `metadatum-mark-flat.svg` | Flat, no sheen |
| `metadatum-mark-dark.svg` | Dark background, transparent (white axon chain) |
| `metadatum-mark-mono-black.svg` / `-mono-white.svg` | Monochrome |
| `metadatum-icon.svg` / `-icon-dark.svg` | Small-size icon (≤64px) |
| `metadatum-horizontal.svg` / `-dark.svg` / `-mono.svg` / `-mono-white.svg` | Horizontal lockups |
| `metadatum-stacked.svg` / `-dark.svg` / `-mono-white.svg` | Stacked lockups |
| `metadatum-mark-512.png` | Raster mark for JSON-LD `logo` |

## Colour

| Name | Value | Token |
|---|---|---|
| Neuron Pink | `#F7147F` | `--color-pink` |
| Synapse Violet | `#820AAA` | `--color-violet` |
| Nucleus blend | `#D00A88` → `#6C1198` | `--color-soma-from` / `--color-soma-to` |
| Axon Ink | `#000000` (white on dark) | `--color-ink` |

## Usage

- **Clear space:** at least the width of the nucleus on every side.
- **Minimum size:** full mark down to 64px / 18mm; below that use the small-size icon or favicon set.
- **Don't:** recolour the arms, add 3D, shadows or glow, reorder the nodes, or stretch the mark.
