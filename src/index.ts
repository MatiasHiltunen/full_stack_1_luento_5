import { serve } from '@hono/node-server'
import { Hono, MiddlewareHandler } from 'hono'
import bcrypt from 'bcryptjs'

import { db } from './db'
import { users } from './schema'
import { basicAuth } from 'hono/basic-auth'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { cache } from 'hono/cache'
import { serveStatic } from '@hono/node-server/serve-static'

// Luodaan app -muuttujaan Hono instanssi johon esim. user instanssi kytketään
// /user polun luomiseksi
const app = new Hono()


app.use(cors({
  origin: ["http://localhost:5173"],
  allowMethods: ["GET"]
}))

/* app.use(basicAuth({
  username: "test", 
  password:"salasana"
})) */

app.use(logger((str)=>{

  console.log(new Date(), str)

}))

// Luodaan user -muuttujaan Hono instanssi jota käytetään /user polussa
const user = new Hono()

const customMiddleware: MiddlewareHandler = async (c, next) => {

  console.log('middleware start')
  await next()
  console.log('middleware end')

}

// Vastaa polkuun /user tehtyihin HTTP GET kyselyihin
user.get('/', customMiddleware, async (c) => {

  console.log("handler")
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
app.route("/api/user", user)

app.use('/*', serveStatic({
  root: './public/',
}))


/* app.get('/', (c) => {

  // c.res.headers.set('Cache-Control', 'public, max-age=604800, immutable')
  
  return c.html(`
    
    <html>
    <head>

    </head>
    <body>

    <h1> ${ (new Date()).toLocaleTimeString('fi') } </h1>
    
    </body>
    </html>
    
    
    `)
    
  
  
  })
 */
const port = 3000
console.log(`Server is running on port http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
