<script lang="ts">
  import { dispatch } from '$lib/keyboard';
  import Toast from '$lib/components/Toast.svelte';
  import '../app.css';

  let { children } = $props();

  function handleKeydown(e: KeyboardEvent) {
    dispatch(e);
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<Toast />
{@render children()}
