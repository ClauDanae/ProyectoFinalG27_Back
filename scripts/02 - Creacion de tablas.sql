-- Table: categoria
CREATE TABLE categoria
(
    idcategoria SERIAL,
    nombre character varying(50) COLLATE pg_catalog."default",
    activo boolean DEFAULT true,
    CONSTRAINT categoria_pkey PRIMARY KEY (idcategoria)
);

-- Table: pelicula

CREATE TABLE pelicula
(
    id SERIAL,
    titulo text COLLATE pg_catalog."default" NOT NULL,
    precio integer DEFAULT 0,
    idcategoria integer,
    stock integer,
    director character varying(100) COLLATE pg_catalog."default",
    agno integer,
    titulo_alt character varying(200) COLLATE pg_catalog."default",
    CONSTRAINT pelicula_pkey PRIMARY KEY (id),
    CONSTRAINT "FK_pelicula_categoria" FOREIGN KEY (idcategoria)
        REFERENCES public.categoria (idcategoria) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT pelicula_precio_check CHECK (precio >= 1000)
);

-- Table: pelicula_sinopsis

CREATE TABLE pelicula_sinopsis
(
    idpelicula integer NOT NULL,
    sinopsis text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT sinopsis_pkey PRIMARY KEY (idpelicula),
    CONSTRAINT "FK_pelicula_sinopsis" FOREIGN KEY (idpelicula)
        REFERENCES public.pelicula (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

-- Table: reparto

CREATE TABLE reparto
(
    idpelicula integer NOT NULL,
    actor character varying(100) COLLATE pg_catalog."default" NOT NULL,
    rol character varying(150) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT reparto_pkey PRIMARY KEY (idpelicula, actor),
    CONSTRAINT "FK_pelicula_reparto" FOREIGN KEY (idpelicula)
        REFERENCES public.pelicula (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

-- Table: usuario
CREATE TABLE usuario
(
    id SERIAL,
    nombre character varying(100) COLLATE pg_catalog."default",
    activo boolean DEFAULT true,
    direccion character varying(200) COLLATE pg_catalog."default",
    fono character varying(20) COLLATE pg_catalog."default",
    password character varying(250) COLLATE pg_catalog."default",
    correo character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT usuario_pkey PRIMARY KEY (id)
);

-- Table: usuario_compra
CREATE TABLE usuario_compra
(
    idpelicula integer NOT NULL,
    idusuario integer NOT NULL,
    fecha_compra date,
    cantidad integer DEFAULT 0,
    CONSTRAINT usuario_compra_pkey PRIMARY KEY (idpelicula, idusuario),
    CONSTRAINT "FK_usuario_compras" FOREIGN KEY (idusuario)
        REFERENCES public.usuario (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

-- Table: usuario_pelicula

CREATE TABLE usuario_pelicula
(
    idpelicula integer NOT NULL,
    idusuario integer NOT NULL,
    comentario text COLLATE pg_catalog."default",
    puntuacion integer DEFAULT 0,
    CONSTRAINT usuario_pelicula_pkey PRIMARY KEY (idpelicula, idusuario),
    CONSTRAINT "FK_pelicula_usuario" FOREIGN KEY (idpelicula)
        REFERENCES public.pelicula (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

