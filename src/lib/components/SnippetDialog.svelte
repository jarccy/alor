<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Select from "$lib/components/ui/select";
  import { Textarea } from "$lib/components/ui/textarea";
  import { enhance } from "$app/forms";
  import { toast } from "svelte-sonner";

  interface Props {
    languages: { id: string; name: string }[];
    snippet?: any; // If provided, we are in Edit mode
    open: boolean;
    onClose: () => void;
  }

  let {
    languages,
    snippet = null,
    open = $bindable(),
    onClose,
  }: Props = $props();

  let isSubmitting = $state(false);

  const isEdit = $derived(!!snippet);
  const title = $derived(
    isEdit ? "Editar Snippet" : "Registrar Nuevo Fragmento",
  );
  const description = $derived(
    isEdit
      ? "Realiza cambios en tu fragmento de código."
      : "Guarda tus fragmentos de código favoritos para usarlos después.",
  );
</script>

<Dialog.Root bind:open>
  <Dialog.Content
    class="sm:max-w-[700px] gap-0 p-0 overflow-hidden border-none bg-background/95 backdrop-blur-xl shadow-2xl transition-all duration-300 apple-dialog-content"
  >
    <div class="px-6 py-5 border-b bg-muted/30">
      <Dialog.Header>
        <Dialog.Title class="text-2xl font-bold tracking-tight"
          >{title}</Dialog.Title
        >
        <Dialog.Description class="text-sm opacity-70"
          >{description}</Dialog.Description
        >
      </Dialog.Header>
    </div>

    <form
      method="POST"
      action={isEdit ? "?/update" : "?/create"}
      use:enhance={() => {
        isSubmitting = true;
        return async ({ result }) => {
          isSubmitting = false;
          if (result.type === "success") {
            toast.success(isEdit ? "Snippet actualizado" : "Snippet guardado");
            open = false;
            onClose();
          } else if (result.type === "failure") {
            toast.error("Error al procesar la solicitud");
          }
        };
      }}
      class="p-6 space-y-6"
    >
      {#if isEdit}
        <input type="hidden" name="id" value={snippet.id} />
      {/if}

      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label
            for="title"
            class="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1"
            >Título</Label
          >
          <Input
            id="title"
            name="title"
            value={snippet?.title ?? ""}
            placeholder="Ej: Centrar un div"
            class="bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-11 rounded-xl px-4"
            required
          />
        </div>

        <div class="grid gap-2">
          <Label
            for="languageId"
            class="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1"
            >Lenguaje</Label
          >
          <Select.Root
            type="single"
            name="languageId"
            value={snippet?.languageId ?? ""}
          >
            <Select.Trigger
              class="bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-11 w-full rounded-xl px-4"
            >
              <Select.Value placeholder="Selecciona uno" />
            </Select.Trigger>
            <Select.Content>
              {#each languages as lang}
                <Select.Item value={lang.id} class="rounded-lg"
                  >{lang.name}</Select.Item
                >
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
      </div>

      <div class="grid gap-2">
        <Label
          for="description"
          class="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1"
          >Descripción (opcional)</Label
        >
        <Input
          id="description"
          name="description"
          value={snippet?.description ?? ""}
          placeholder="¿Para qué sirve este fragmento?"
          class="bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-11 rounded-xl px-4"
        />
      </div>

      <div class="grid gap-2">
        <Label
          for="code"
          class="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1"
          >Código</Label
        >
        <div
          class="rounded-2xl overflow-hidden border border-primary/5 bg-black/5 dark:bg-white/5 p-1"
        >
          <Textarea
            id="code"
            name="code"
            value={snippet?.code ?? ""}
            class="min-h-[250px] font-mono resize-none border-none focus-visible:ring-0 p-4 text-sm bg-transparent"
            placeholder="Pega tu código aquí..."
            required
          />
        </div>
      </div>

      <Dialog.Footer class="gap-3 sm:gap-0 pt-2 pb-2">
        <Button
          variant="ghost"
          type="button"
          onclick={() => (open = false)}
          class="rounded-full h-11 px-6"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          class="rounded-xl h-11 px-10 shadow-lg shadow-primary/25 bg-primary hover:scale-[1.02] transition-transform active:scale-[0.98]"
        >
          {isSubmitting
            ? "Procesando..."
            : isEdit
              ? "Actualizar Cambios"
              : "Guardar Snippet"}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>

<style>
  :global(.apple-dialog-content) {
    animation: apple-scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
    transform-origin: center center !important;
  }

  @keyframes apple-scale-in {
    from {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.92);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  :global(.apple-dialog-content[data-state="closed"]) {
    animation: apple-scale-out 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }

  @keyframes apple-scale-out {
    from {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    to {
      opacity: 0;
      transform: translate(-50%, -52%) scale(0.96);
    }
  }
</style>
