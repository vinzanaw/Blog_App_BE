import { Request, Response } from "express";
import { createPostSchema, postIdSchema, updatePostParamsSchema, updatePostSchema, } from "../../validations/posts.validation";
import { db } from "../../config/db";
import { postsTable, categoriesTable } from "../../config/schema";
import { desc, eq, and } from "drizzle-orm";
import { deteleFromCloudinary, uploadToCloudinary, } from "../../services/cloudinary.services";

export class PostController {
    //membuat post baru
    createPost = async (req: Request, res: Response) => {
        try {
            const validateData = createPostSchema.parse(req.body);
            const {
                authorId,
                categoriesId,
                title,
                description,
            } = validateData;

            let imageUrl: string | undefined;
            let imagePublicId: string | undefined;

            if (req.file) {
                const uploadResult = await uploadToCloudinary(
                    req.file.buffer
                );

                imageUrl = uploadResult.secure_url;
                imagePublicId = uploadResult.public_id;
            }

            const [insertedPost] = await db
                .insert(postsTable)
                .values({
                    authorId,
                    categoriesId,
                    title,
                    description,
                    imageUrl,
                    imagePublicId,
                })
                .returning({
                    id: postsTable.id,
                });

            // Ambil post yang baru dibuat, sekalian join nama kategori
            const [newPost] = await db
                .select({
                    id: postsTable.id,
                    categoriesId: categoriesTable.name, // nama kategori
                    authorId: postsTable.authorId,
                    title: postsTable.title,
                    imageUrl: postsTable.imageUrl,
                    imagePublicId: postsTable.imagePublicId,
                    description: postsTable.description,
                    status: postsTable.status,
                    deletedAt: postsTable.deletedAt,
                    updatedAt: postsTable.updatedAt,
                    createdAt: postsTable.createdAt,
                })
                .from(postsTable)
                .leftJoin(categoriesTable, eq(postsTable.categoriesId, categoriesTable.id))
                .where(eq(postsTable.id, insertedPost.id));

            return res.status(201).json({
                success: true,
                message: "Post berhasil dibuat",
                data: newPost,
            });
        } catch (error) {
            console.log("Create post error", error);

            return res.status(500).json({
                success: false,
                message: "Terjadi kesalahan pada server",
                error:
                    error instanceof Error
                        ? error.message
                        : error,
            });
        }
    };


    //melihat semua post yang sudah ada
    getPosts = async (req: Request, res: Response) => {
        try {
            const posts = await db
                .select({
                    id: postsTable.id,
                    categoriesId: categoriesTable.name, // nama kategori
                    authorId: postsTable.authorId,
                    title: postsTable.title,
                    imageUrl: postsTable.imageUrl,
                    imagePublicId: postsTable.imagePublicId,
                    description: postsTable.description,
                    status: postsTable.status,
                    deletedAt: postsTable.deletedAt,
                    updatedAt: postsTable.updatedAt,
                    createdAt: postsTable.createdAt,
                })
                .from(postsTable)
                .leftJoin(categoriesTable, eq(postsTable.categoriesId, categoriesTable.id))
                .where(eq(postsTable.status, "published"))
                .orderBy(desc(postsTable.createdAt));

            return res.status(200).json({
                success: true,
                message: "Get Posts Successfully",
                data: {
                    posts: posts,
                },
            });
        } catch (error) {
            console.log("Get post error", error);

            return res.status(500).json({
                success: false,
                message: "Terjadi kesalahan pada server",
                error:
                    error instanceof Error
                        ? error.message
                        : error,
            });
        }
    };


     //melihat semua post yang sudah ada berdasarkan id
    getPostById = async (req: Request, res: Response) => {
        try {
            const validatedParams = postIdSchema.parse(req.params);
            const { id } = validatedParams;

            const [post] = await db
                .select({
                    id: postsTable.id,
                    categoriesId: categoriesTable.name, // nama kategori
                    authorId: postsTable.authorId,
                    title: postsTable.title,
                    imageUrl: postsTable.imageUrl,
                    imagePublicId: postsTable.imagePublicId,
                    description: postsTable.description,
                    status: postsTable.status,
                    deletedAt: postsTable.deletedAt,
                    updatedAt: postsTable.updatedAt,
                    createdAt: postsTable.createdAt,
                })
                .from(postsTable)
                .leftJoin(categoriesTable, eq(postsTable.categoriesId, categoriesTable.id))
                .where(
                    and(
                        eq(postsTable.id, id),
                        eq(postsTable.status, "published")
                    )
                );

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: "Post Not Found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Post retrieved successfully",
                data: {
                    post: post,
                },
            });
        } catch (error) {
            console.log("Get post error", error);

            return res.status(500).json({
                success: false,
                message: "Terjadi kesalahan pada server",
                error:
                    error instanceof Error
                        ? error.message
                        : error,
            });
        }
    };

    
     //mendeleted post — TIDAK berubah
    deletePost = async (req: Request, res: Response) => {
        try {
            const validatedParams =
                postIdSchema.parse(req.params);

            const { id } = validatedParams;

            const existingPost =
                await db.query.postsTable.findFirst({
                    where: eq(postsTable.id, id),
                });

            if (!existingPost) {
                return res.status(404).json({
                    success: false,
                    message: "Post not found",
                });
            }

            await db
                .update(postsTable)
                .set({
                    status: "deleted",
                    deletedAt: new Date(),
                })
                .where(eq(postsTable.id, id));

            return res.status(200).json({
                success: true,
                message: "Post deleted successfully",
            });
        } catch (error) {
            console.log("Delete post error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error:
                    error instanceof Error
                        ? error.message
                        : error,
            });
        }
    };
}

export default new PostController();