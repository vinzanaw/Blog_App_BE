import { pgTable, pgEnum, serial, varchar, text, timestamp, integer, } from "drizzle-orm/pg-core";

export const POST_STATUS = [ "deleted", "published", ] as const;
export const postStatusEnum = pgEnum("post_status", POST_STATUS);


//USER AUTHOR
export const authorTable = pgTable("author",{
  id: serial("id").primaryKey(),
  name: varchar("name", {length: 100, }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});


//CATEGORY
export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("categories", {length: 100, }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});


//POSTS
export const postsTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  categoriesId: integer("categories_id")
    .notNull()
    .references(() => categoriesTable.id, {
      onDelete: "cascade"
    }),
  authorId: integer("author_id")
    .notNull()
    .references(() => authorTable.id, {
      onDelete: "cascade"
    }),
  title: varchar("title", { length: 255 }).notNull(),
  imageUrl: text("image_url"),
  description: text("description").notNull(),
  status: postStatusEnum("status")
    .notNull()
    .default("published"),
  imagePublicId: varchar("image_public_id", {
    length: 255
  }),
  deletedAt: timestamp("deleted_at"),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow()
});