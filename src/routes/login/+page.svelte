<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { fade, fly } from "svelte/transition";
  import { enhance } from "$app/forms";
  import { toast } from "svelte-sonner";

  let { form } = $props();

  let isSubmitting = $state(false);
</script>

<div class="h-screen flex items-center justify-center p-4 bg-muted/30" in:fade>
  <div in:fly={{ y: 20 }}>
    <Card.Root class="w-full max-w-md shadow-2xl border-primary/5">
      <Card.Header class="text-center">
        <Card.Title class="text-3xl font-black">Bienvenido</Card.Title>
        <Card.Description
          >Ingresa para empezar a guardar tus snippets.</Card.Description
        >
      </Card.Header>
      <Card.Content class="space-y-6">
        <!-- Manual Login Form -->
        <form method="POST" class="space-y-4">
          <input type="hidden" name="provider" value="credentials" />
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
          <Button type="submit" class="w-full">Ingresar con Correo</Button>
        </form>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t"></span>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-background px-2 text-muted-foreground"
              >O continuar con</span
            >
          </div>
        </div>

        <!-- OAuth Buttons -->
        <div class="grid grid-cols-2 gap-4">
          <form method="POST">
            <input type="hidden" name="provider" value="github" />
            <Button
              variant="outline"
              type="submit"
              class="w-full h-10 flex items-center justify-center gap-2 rounded-xl border-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><path
                  d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
                /><path d="M9 18c-4.51 2-5-2-7-2" /></svg
              >
              GitHub
            </Button>
          </form>

          <form method="POST">
            <input type="hidden" name="provider" value="google" />
            <Button
              variant="outline"
              type="submit"
              class="w-full h-10 flex items-center justify-center gap-2 rounded-xl border-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><path
                  d="M22 12c0-1.12-.11-2.22-.32-3.28H12v6.2h5.61c-.24 1.3-.98 2.4-2.08 3.12v4.02h3.36c1.97-1.81 3.11-4.48 3.11-7.04z"
                  fill="#4285F4"
                /><path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.36-4.02c-.93.62-2.12.99-3.92.99-3.02 0-5.58-2.04-6.49-4.78H2.12v4.16C3.93 20.24 7.73 23 12 23z"
                  fill="#34A853"
                /><path
                  d="M5.51 12.53a6.602 6.602 0 0 1 0-2.06V6.31H2.12a11 11 0 0 0 0 11.38l3.39-4.16z"
                  fill="#FBBC05"
                /><path
                  d="M12 4.49c1.62 0 3.07.56 4.22 1.65l3.16-3.16C17.45 1.18 14.97 0 12 0 7.73 0 3.93 2.76 2.12 6.31l3.39 4.16c.91-2.74 3.47-4.78 6.49-4.78z"
                  fill="#EA4335"
                /></svg
              >
              Google
            </Button>
          </form>
        </div>
      </Card.Content>
      <Card.Footer class="flex flex-col gap-2 border-t py-4">
        <p class="text-sm text-center">
          ¿No tienes cuenta? <a
            href="/register"
            class="text-primary font-bold hover:underline">Regístrate</a
          >
        </p>
        <p class="text-xs text-muted-foreground text-center">
          Al ingresar, aceptas nuestros términos de servicio.
        </p>
      </Card.Footer>
    </Card.Root>
  </div>
</div>
