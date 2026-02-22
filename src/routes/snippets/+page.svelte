<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import ShotsMorph from "$lib/components/ShotsMorph.svelte";
  import SnippetForm from "$lib/components/SnippetForm.svelte";
  import * as Card from "$lib/components/ui/card";
  import { toast } from "svelte-sonner";
  import { enhance } from "$app/forms";
  import { fade, slide } from "svelte/transition";
  import CodeBlock from "$lib/components/CodeBlock.svelte";
  import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-svelte";

  let { data } = $props();

  let isDialogOpen = $state(false);
</script>

<div class="container mx-auto max-w-7xl p-6 md:p-12 space-y-12" in:fade>
  <div
    class="flex flex-col md:flex-row justify-between items-end gap-6 border-b pb-8 border-primary/10"
  >
    <div class="space-y-2">
      <h1
        class="text-5xl font-black tracking-tight bg-linear-to-br from-foreground to-foreground/50 bg-clip-text text-transparent"
      >
        Mis Snippets
      </h1>
      <p class="text-lg text-muted-foreground/80 font-medium tracking-tight">
        Tu biblioteca personal de fragmentos de código, organizada y lista para
        usar.
      </p>
    </div>
    <div class="flex gap-3">
      <Button
        variant="outline"
        href="/"
        class="gap-2 rounded-full h-12 px-6 border-primary/10 hover:bg-primary/5 transition-colors"
      >
        <ArrowLeft class="size-4" /> Volver
      </Button>
      <ShotsMorph expandWidth="700px" expandHeight="800px">
        {#snippet mini()}
          <div
            class="rounded-[32px] w-[96px] h-[36px] bg-primary flex items-center justify-center gap-1 text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.05] active:scale-[0.95]"
          >
            <Plus class="size-4" /> Agregar
          </div>
        {/snippet}
        {#snippet expand()}
          <SnippetForm
            languages={data.languages}
            onSuccess={() => {}}
            onCancel={() => {}}
          />
        {/snippet}
      </ShotsMorph>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {#each data.snippets as snippet (snippet.id)}
      <div transition:slide>
        <Card.Root
          class="h-full flex flex-col border-none bg-muted/20 dark:bg-white/2 rounded-4xl overflow-hidden hover:bg-muted/30 dark:hover:bg-white/4 transition-all duration-500 group relative"
        >
          <!-- Subtle Glow effect -->
          <div
            class="absolute inset-0 bg-primary/2 rounded-4xl opacity-0 group-hover:opacity-100 transition-opacity blur-2xl -z-10"
          ></div>

          <Card.Header class="p-8 pb-4">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-2">
                <div class="size-2 rounded-full bg-primary animate-pulse"></div>
                <span
                  class="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80"
                >
                  {snippet.language}
                </span>
              </div>

              <div
                class="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
              >
                <ShotsMorph expandWidth="700px" expandHeight="800px">
                  {#snippet mini()}
                    <div
                      class="w-[96px] h-[36px] rounded-[32px] bg-background/50 backdrop-blur-md border border-white/10 flex items-center justify-center gap-1 p-0 text-xs font-bold transition-all hover:bg-primary hover:text-primary-foreground"
                    >
                      <Pencil class="size-4" /> Editar
                    </div>
                  {/snippet}
                  {#snippet expand()}
                    <SnippetForm
                      languages={data.languages}
                      {snippet}
                      onSuccess={() => {}}
                      onCancel={() => {}}
                    />
                  {/snippet}
                </ShotsMorph>

                <form
                  method="POST"
                  action="?/delete"
                  use:enhance={() => {
                    return async ({ result }) => {
                      if (result.type === "success") {
                        toast.success("Eliminado correctamente");
                      }
                    };
                  }}
                >
                  <input type="hidden" name="id" value={snippet.id} />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="icon"
                    class="size-9 rounded-full bg-background/50 backdrop-blur-md border-primary/5 hover:bg-destructive hover:text-destructive-foreground transition-all"
                  >
                    <Trash2 class="size-4" />
                    <span class="sr-only">Eliminar</span>
                  </Button>
                </form>
              </div>
            </div>

            <Card.Title
              class="text-2xl font-bold leading-tight group-hover:text-primary transition-colors cursor-default"
            >
              {snippet.title}
            </Card.Title>

            {#if snippet.description}
              <Card.Description
                class="line-clamp-2 mt-2 text-base leading-relaxed opacity-60 font-medium"
              >
                {snippet.description}
              </Card.Description>
            {/if}
          </Card.Header>

          <Card.Content class="p-8 pt-2 flex-1">
            <div
              class="rounded-2xl overflow-hidden shadow-2xl shadow-black/20 group-hover:shadow-primary/5 transition-shadow"
            >
              <CodeBlock code={snippet.code} lang={snippet.language} />
            </div>
          </Card.Content>

          <Card.Footer
            class="px-8 py-6 flex justify-between items-center border-t border-primary/5 mt-auto bg-muted/10"
          >
            <div class="flex items-center gap-2">
              <div class="flex -space-x-2">
                <div
                  class="size-6 rounded-full border border-background bg-primary/20"
                ></div>
                <div
                  class="size-6 rounded-full border border-background bg-primary/10"
                ></div>
              </div>
              <span
                class="text-[11px] font-bold text-muted-foreground tracking-tight"
              >
                {new Date(snippet.createdAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
            <div
              class="flex items-center gap-1 text-[11px] font-bold opacity-40 uppercase tracking-widest text-primary"
            >
              <span class="size-1 rounded-full bg-current"></span>
              {snippet.language}
            </div>
          </Card.Footer>
        </Card.Root>
      </div>
    {:else}
      <div
        class="col-span-full py-32 text-center rounded-[3rem] bg-muted/10 border-2 border-dashed border-primary/5"
        in:fade
      >
        <div class="max-w-md mx-auto space-y-6">
          <div
            class="size-20 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto rotate-12 group-hover:rotate-0 transition-transform"
          >
            <Plus class="size-10 text-primary/40" />
          </div>
          <div class="space-y-2">
            <h3 class="text-2xl font-bold">Tu colección está vacía</h3>
            <p class="text-muted-foreground">
              Comienza a guardar fragmentos de código para tenerlos siempre a
              mano.
            </p>
          </div>
          <ShotsMorph expandWidth="700px" expandHeight="800px">
            {#snippet mini()}
              <div
                class="rounded-full px-10 h-14 text-base shadow-xl shadow-primary/20 bg-primary flex items-center justify-center font-bold text-white cursor-pointer hover:scale-[1.05] transition-all"
              >
                Crear mi primer snippet
              </div>
            {/snippet}
            {#snippet expand()}
              <SnippetForm
                languages={data.languages}
                onSuccess={() => {}}
                onCancel={() => {}}
              />
            {/snippet}
          </ShotsMorph>
        </div>
      </div>
    {/each}
  </div>
</div>
```
