<script lang="ts">
  import IconBase from './IconBase.svelte';
  let { size, strokeWidth, class: className, ...rest }: {
    size?: string | number; strokeWidth?: number; class?: string; [k: string]: unknown;
  } = $props();
</script>
<IconBase {size} {strokeWidth} class={className} {...rest}>
  <path d="M8 1.5L2.5 4.5v4c0 3 5.5 5.5 5.5 5.5s5.5-2.5 5.5-5.5v-4L8 1.5z" />
</IconBase>
