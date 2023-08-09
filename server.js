require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const jwt = require("jsonwebtoken")

const {
  GetMovies,
  GetMovie,
  verificarCredenciales,
  registrarUsuario,
  getUsuario,
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
    const movies = await GetMovies()
    res.json(movies)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

app.get("/peliculas/:id", async (req, res) => {
  try {
    const movies = await GetMovie(req.params.id)
    res.json(movies)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = app
