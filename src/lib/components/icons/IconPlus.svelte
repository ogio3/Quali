<script lang="ts">
  import IconBase from './IconBase.svelte';
  let { size, strokeWidth, class: className, ...rest }: {
    size?: string | number; strokeWidth?: number; class?: string; [k: string]: unknown;
  } = $props();
</script>
<IconBase {size} {strokeWidth} class={className} {...rest}>
  <path d="M8 3v10M3 8h10" />
</IconBase>
