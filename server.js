require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const jwt = require("jsonwebtoken")

const {
  GetMovies,
  GetMovie,
  GetCategorias,
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
   
    res.send(token)
  } catch (error) {
    res.status(500).send(error.message)
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

app.get("/usuarios/:correo", isAuth, async(req, res) => {
  try{

    
    const usuario= await getUsuario(req.params);            
    console.log(req.params)
    res.status(200).send(req.params);


    //console.log('req')
    //const user = await getUsuario(req.mail)
   
    //res.send(user)
  }
  catch(error){
    res.status(500).send(error.message)
  }
})

app.get("/peliculas",  async (req, res) => {
  try {        
    const movies = await GetMovies(req.query);     
    res.json(movies);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/pelicula/:id",  async (req, res) => {
  try {                
     
    const movies = await GetMovie(req.params.id);
    //const hate = await prepararHATEOAS(joyas);    
    res.json(movies);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/categorias",  async (req, res) => {
  try {        
    const categ = await GetCategorias();      
    res.json(categ);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
module.exports = app
