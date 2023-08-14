const {Pool} = require("pg")
const bcrypt = require("bcrypt")
const format = require("pg-format")

const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  encoding: "UTF8",
  allowExitOnIdle: true,
})

const verificarCredenciales = async (login) => {
  const {mail, password} = login
  let passwordAdmin = false
  const consulta = "SELECT * FROM usuarios WHERE mail = $1"
  const values = [mail]
  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values)
  console.log(usuario)
  if (!rowCount) throw {code: 404, message: "Usuario o contraseña incorrecta"}
  const {password: passwordEncrypted} = usuario
  if (password === passwordEncrypted) {
    return (passwordAdmin = true)
  }
  const passwordSuccess = bcrypt.compareSync(password, passwordEncrypted)
  if (!passwordSuccess || passwordAdmin == true)
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
    console.log(rows)
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

const ingresarComentario = async (comment) => {
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
    const consulta =
      "SELECT up.comentario FROM usuario_pelicula up INNER JOIN peliculas p on p.id = up.idpelicula where p.name = $1"
    const {rows} = await pool.query(consulta, values)
    return rows
  } catch (error) {
    throw {code: 404, message: error.message}
  }
}

const compras = async ({usuario, carrito, fechaCompra}) => {
  try {
    for (const item of carrito) {
      const values = [
        usuario.id,
        item.name,
        item.price,
        fechaCompra,
        item.cantidad,
      ]
      const consulta = "insert into usuario_compra values ($1, $2, $3, $4, $5)"
      await pool.query(consulta, values)
    }
  } catch (error) {
    throw {code: 404, message: error.message}
  }
}

const getHistorial = async (id) => {
  try {
    const values = [id]
    const consulta =
      "SELECT pelicula, price, fecha_compra, cantidad FROM usuario_compra WHERE idusuario = $1"
    const {rows} = await pool.query(consulta, values)
    return rows
  } catch (error) {
    throw {code: 404, message: error.message}
  }
}

const ingresarPelicula = async (pelicula) => {
  try {
    let { name, price, genre, director, agno, sinopsis, img } = pelicula;
    const values = [name, price, genre, director, agno, sinopsis, img];
    const consulta = "insert into peliculas values (default, $1, $2, $3, $4, $5, $6, $7)";
    const { rowCount } = await pool.query(consulta, values);
    if (!rowCount) {
      throw new Error("No se agregó la película");
    }
  } catch (error) {
    console.error(error.message);
    throw error
  }
};

const deletePelicula = async(id) => {
  const consulta = 'DELETE FROM peliculas WHERE name = $1'
  const values = [id]
  await pool.query(consulta, values)
}

module.exports = {
  verificarCredenciales,
  registrarUsuario,
  verificarUsuario,
  getUsuario,
  getMovies,
  ingresarComentario,
  getComments,
  compras,
  getHistorial,
  ingresarPelicula,
  deletePelicula,
}
