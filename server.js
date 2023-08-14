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
  compras,
  getHistorial,
  ingresarPelicula,
  deletePelicula,
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

app.post("/historial", async (req, res) => {
  try {
    await compras(req.body)
    res.status(201).send({code: 201, message: "Compra realizada"})
  } catch (error) {
    res.status(400).send(error.message)
  }
})

app.get("/historial/:id", async (req, res) => {
  try {
    console.log(req.params.id)
    const historial = await getHistorial(req.params.id)
    res.json(historial)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

app.post("/publicar", async (req, res) => {
  try {
    console.log(req.body)
    await ingresarPelicula(req.body)
    res.status(201).send({code: 201, message: "Película ingresada"})
  } catch (error) {
    res.status(error.code || 500).send(error)
  }
})

app.delete('/pelicula/:id', async(req, res) => {
  try{
    console.log(req.params.id)
    await deletePelicula(req.params.id)
    res.send("Película eliminada")
  }
  catch (error){
    res.status(500).send(error)
    console.log(error.message)
  }
})

module.exports = app
