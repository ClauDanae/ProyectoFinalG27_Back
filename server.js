require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const jwt = require("jsonwebtoken")

const {
  getMovies,
  verificarCredenciales,
  registrarUsuario,
  getUsuario,
  ingresarComentario,
  getComments,
} = require("./queries")
const {isAuth, usuarioExiste} = require("./middleware")

app.listen(
  process.env.PORT,
  console.log(`Escuchando por el puerto ${process.env.PORT}`)
)
app.use(cors())
app.use(express.json())

app.post("/login", async (req, res) => {
  try {
    const login = req.body
    await verificarCredenciales(login)
    const token = jwt.sign(login.mail, process.env.SECRET_KEY)
    console.log(token)
    res.send(token)
  } catch (error) {
    res.status(error.code || 500).send(error.message)
  }
})

app.post("/registro", usuarioExiste, async (req, res) => {
  try {
    await registrarUsuario(req.body)
    res.status(201).send({code: 201, message: "Usuario creado"})
  } catch (error) {
    res.status(error.code || 500).send(error)
  }
})

app.get("/usuarios", isAuth, async(req, res) => {
  try{
    const user = await getUsuario(req.mail)
    console.log(req.body)
    res.send(user)
  }
  catch(error){
    res.status(500).send(error.message)
  }
})

app.get("/peliculas", async (req, res) => {
  try {
    const movies = await getMovies()
    res.json(movies)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

app.post("/pelicula", async (req, res) => {
  try {
    await ingresarComentario(req.body)
    res.status(201).send({code: 201, message: "Comentario ingresado"})
  } catch (error) {
    res.status(error.code || 500).send(error)
  }
})

app.get("/pelicula/:id", async (req, res) => {
  try {
    const comentarios = await getComments(req.params.id)
    res.json(comentarios)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = app
