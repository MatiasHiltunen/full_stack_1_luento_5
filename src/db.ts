import DataBase from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

// Otetaan käyttöön sqlite-tietokanta
// -> Hakee sqlite.db nimisen tietokantatiedoston tai luo uuden, tyhjän tietokanta tiedoston.
const sqliteDb = new DataBase('sqlite.db')

// Otetaan käyttöön drizzle ORM
export const db = drizzle(sqliteDb)

