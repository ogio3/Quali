<script lang="ts">
  import IconBase from './IconBase.svelte';
  let { size, strokeWidth, class: className, ...rest }: {
    size?: string | number; strokeWidth?: number; class?: string; [k: string]: unknown;
  } = $props();
</script>
<IconBase {size} {strokeWidth} class={className} {...rest}>
  <circle cx="8" cy="8" r="2" />
  <path d="M8 3l1.8 2 2.5.5-.8 2.5.8 2.5-2.5.5L8 13l-1.8-2-2.5-.5.8-2.5-.8-2.5 2.5-.5z" />
</IconBase>
