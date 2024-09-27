import { integer, text } from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";


export const users = sqliteTable('users', {
    id: integer('id').primaryKey(),
    username: text('username').notNull(),
    password: text('password').notNull(),
    email: text('email').notNull(),
})

