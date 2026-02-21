<script lang="ts">
  import { primaryTheme } from "$lib/stores/theme";

  const themes = [
    { name: "Zinc", value: "zinc", color: "bg-zinc-500" },
    { name: "Blue", value: "blue", color: "bg-blue-500" },
    { name: "Red", value: "red", color: "bg-red-500" },
    { name: "Green", value: "green", color: "bg-green-500" },
    { name: "Orange", value: "orange", color: "bg-orange-500" },
  ];
</script>

<div class="flex items-center gap-1.5 p-1 bg-muted/50 rounded-full border">
  {#each themes as theme}
    <button
      class="flex size-5 items-center justify-center rounded-full border transition-all hover:scale-110 {theme.color} {$primaryTheme ===
      theme.value
        ? 'border-foreground ring-2 ring-ring ring-offset-1 ring-offset-background'
        : 'border-transparent'}"
      onclick={() => ($primaryTheme = theme.value)}
      title={theme.name}
    >
      <span class="sr-only">{theme.name}</span>
    </button>
  {/each}
</div>
