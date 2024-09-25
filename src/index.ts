import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import { randomUUID, UUID } from 'crypto'
import './db'

type User = {
  id: UUID
  username: string
  password: string
  email: string

}

type FakeDb = {
  [key:UUID]: User
}

const fake_db: FakeDb = {}

const user = new Hono()

user.get('/', (c) => {

  return c.json(fake_db)

})


user.post("/", async (c)=>{

  const user = await c.req.json()

  if(user.password == null) {
    return c.text("Salasana ei voi olla tyhjä", 400)
  }

  const hashedPassword = await bcrypt.hash(user.password, 8)

  const uuid = randomUUID()

  fake_db[uuid] = {
    id: uuid,
    username: user.username,
    password: hashedPassword,
    email: user.email
  }

  return c.json({
    id: uuid,
    username: user.username,
    email: user.email
  })
})


const app = new Hono()

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
