import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password || !name) {
            return fail(400, { message: "Todos los campos son obligatorios" });
        }

        // Check if user already exists
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (existingUser) {
            return fail(400, { message: "El usuario ya existe" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            await db.insert(users).values({
                id: crypto.randomUUID(),
                name,
                email,
                password: hashedPassword,
            });
        } catch (e) {
            console.error(e);
            return fail(500, { message: "Error al crear el usuario" });
        }

        throw redirect(303, "/login");
    },
};
