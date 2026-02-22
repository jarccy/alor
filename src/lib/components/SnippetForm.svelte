<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Select from "$lib/components/ui/select";
  import { Textarea } from "$lib/components/ui/textarea";
  import { enhance } from "$app/forms";
  import { toast } from "svelte-sonner";
  import { Pencil, Plus } from "lucide-svelte";

  interface Props {
    languages: { id: string; name: string }[];
    snippet?: any;
    onSuccess: () => void;
    onCancel: () => void;
  }

  let { languages, snippet = null, onSuccess, onCancel }: Props = $props();

  let isSubmitting = $state(false);
  const isEdit = $derived(!!snippet);
  const title = $derived(isEdit ? "Editar Snippet?" : "Registrar Nuevo?");
</script>

<div class="flex flex-col h-full w-full bg-zinc-950/40 backdrop-blur-sm">
  <div class="px-10 py-8 border-b border-white/5 bg-white/2 shrink-0">
    <div class="flex items-center gap-4 mb-2">
      <div
        class="size-10 rounded-2xl bg-primary/10 flex items-center justify-center"
      >
        {#if isEdit}
          <Pencil class="size-5 text-primary" />
        {:else}
          <Plus class="size-5 text-primary" />
        {/if}
      </div>
      <h2 class="text-3xl font-black tracking-tight text-white">{title}</h2>
    </div>
    <p class="text-lg font-medium text-white/30 ml-14">
      {isEdit
        ? "Realiza cambios en tu fragmento."
        : "Guarda tus fragmentos de código favoritos."}
    </p>
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
          onSuccess();
        } else if (result.type === "failure") {
          toast.error("Error al procesar la solicitud");
        }
      };
    }}
    class="p-10 space-y-8 overflow-y-auto custom-scrollbar flex-1"
  >
    {#if isEdit}
      <input type="hidden" name="id" value={snippet.id} />
    {/if}

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <div class="grid gap-3">
        <Label
          for="title"
          class="text-[11px] font-black uppercase tracking-[0.25em] text-white/20 ml-1"
          >Título</Label
        >
        <Input
          id="title"
          name="title"
          value={snippet?.title ?? ""}
          placeholder="Ej: Centrar un div"
          class="bg-white/3 border-none focus-visible:ring-1 focus-visible:ring-primary/40 h-14 rounded-2xl px-6 text-lg font-medium text-white"
          required
        />
      </div>

      <div class="grid gap-3">
        <Label
          for="languageId"
          class="text-[11px] font-black uppercase tracking-[0.25em] text-white/20 ml-1"
          >Lenguaje</Label
        >
        <Select.Root
          type="single"
          name="languageId"
          value={String(snippet?.languageId ?? "")}
        >
          <Select.Trigger
            class="bg-white/3 border-none focus-visible:ring-1 focus-visible:ring-primary/40 h-14 w-full rounded-2xl px-6 text-lg font-medium text-white transition-all"
          >
            <Select.Value placeholder="Selecciona uno" />
          </Select.Trigger>
          <Select.Content
            class="rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl backdrop-blur-xl"
          >
            {#each languages as lang}
              <Select.Item
                value={lang.id}
                class="rounded-2xl py-3 text-white/60 hover:text-white"
                >{lang.name}</Select.Item
              >
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
    </div>

    <div class="grid gap-3">
      <Label
        for="description"
        class="text-[11px] font-black uppercase tracking-[0.25em] text-white/20 ml-1"
        >Descripción</Label
      >
      <Input
        id="description"
        name="description"
        value={snippet?.description ?? ""}
        placeholder="Breve nota..."
        class="bg-white/3 border-none focus-visible:ring-1 focus-visible:ring-primary/40 h-14 rounded-2xl px-6 text-lg font-medium text-white"
      />
    </div>

    <div class="grid gap-3">
      <Label
        for="code"
        class="text-[11px] font-black uppercase tracking-[0.25em] text-white/20 ml-1"
        >Código</Label
      >
      <div
        class="rounded-3xl overflow-hidden border border-white/5 bg-black/40 p-1 shadow-inner"
      >
        <Textarea
          id="code"
          name="code"
          value={snippet?.code ?? ""}
          class="min-h-[300px] font-mono resize-none border-none focus-visible:ring-0 p-8 text-base bg-transparent text-white/90"
          required
        />
      </div>
    </div>

    <div class="flex justify-end items-center gap-6 pt-6 shrink-0 pb-2">
      <Button
        variant="ghost"
        type="button"
        onclick={onCancel}
        class="rounded-full h-16 px-10 font-bold text-white/30 hover:bg-white/5 transition-all"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        class="rounded-3xl h-16 px-16 shadow-2xl shadow-primary/30 bg-primary hover:scale-[1.05] transition-all active:scale-[0.95] font-black text-lg text-white"
      >
        {isSubmitting ? "..." : isEdit ? "Actualizar" : "Guardar"}
      </Button>
    </div>
  </form>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
</style>
