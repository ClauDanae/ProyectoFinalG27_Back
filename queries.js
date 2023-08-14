const {Pool} = require("pg")
const bcrypt = require("bcrypt")
const format = require("pg-format")

const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  charset: 'utf8mb4',
  allowExitOnIdle: true,
})

const verificarCredenciales = async (login) => {
  const {mail, password} = login
  const consulta = "SELECT * FROM usuarios WHERE mail = $1"
  const values = [mail]
  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values)
  if (!rowCount) throw {code: 404, message: "Usuario o contraseña incorrecta"}
  const {password: passwordEncrypted} = usuario
  const passwordSuccess = bcrypt.compareSync(password, passwordEncrypted)
  if (!passwordSuccess)
    throw {code: 404, message: "Usuario o contraseña incorrecta"}
}

const registrarUsuario = async (data) => {
  try {
    let {mail, nombre, direccion, fono, password} = data
    const passwordEncriptada = bcrypt.hashSync(password, 10)
    password = passwordEncriptada
    let activo = true
    const values = [mail, nombre, activo, direccion, fono, passwordEncriptada]
    const consulta =
      "insert into usuarios values (DEFAULT, $1, $2, $3, $4, $5, $6)"
    const {rowCount} = await pool.query(consulta, values)
    if (!rowCount) {
      throw new Error("code: 404", "message: No se agregó el usuario")
    }
  } catch (error) {
    capturaErrores(error.message, ErrorHttp["Bad Request"])
  }
}

const verificarUsuario = async (mail) => {
  try {
    const values = [mail]
    const consulta = "SELECT * FROM usuarios WHERE mail = $1"
    const {rowCount} = await pool.query(consulta, values)

    if (rowCount) {
      throw new Error("Correo en uso, utilizar otro")
    }
  } catch (error) {
    capturaErrores(error.message, ErrorHttp["Bad Request"])
  }
}

const getMovies = async () => {
  try {
    const {rows} = await pool.query("SELECT * FROM peliculas")
    return rows
  } catch (error) {
    throw {code: 404, message: error.message}
  }
}

const getUsuario = async (mail) => {
  try {
    const value = [mail]
    const consulta = "SELECT * FROM usuarios WHERE mail = $1"
    const usuario = await pool.query(consulta, value)
    return usuario.rows[0]
  } catch (error) {
    capturaErrores(error.message, ErrorHttp.Unauthorized)
  }
}

const ingresarComentario = async(comment) => {
try {
    let {idpelicula, idusuario, comentario} = comment
    const values = [idpelicula, idusuario, comentario]
    const consulta = "insert into usuario_pelicula values ($1, $2, $3)"
    const {rowCount} = await pool.query(consulta, values)
    if (!rowCount) {
      throw new Error("code: 404", "message: No se agregó el comentario")
    }
  } catch (error) {
    console.log(error.message, ErrorHttp["Bad Request"])
  }
}

const getComments = async (movie) => {
  try {
    const values = [movie]
    const consulta = "SELECT up.comentario FROM usuario_pelicula up INNER JOIN peliculas p on p.id = up.idpelicula where p.name = $1"
    const {rows} = await pool.query(consulta, values)
    return rows
  } catch (error) {
    throw {code: 404, message: error.message}
  }
}

module.exports = {
  verificarCredenciales,
  registrarUsuario,
  verificarUsuario,
  getUsuario,
  getMovies,
  ingresarComentario,
  getComments
}
