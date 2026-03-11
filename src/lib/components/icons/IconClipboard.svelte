<script lang="ts">
  import IconBase from './IconBase.svelte';
  let { size, strokeWidth, class: className, ...rest }: {
    size?: string | number; strokeWidth?: number; class?: string; [k: string]: unknown;
  } = $props();
</script>
<IconBase {size} {strokeWidth} class={className} {...rest}>
  <rect x="3.5" y="3" width="9" height="11" rx="1.5" />
  <path d="M6 1.5h4" />
  <path d="M6 7h4M6 9.5h3" stroke-width="1.2" />
</IconBase>
