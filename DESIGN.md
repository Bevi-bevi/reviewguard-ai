# ReviewGuard AI — Design Brief

## Purpose & Tone
AI-powered product review authenticity detector. Tone: confident, analytical, trustworthy—like a forensic analyst's dashboard. Dark mode default.

## Color Palette (OKLCH)
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Primary (Teal) | `0.72 0.15 190` | `0.6 0.16 190` | Trust, verification signals |
| Secondary (Amber) | `0.7 0.16 55` | `0.7 0.16 55` | Caution, suspicious signals |
| Destructive (Red) | `0.6 0.18 22` | `0.62 0.18 22` | Fake/high-risk alerts |
| Success (Sage) | `0.65 0.12 130` | `0.65 0.12 130` | Genuine verdict |
| Neutral (Grey) | `0.92 0` light, `0.22 0` dark | | Backgrounds, text hierarchy |

## Typography
| Role | Font | Usage |
|------|------|-------|
| Display | Bricolage Grotesque | Headings, verdict labels, impact text |
| Body | DM Sans | Content, descriptions, form labels |
| Mono | Geist Mono | Review snippets, confidence percentages |

## Structural Zones
| Zone | Background | Border | Elevation |
|------|-----------|--------|-----------|
| Header | `card` + `border-b` | `border` | Elevated |
| Dashboard Stats | Alternating `card` + `muted/10` | None | Shadow: `card` |
| Analysis Input | `background` | `input` | Flat |
| Results | Color-coded (`--chart-*`) | `border-l-4` | `shadow-elevated` |
| History Table | `background` | Striped rows | Flat |

## Shape Language
Cards: `rounded-none` for analysis output (sharp, analytical). CTAs: `rounded-xl` (24px). Chart elements: `rounded-lg`. Asymmetry signals data analysis.

## Component Patterns
- **Verdict Badges**: Color-coded (`teal`/`amber`/`red`) with confidence % in mono font
- **Stat Cards**: Icon + label + value in type scale hierarchy
- **Analysis Results**: Left border accent (4px, matching verdict color) + explanation text
- **Chart**: Horizontal bar or pie—use `chart-1` (teal) for genuine, `chart-2` (amber) for suspicious, `chart-3` (red) for fake

## Motion & Transitions
Default smooth easing: `cubic-bezier(0.4, 0, 0.2, 1)`. Analysis cards slide in on load. Confidence scores animate via count-up effect.

## Differentiation
Bold color-coded authenticity results embedded in every view. Teal (genuine), Amber (suspicious), Red (fake). Visual confidence indicators—not just text.
