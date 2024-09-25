import DataBase from 'better-sqlite3'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

const sqliteDb = new DataBase('sqlite.db')

const db = drizzle(sqliteDb)

const users = sqliteTable('users', {
    id: text('id'),
    username: text('username').notNull(),
    password: text('password').notNull(),
    email: text('email').notNull(),
    textModifiers: text('text_modifiers').notNull().default(sql`CURRENT_TIMESTAMP`),
    intModifiers: integer('int_modifiers', { mode: 'boolean' }).notNull().default(false),
})


//db.select().from(users)

db.insert(users).values({
    email: "test@test.com",
    password: "test",
    username: "testaaja"
}).returning().then((test)=>{
    console.log(test)
})
