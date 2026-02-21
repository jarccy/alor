<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { fade, fly } from "svelte/transition";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<div
  class="h-screen flex flex-col items-center justify-center space-y-8 text-center p-4 bg-linear-to-br from-background via-muted/20 to-primary/5"
>
  <div in:fly={{ y: -50, duration: 1000 }}>
    <h1
      class="text-6xl font-extrabold tracking-tighter sm:text-7xl mb-4 bg-clip-text text-transparent bg-linear-to-r from-primary to-primary-600"
    >
      Snippets Pro
    </h1>
    <p class="text-xl text-muted-foreground max-w-[600px] mx-auto">
      La forma más elegante y rápida de organizar tus fragmentos de código.
      Potenciado con SvelteKit y Tailwind 4.
    </p>
  </div>

  <div class="flex gap-4" in:fade={{ delay: 500, duration: 1000 }}>
    {#if data.session}
      <Button
        size="lg"
        href="/snippets"
        class="rounded-full px-8 shadow-xl hover:scale-105 transition-transform"
      >
        Ir a mis Snippets
      </Button>
    {:else}
      <Button
        size="lg"
        href="/login"
        class="rounded-full px-8 shadow-xl hover:scale-105 transition-transform"
      >
        Comenzar ahora
      </Button>
    {/if}
  </div>

  <div
    class="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 max-w-5xl w-full"
    in:fade={{ delay: 1000, duration: 1000 }}
  >
    <div
      class="p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-primary/10 shadow-sm"
    >
      <div
        class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4"
      >
        <span class="text-2xl">⚡</span>
      </div>
      <h3 class="font-bold mb-2">Ultra Rápido</h3>
      <p class="text-sm text-muted-foreground">
        Construido con Svelte 5 para una respuesta instantánea.
      </p>
    </div>
    <div
      class="p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-primary/10 shadow-sm"
    >
      <div
        class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4"
      >
        <span class="text-2xl">🎨</span>
      </div>
      <h3 class="font-bold mb-2">Tailwind 4</h3>
      <p class="text-sm text-muted-foreground">
        Estilos modernos con la última tecnología de CSS.
      </p>
    </div>
    <div
      class="p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-primary/10 shadow-sm"
    >
      <div
        class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4"
      >
        <span class="text-2xl">🔐</span>
      </div>
      <h3 class="font-bold mb-2">Seguridad</h3>
      <p class="text-sm text-muted-foreground">
        Tus fragmentos están seguros con OAuth de Google y GitHub.
      </p>
    </div>
  </div>
</div>
