<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    size = '1em',
    strokeWidth = 1.5,
    class: className = '',
    children,
    ...restProps
  }: {
    size?: string | number;
    strokeWidth?: number;
    class?: string;
    children: Snippet;
    [key: string]: unknown;
  } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 16 16"
  fill="none"
  stroke="currentColor"
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
  aria-hidden="true"
  {...restProps}
>
  {@render children()}
</svg>
