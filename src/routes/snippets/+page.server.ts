import { db } from '$lib/server/db';
import { codes, languages } from '$lib/server/db/schema';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();
    if (!session?.user) {
        throw redirect(303, '/login');
    }

    // Seed languages if none exist
    const existingLanguages = await db.select().from(languages);
    if (existingLanguages.length === 0) {
        await db.insert(languages).values([
            { name: 'JavaScript', slug: 'javascript' },
            { name: 'TypeScript', slug: 'typescript' },
            { name: 'Python', slug: 'python' },
            { name: 'Rust', slug: 'rust' },
            { name: 'Go', slug: 'go' },
            { name: 'HTML', slug: 'html' },
            { name: 'CSS', slug: 'css' },
        ]);
    }

    const allLanguages = await db.select().from(languages);
    const userSnippets = await db
        .select({
            id: codes.id,
            title: codes.title,
            code: codes.code,
            description: codes.description,
            language: languages.name,
            languageId: codes.languageId,
            createdAt: codes.createdAt,
        })
        .from(codes)
        .innerJoin(languages, eq(codes.languageId, languages.id))
        .where(eq(codes.userId, session.user.id!))
        .orderBy(desc(codes.createdAt));

    return {
        snippets: userSnippets,
        languages: allLanguages,
    };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) throw error(401, 'Unauthorized');

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const code = formData.get('code') as string;
        const description = formData.get('description') as string;
        const languageId = formData.get('languageId') as string;

        if (!title || !code || !languageId) return fail(400, { message: 'Missing fields' });

        await db.insert(codes).values({
            userId: session.user.id!,
            languageId,
            title,
            code,
            description,
        });

        return { success: true };
    },
    update: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) throw error(401, 'Unauthorized');

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const title = formData.get('title') as string;
        const code = formData.get('code') as string;
        const description = formData.get('description') as string;
        const languageId = formData.get('languageId') as string;

        if (!id || !title || !code || !languageId) return fail(400, { message: 'Missing fields' });

        await db.update(codes).set({
            title,
            code,
            description,
            languageId,
            updatedAt: new Date(),
        }).where(eq(codes.id, id));

        return { success: true };
    },
    delete: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) throw error(401, 'Unauthorized');

        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) return fail(400, { message: 'Missing ID' });

        await db.delete(codes).where(eq(codes.id, id));

        return { success: true };
    },
};
