import { z } from "zod";

export const createPostSchema = z.object({
    authorId: z.coerce.number().int().positive(),

    categoriesId: z.coerce.number().int().positive(),
    title: z
        .string()
        .min(3, "Title minimal 3 karakter")
        .max(225, "Title maksimal 225 karakter"),

    description: z.string().min(30, "Description minimal 30 karakter"),
});

export const postIdSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export const userPostParamsSchema = z.object({
    authorId: z.coerce.number().int().positive(),
    postId: z.coerce.number().int().positive(),
});

export const updatePostParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export const updatePostSchema = z.object({
    title: z
    .string()
    .min(3, "Title minimal 3 karakter")
    .max(225, "Title maksimal 225 karakter")
    .optional(),

    description: z
    .string()
    .min(10, "Deskripsi minimal 10 karakter")
    .optional(),

    categoriesId: z.coerce.number().int().positive().optional(),
})