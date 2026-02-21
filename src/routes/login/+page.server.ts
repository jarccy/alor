import { signIn, signOut } from "../../auth";
import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();
    if (session) {
        throw redirect(303, "/snippets");
    }
    return {};
};

export const actions: Actions = {
    default: async (event) => {
        const formData = await event.request.clone().formData();
        const provider = formData.get("provider");
        console.log(`Login attempt with provider: ${provider}`);

        if (provider === "logout") {
            return await signOut(event);
        }

        try {
            return await signIn(event);
        } catch (error) {
            // Redirects are expected to be thrown as errors in SvelteKit
            if (error instanceof Error && error.constructor.name === 'Redirect') {
                throw error;
            }
            // SvelteKit's redirect() also throws
            if (error && typeof error === 'object' && 'status' in error && 'location' in error) {
                throw error;
            }

            console.error("Auth.js signIn error:", error);
            throw error;
        }
    }
};
