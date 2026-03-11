# Contributing to Quali

Thank you for contributing! This guide will get you from zero to PR in 5 minutes.

## Adding an Icon

### Design Rules

All icons follow these non-negotiable constraints:

| Property | Value | Why |
|----------|-------|-----|
| viewBox | `0 0 16 16` | Optimized for 13–20px UI display |
| stroke-width | `1.5` | Matches DM Sans Regular weight |
| stroke-linecap | `round` | Reduces pixel noise at small sizes |
| stroke-linejoin | `round` | Consistent with linecap |
| fill | `none` | Stroke-only. No exceptions for core icons |
| stroke | `currentColor` | Inherits parent text color |
| Optical bounds | 14×14 (1px padding) | Aligns with text cap height |

### Steps

1. Create `src/lib/components/icons/IconYourName.svelte`:

```svelte
<script lang="ts">
  import IconBase from './IconBase.svelte';
  let { size, strokeWidth, class: className, ...rest }: {
    size?: string | number; strokeWidth?: number; class?: string; [k: string]: unknown;
  } = $props();
</script>
<IconBase {size} {strokeWidth} class={className} {...rest}>
  <path d="YOUR PATH HERE" />
</IconBase>
```

2. Add the export to `src/lib/components/icons/index.ts`:

```ts
export { default as IconYourName } from './IconYourName.svelte';
```

3. Verify at `/icons` in dev mode.

### Naming

Use **shape-based** names, not semantic names:

- `IconPlus` not ~~IconAdd~~
- `IconX` not ~~IconClose~~ or ~~IconDelete~~
- `IconChevronDown` not ~~IconExpand~~

The meaning comes from context (parent element), not the icon itself.

### PR Checklist

- [ ] Icon follows the design rules above
- [ ] Uses IconBase (no raw `<svg>` tags)
- [ ] Shape-based name
