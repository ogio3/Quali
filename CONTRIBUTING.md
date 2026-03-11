# Contributing

## Icons

All icons use a shared base component and follow strict constraints:

| Property | Value |
|----------|-------|
| viewBox | `0 0 16 16` |
| stroke-width | `1.5` |
| stroke-linecap / linejoin | `round` |
| fill | `none` |
| stroke | `currentColor` |
| Optical bounds | 14×14 with 1px padding |

### Adding an icon

1. Create `src/lib/components/icons/IconName.svelte`:

```svelte
<script lang="ts">
  import IconBase from './IconBase.svelte';
  let { size, strokeWidth, class: className, ...rest }: {
    size?: string | number; strokeWidth?: number; class?: string; [k: string]: unknown;
  } = $props();
</script>
<IconBase {size} {strokeWidth} class={className} {...rest}>
  <path d="..." />
</IconBase>
```

2. Export from `src/lib/components/icons/index.ts`.

3. Preview at `/icons` in dev mode.

### Naming

Shape-based, not semantic:

- `IconPlus` not ~~IconAdd~~
- `IconX` not ~~IconClose~~
- `IconChevronDown` not ~~IconExpand~~

Context gives meaning, not the icon.

### PR checklist

- [ ] Follows design constraints above
- [ ] Uses IconBase
- [ ] Shape-based name
- [ ] Previewed at `/icons`
