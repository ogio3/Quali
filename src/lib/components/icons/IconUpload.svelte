<script lang="ts">
  import IconBase from './IconBase.svelte';
  let { size, strokeWidth, class: className, ...rest }: {
    size?: string | number; strokeWidth?: number; class?: string; [k: string]: unknown;
  } = $props();
</script>
<IconBase {size} {strokeWidth} class={className} {...rest}>
  <path d="M8 10V2" />
  <path d="M5 5l3-3 3 3" />
  <path d="M3 12v2h10v-2" />
</IconBase>
