<script lang="ts">
  import "../app.css";
  import { ModeWatcher, toggleMode } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner";
  import { Button } from "$lib/components/ui/button";
  import ThemeSwitcher from "$lib/components/ThemeSwitcher.svelte";
  import { primaryTheme } from "$lib/stores/theme";
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";
  import type { LayoutData } from "./$types";

  let {
    data,
    children,
  }: { data: LayoutData; children: import("svelte").Snippet } = $props();

  $effect(() => {
    if (browser) {
      if ($primaryTheme === "wait") {
        const stored = localStorage.getItem("primary-theme") || "zinc";
        primaryTheme.set(stored);
        return;
      }

      const value = $primaryTheme;
      localStorage.setItem("primary-theme", value);
      if (value === "zinc") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", value);
      }
    }
  });
</script>

<ModeWatcher />
<Toaster />

<div
  class="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary-950"
>
  <header
    class="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md"
  >
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <a
          href="/"
          class="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary-600"
        >
          Snippets Pro
        </a>
        {#if data.session}
          <nav class="hidden md:flex gap-4">
            <a
              href="/snippets"
              class="text-sm font-medium hover:text-primary transition-colors"
              >Mis Snippets</a
            >
          </nav>
        {/if}
      </div>

      <div class="flex items-center gap-4">
        <ThemeSwitcher />
        <Button
          variant="ghost"
          size="icon"
          onclick={toggleMode}
          class="rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="hidden dark:block"
            ><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path
              d="M12 20v2"
            /><path d="m4.93 4.93 1.41 1.41" /><path
              d="m17.66 17.66 1.41 1.41"
            /><path d="M2 12h2" /><path d="M20 12h2" /><path
              d="m6.34 17.66-1.41 1.41"
            /><path d="m19.07 4.93-1.41 1.41" /></svg
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="block dark:hidden"
            ><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg
          >
        </Button>

        {#if data.session}
          <div class="flex items-center gap-3">
            <img
              src={data.session.user?.image}
              alt={data.session.user?.name}
              class="w-8 h-8 rounded-full border border-primary/20"
            />
            <form action="/login?/logout" method="POST">
              <Button
                variant="outline"
                size="sm"
                type="submit"
                class="hidden sm:inline-flex"
              >
                Salir
              </Button>
            </form>
          </div>
        {:else}
          <Button size="sm" href="/login">Ingresar</Button>
        {/if}
      </div>
    </div>
  </header>

  <main class="flex-1" in:fade={{ duration: 300 }}>
    {@render children()}
  </main>

  <footer class="border-t py-6 bg-muted/20">
    <div
      class="container mx-auto px-4 text-center text-sm text-muted-foreground"
    >
      <p>&copy; 2026 Snippets Pro. Todos los derechos reservados.</p>
    </div>
  </footer>
</div>
