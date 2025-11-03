# Character Full-Body Images (Vertical)

This folder contains **vertical full-body** character images used for the team composition visual display.

## Image Specifications

- **Format**: PNG with transparency
- **Size**: 861x1239px (vertical/portrait orientation)
- **Content**: Full-body character illustration
- **Aspect Ratio**: Approximately 0.7:1 (vertical)

## Naming Convention

All character images must follow this naming pattern:
- Use **lowercase letters only**
- Replace spaces with **underscores** (`_`)
- File extension must be **.png**

## Examples

| Character Name | File Name |
|---------------|-----------|
| Haru | `haru.png` |
| Mei Lin | `mei_lin.png` |
| Khalipe | `khalipe.png` |
| Veronica | `veronica.png` |

## Complete List of Required Images

### DPS Characters
- `haru.png`
- `khalipe.png`
- `mei_lin.png`
- `hugo.png`
- `kayro.png`
- `magna.png`
- `rin.png`
- `renoa.png`
- `orlea.png`
- `luke.png`

### Sub DPS Characters
- `veronica.png`
- `tressa.png`
- `beryl.png`
- `cassius.png`
- `amir.png`
- `selene.png`
- `lucas.png`
- `owen.png`
- `maribell.png`

### Healer Characters
- `mika.png`
- `rei.png`
- `nia.png`

## Team Composition Display

These images are used in the visual team composition section where:
- **DPS** appears in the **center** (z-index: 3, max-height: 450px)
- **Sub DPS** appears on the **right** (z-index: 2, max-height: 400px)
- **Healer** appears on the **left** (z-index: 2, max-height: 400px)

## Horizontal Flip for Position

Some characters need to be horizontally flipped when placed on the left (Healer position) to avoid visual obstruction. The flip configuration will be managed in the JavaScript code.

Characters that may need flipping when on the left:
- To be determined based on character pose direction

## Note

This folder is separate from `assets/select/` which contains square images (512x512) used for the character selection grid panel.
