<script lang="ts">
  import { onMount } from "svelte";
  import { createHighlighter } from "shiki";
  import { Button } from "$lib/components/ui/button";
  import { Check, Copy } from "lucide-svelte";
  import { fade } from "svelte/transition";

  let { code = "", lang = "javascript" } = $props();

  let highlightedCode = $state("");
  let copied = $state(false);
  let isLoading = $state(true);

  async function highlight() {
    isLoading = true;
    try {
      const highlighter = await createHighlighter({
        themes: ["github-dark", "github-light"],
        langs: [
          "javascript",
          "typescript",
          "python",
          "html",
          "css",
          "bash",
          "sql",
          "json",
        ],
      });
      highlightedCode = highlighter.codeToHtml(code, {
        lang: lang.toLowerCase(),
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
      });
    } catch (e) {
      console.error("Shiki highlighting failed", e);
      highlightedCode = `<pre><code>${code}</code></pre>`;
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    highlight();
  });

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  }

  $effect(() => {
    if (code || lang) {
      highlight();
    }
  });
</script>

<div class="group relative rounded-lg overflow-hidden border bg-muted/20">
  <div
    class="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
  >
    <Button
      variant="secondary"
      size="icon"
      class="size-8"
      onclick={copyToClipboard}
    >
      {#if copied}
        <div in:fade={{ duration: 100 }}>
          <Check class="size-4 text-green-500" />
        </div>
      {:else}
        <div in:fade={{ duration: 100 }}>
          <Copy class="size-4" />
        </div>
      {/if}
      <span class="sr-only">Copiar código</span>
    </Button>
  </div>

  <div
    class="shiki-container max-h-[300px] overflow-auto text-xs p-4 transition-all duration-500 {isLoading
      ? 'blur-md grayscale opacity-50'
      : 'blur-0'}"
  >
    {#if highlightedCode}
      {@html highlightedCode}
    {:else}
      <pre class="font-mono"><code>{code}</code></pre>
    {/if}
  </div>

  {#if isLoading}
    <div
      class="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-xs pointer-events-none"
      in:fade={{ duration: 200 }}
    >
      <div class="flex gap-1">
        <div class="size-1.5 rounded-full bg-primary animate-bounce"></div>
        <div
          class="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"
        ></div>
        <div
          class="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"
        ></div>
      </div>
    </div>
  {/if}
</div>

<style>
  :global(.shiki) {
    background-color: transparent !important;
    margin: 0;
    padding: 0;
  }
</style>
