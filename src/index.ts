import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import bcrypt from 'bcryptjs'

import { db } from './db'
import { users } from './schema'

// Luodaan app -muuttujaan Hono instanssi johon esim. user instanssi kytketään
// /user polun luomiseksi
const app = new Hono()

// Luodaan user -muuttujaan Hono instanssi jota käytetään /user polussa
const user = new Hono()

// Vastaa polkuun /user tehtyihin HTTP GET kyselyihin
user.get('/', async (c) => {

  // Hakee kaikki käyttäjät tietokannasta
  const allUsers = await db.select({
    id: users.id,
    username: users.username,
    email: users.email
  }).from(users)
  
  return c.json(allUsers)

})

// Vastaa polkuun /user tehtyihin HTTP POST kyselyihin
user.post("/", async (c)=>{

  // Parsii POST-requestin bodystä JSON muotoisen datan JS/TS objektiksi
  const user = await c.req.json()

  // Tarkistetaan onko clientin lähettämässä datassa password avaimella dataa
  if(user.password == null) {
    return c.text("Salasana ei voi olla tyhjä", 400)
  }

  // Demonstroitu salasanan muuttaminen selväkielisestä tiivisteeksi (hash)
  // käyttämällä bcrypt algoritmia
  const hashedPassword = await bcrypt.hash(user.password, 8)

  // Lisätään uusi käyttäjä tietokantaan
  const createdUser = await db.insert(users).values({
    username: user.username,
    email: user.email,
    password: hashedPassword,
  }).returning({id: users.id})
  
  // Lehttää clientille luodun käyttäjän id:n vastauksena
  // HTTP statuskoodi 201 - Created, lisätty mukaan
  return c.json(createdUser, 201)
})


// Kytketään user-muuttujassa oleva Hono-instanssi /user polkuun
app.route("/user", user)

app.get('/', (c) => {

  return c.json({
    msg: "hello FullStack 1"
  })

})

const port = 3000
console.log(`Server is running on port http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
