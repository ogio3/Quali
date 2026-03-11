<script lang="ts">
  import IconBase from './IconBase.svelte';

  let {
    size,
    class: className,
    ...rest
  }: {
    size?: string | number;
    class?: string;
    [key: string]: unknown;
  } = $props();
</script>

<IconBase {size} class={className} {...rest}>
  <circle cx="7" cy="7" r="4" />
  <line x1="10" y1="10" x2="13.5" y2="13.5" />
</IconBase>
