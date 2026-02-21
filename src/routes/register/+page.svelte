<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { fade, fly } from "svelte/transition";
  import { enhance } from "$app/forms";
  import { toast } from "svelte-sonner";

  let isSubmitting = $state(false);
</script>

<div class="h-screen flex items-center justify-center p-4 bg-muted/30" in:fade>
  <div in:fly={{ y: 20 }}>
    <Card.Root class="w-full max-w-md shadow-2xl border-primary/5">
      <Card.Header class="text-center">
        <Card.Title class="text-3xl font-black">Crea tu Cuenta</Card.Title>
        <Card.Description
          >Únete a Snippets Pro y empieza a organizar tu código.</Card.Description
        >
      </Card.Header>
      <Card.Content>
        <form
          method="POST"
          use:enhance={() => {
            isSubmitting = true;
            return async ({ result }) => {
              isSubmitting = false;
              if (result.type === "failure") {
                toast.error(
                  (result.data?.message as string) || "Error al registrarse",
                );
              } else if (result.type === "redirect") {
                toast.success("¡Cuenta creada! Ahora puedes ingresar.");
              }
            };
          }}
          class="space-y-4"
        >
          <div class="space-y-2">
            <Label for="name">Nombre</Label>
            <Input id="name" name="name" placeholder="Tu nombre" required />
          </div>
          <div class="space-y-2">
            <Label for="email">Correo Electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="password">Contraseña</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" class="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creando cuenta..." : "Registrarse"}
          </Button>
        </form>
      </Card.Content>
      <Card.Footer class="justify-center border-t py-4">
        <p class="text-sm">
          ¿Ya tienes cuenta? <a
            href="/login"
            class="text-primary font-bold hover:underline">Ingresa aquí</a
          >
        </p>
      </Card.Footer>
    </Card.Root>
  </div>
</div>
