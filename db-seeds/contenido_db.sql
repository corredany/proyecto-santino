--
-- PostgreSQL database dump
--

\restrict xfjUS1hHJS8M7azTipV8MTBlAgIdDZMnVssDJyyK6Bi6S3GGZyxe2WHJk3EuBdX

-- Dumped from database version 14.19
-- Dumped by pg_dump version 16.13 (Debian 16.13-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."Video" DROP CONSTRAINT IF EXISTS "Video_seccionId_fkey";
ALTER TABLE IF EXISTS ONLY public."Material" DROP CONSTRAINT IF EXISTS "Material_seccionId_fkey";
ALTER TABLE IF EXISTS ONLY public."Imagen" DROP CONSTRAINT IF EXISTS "Imagen_seccionId_fkey";
DROP INDEX IF EXISTS public."Seccion_nombre_key";
DROP INDEX IF EXISTS public."Patrocinador_nombre_key";
DROP INDEX IF EXISTS public."Imagen_url_key";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."Video" DROP CONSTRAINT IF EXISTS "Video_pkey";
ALTER TABLE IF EXISTS ONLY public."Seccion" DROP CONSTRAINT IF EXISTS "Seccion_pkey";
ALTER TABLE IF EXISTS ONLY public."Patrocinador" DROP CONSTRAINT IF EXISTS "Patrocinador_pkey";
ALTER TABLE IF EXISTS ONLY public."Material" DROP CONSTRAINT IF EXISTS "Material_pkey";
ALTER TABLE IF EXISTS ONLY public."Imagen" DROP CONSTRAINT IF EXISTS "Imagen_pkey";
ALTER TABLE IF EXISTS public."Video" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Seccion" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Patrocinador" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Material" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Imagen" ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public._prisma_migrations;
DROP SEQUENCE IF EXISTS public."Video_id_seq";
DROP TABLE IF EXISTS public."Video";
DROP SEQUENCE IF EXISTS public."Seccion_id_seq";
DROP TABLE IF EXISTS public."Seccion";
DROP SEQUENCE IF EXISTS public."Patrocinador_id_seq";
DROP TABLE IF EXISTS public."Patrocinador";
DROP SEQUENCE IF EXISTS public."Material_id_seq";
DROP TABLE IF EXISTS public."Material";
DROP SEQUENCE IF EXISTS public."Imagen_id_seq";
DROP TABLE IF EXISTS public."Imagen";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Imagen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Imagen" (
    id integer NOT NULL,
    url text NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    "seccionId" integer,
    "creadoPor" integer,
    "actualizadoPor" integer,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL,
    "rutaArchivo" text NOT NULL
);


ALTER TABLE public."Imagen" OWNER TO postgres;

--
-- Name: Imagen_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Imagen_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Imagen_id_seq" OWNER TO postgres;

--
-- Name: Imagen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Imagen_id_seq" OWNED BY public."Imagen".id;


--
-- Name: Material; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Material" (
    id integer NOT NULL,
    url text NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    "seccionId" integer,
    "creadoPor" integer,
    "actualizadoPor" integer,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL,
    "rutaArchivo" text NOT NULL,
    descripcion text,
    nombre text DEFAULT ''::text NOT NULL
);


ALTER TABLE public."Material" OWNER TO postgres;

--
-- Name: Material_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Material_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Material_id_seq" OWNER TO postgres;

--
-- Name: Material_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Material_id_seq" OWNED BY public."Material".id;


--
-- Name: Patrocinador; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Patrocinador" (
    id integer NOT NULL,
    nombre text NOT NULL,
    url text NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    "creadoPor" integer,
    "actualizadoPor" integer,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL,
    "rutaArchivo" text NOT NULL
);


ALTER TABLE public."Patrocinador" OWNER TO postgres;

--
-- Name: Patrocinador_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Patrocinador_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Patrocinador_id_seq" OWNER TO postgres;

--
-- Name: Patrocinador_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Patrocinador_id_seq" OWNED BY public."Patrocinador".id;


--
-- Name: Seccion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Seccion" (
    id integer NOT NULL,
    nombre text NOT NULL,
    "descripcionPrincipal" text,
    "descripcionSeccion" text,
    "esFija" boolean DEFAULT false NOT NULL,
    visible boolean DEFAULT true NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    "creadoPor" integer,
    "actualizadoPor" integer,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Seccion" OWNER TO postgres;

--
-- Name: Seccion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Seccion_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Seccion_id_seq" OWNER TO postgres;

--
-- Name: Seccion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Seccion_id_seq" OWNED BY public."Seccion".id;


--
-- Name: Video; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Video" (
    id integer NOT NULL,
    url text NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    "seccionId" integer,
    "creadoPor" integer,
    "actualizadoPor" integer,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL,
    "rutaArchivo" text NOT NULL
);


ALTER TABLE public."Video" OWNER TO postgres;

--
-- Name: Video_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Video_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Video_id_seq" OWNER TO postgres;

--
-- Name: Video_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Video_id_seq" OWNED BY public."Video".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Imagen id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Imagen" ALTER COLUMN id SET DEFAULT nextval('public."Imagen_id_seq"'::regclass);


--
-- Name: Material id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Material" ALTER COLUMN id SET DEFAULT nextval('public."Material_id_seq"'::regclass);


--
-- Name: Patrocinador id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patrocinador" ALTER COLUMN id SET DEFAULT nextval('public."Patrocinador_id_seq"'::regclass);


--
-- Name: Seccion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Seccion" ALTER COLUMN id SET DEFAULT nextval('public."Seccion_id_seq"'::regclass);


--
-- Name: Video id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Video" ALTER COLUMN id SET DEFAULT nextval('public."Video_id_seq"'::regclass);


--
-- Data for Name: Imagen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Imagen" (id, url, orden, "seccionId", "creadoPor", "actualizadoPor", "creadoEn", "actualizadoEn", "rutaArchivo") FROM stdin;
2	http://localhost:3000/uploads/imagenes/5dab1a36-8d18-4802-bc03-7ddf28d6d3ff.png	1	1	1	1	2026-04-24 06:06:41.019	2026-04-24 06:06:41.019	imagenes/5dab1a36-8d18-4802-bc03-7ddf28d6d3ff.png
27	http://localhost:3000/uploads/imagenes/nosotros1.jpg	1	\N	\N	\N	2026-04-24 22:33:54.434	2026-04-24 22:33:54.434	imagenes/nosotros1.jpg
28	http://localhost:3000/uploads/imagenes/nosotros2.jpeg	2	\N	\N	\N	2026-04-24 22:33:54.436	2026-04-24 22:33:54.436	imagenes/nosotros2.jpeg
29	http://localhost:3000/uploads/imagenes/nosotros3.jpeg	3	\N	\N	\N	2026-04-24 22:33:54.438	2026-04-24 22:33:54.438	imagenes/nosotros3.jpeg
8	http://localhost:3000/uploads/imagenes/cocina1.jpg	1	1	\N	\N	2026-04-24 22:33:54.396	2026-04-24 23:03:52.423	imagenes/cocina1.jpg
9	http://localhost:3000/uploads/imagenes/cocina2.jpeg	2	1	\N	\N	2026-04-24 22:33:54.397	2026-04-24 23:03:52.426	imagenes/cocina2.jpeg
10	http://localhost:3000/uploads/imagenes/cocina3.jpg	3	1	\N	\N	2026-04-24 22:33:54.399	2026-04-24 23:03:52.427	imagenes/cocina3.jpg
11	http://localhost:3000/uploads/imagenes/cocinacomp.jpeg	4	1	\N	\N	2026-04-24 22:33:54.403	2026-04-24 23:03:52.428	imagenes/cocinacomp.jpeg
12	http://localhost:3000/uploads/imagenes/closet1.jpg	1	4	\N	\N	2026-04-24 22:33:54.404	2026-04-24 23:03:52.43	imagenes/closet1.jpg
13	http://localhost:3000/uploads/imagenes/closet2.jpeg	2	4	\N	\N	2026-04-24 22:33:54.406	2026-04-24 23:03:52.43	imagenes/closet2.jpeg
14	http://localhost:3000/uploads/imagenes/closet3.jpg	3	4	\N	\N	2026-04-24 22:33:54.408	2026-04-24 23:03:52.431	imagenes/closet3.jpg
15	http://localhost:3000/uploads/imagenes/closetcomp.jpg	4	4	\N	\N	2026-04-24 22:33:54.41	2026-04-24 23:03:52.432	imagenes/closetcomp.jpg
4	http://localhost:3000/uploads/imagenes/banos1.jpg	1	5	\N	\N	2026-04-24 22:33:54.384	2026-04-24 23:03:52.433	imagenes/banos1.jpg
5	http://localhost:3000/uploads/imagenes/banos2.jpg	2	5	\N	\N	2026-04-24 22:33:54.389	2026-04-24 23:03:52.434	imagenes/banos2.jpg
6	http://localhost:3000/uploads/imagenes/banos3.jpg	3	5	\N	\N	2026-04-24 22:33:54.391	2026-04-24 23:03:52.434	imagenes/banos3.jpg
7	http://localhost:3000/uploads/imagenes/banocomp.jpg	4	5	\N	\N	2026-04-24 22:33:54.394	2026-04-24 23:03:52.435	imagenes/banocomp.jpg
16	http://localhost:3000/uploads/imagenes/vestidor1.jpg	1	3	\N	\N	2026-04-24 22:33:54.412	2026-04-24 23:03:52.436	imagenes/vestidor1.jpg
17	http://localhost:3000/uploads/imagenes/vestidor2.jpg	2	3	\N	\N	2026-04-24 22:33:54.414	2026-04-24 23:03:52.437	imagenes/vestidor2.jpg
18	http://localhost:3000/uploads/imagenes/vestidor3.jpg	3	3	\N	\N	2026-04-24 22:33:54.415	2026-04-24 23:03:52.437	imagenes/vestidor3.jpg
19	http://localhost:3000/uploads/imagenes/vestidorcomp.jpg	4	3	\N	\N	2026-04-24 22:33:54.417	2026-04-24 23:03:52.438	imagenes/vestidorcomp.jpg
20	http://localhost:3000/uploads/imagenes/diseno1.jpeg	1	6	\N	\N	2026-04-24 22:33:54.418	2026-04-24 23:03:52.439	imagenes/diseno1.jpeg
21	http://localhost:3000/uploads/imagenes/diseno2.jpeg	2	6	\N	\N	2026-04-24 22:33:54.42	2026-04-24 23:03:52.44	imagenes/diseno2.jpeg
22	http://localhost:3000/uploads/imagenes/diseno3.jpeg	3	6	\N	\N	2026-04-24 22:33:54.421	2026-04-24 23:03:52.44	imagenes/diseno3.jpeg
\.


--
-- Data for Name: Material; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Material" (id, url, orden, "seccionId", "creadoPor", "actualizadoPor", "creadoEn", "actualizadoEn", "rutaArchivo", descripcion, nombre) FROM stdin;
1	http://localhost:3000/uploads/materiales/6ca19474-4ed6-4cac-ac27-04e3833bb253.jpg	1	\N	\N	\N	2026-05-02 03:26:14.516	2026-05-02 03:26:14.516	materiales/6ca19474-4ed6-4cac-ac27-04e3833bb253.jpg	Superficie de granito natural	Granito
2	http://localhost:3000/uploads/materiales/c160540b-a820-4ab7-b5ec-279fba0fbb37.jpg	2	\N	\N	\N	2026-05-02 03:26:14.521	2026-05-02 03:26:14.521	materiales/c160540b-a820-4ab7-b5ec-279fba0fbb37.jpg	Superficie de mármol natural	Mármol
3	http://localhost:3000/uploads/materiales/bd2debd5-0270-4fc8-bab7-8bc3ba85229c.jpg	3	\N	\N	\N	2026-05-02 03:26:14.527	2026-05-02 03:26:14.527	materiales/bd2debd5-0270-4fc8-bab7-8bc3ba85229c.jpg	Acabado en madera natural	Madera
4	http://localhost:3000/uploads/materiales/64c9dba4-3c12-40d5-a6a0-484a49007e2e.jpg	4	\N	\N	\N	2026-05-02 03:26:14.528	2026-05-02 03:26:14.528	materiales/64c9dba4-3c12-40d5-a6a0-484a49007e2e.jpg	Acabado en madera oscura	Madera oscura
\.


--
-- Data for Name: Patrocinador; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Patrocinador" (id, nombre, url, orden, "creadoPor", "actualizadoPor", "creadoEn", "actualizadoEn", "rutaArchivo") FROM stdin;
1	Blum	http://localhost:3000/uploads/patrocinadores/blum.png	0	\N	\N	2026-04-24 22:33:54.439	2026-04-24 22:33:54.439	patrocinadores/blum.png
2	Arauco	http://localhost:3000/uploads/patrocinadores/arauco.png	0	\N	\N	2026-04-24 22:33:54.442	2026-04-24 22:33:54.442	patrocinadores/arauco.png
3	Häfele	http://localhost:3000/uploads/patrocinadores/hafele.jpg	0	\N	\N	2026-04-24 22:33:54.444	2026-04-24 22:33:54.444	patrocinadores/hafele.jpg
4	Krono	http://localhost:3000/uploads/patrocinadores/krono.jpg	0	\N	\N	2026-04-24 22:33:54.445	2026-04-24 22:33:54.445	patrocinadores/krono.jpg
5	Rehau	http://localhost:3000/uploads/patrocinadores/rehau.jpg	0	\N	\N	2026-04-24 22:33:54.446	2026-04-24 22:33:54.446	patrocinadores/rehau.jpg
6	Brucco	http://localhost:3000/uploads/patrocinadores/brucco.jpg	0	\N	\N	2026-04-24 22:33:54.448	2026-04-24 22:33:54.448	patrocinadores/brucco.jpg
7	Hinge	http://localhost:3000/uploads/patrocinadores/hinge.jpg	0	\N	\N	2026-04-24 22:33:54.45	2026-04-24 22:33:54.45	patrocinadores/hinge.jpg
8	Promob	http://localhost:3000/uploads/patrocinadores/promob.jpg	0	\N	\N	2026-04-24 22:33:54.451	2026-04-24 22:33:54.451	patrocinadores/promob.jpg
\.


--
-- Data for Name: Seccion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Seccion" (id, nombre, "descripcionPrincipal", "descripcionSeccion", "esFija", visible, orden, "creadoPor", "actualizadoPor", "creadoEn", "actualizadoEn") FROM stdin;
4	Closets	Diseñamos muebles que transforman tus espacios en lugares únicos.	Creamos muebles personalizados que combinan funcionalidad, durabilidad y diseño exclusivo.	t	t	2	\N	\N	2026-04-24 23:03:52.429	2026-04-24 23:03:52.429
5	Muebles de baño	Muebles de baño que combinan diseño, funcionalidad y calidad, creados para transformar tu espacio.	\N	t	t	3	\N	\N	2026-04-24 23:03:52.433	2026-04-24 23:03:52.433
3	Vestidores	Vestidores únicos, hechos para tu estilo de vida y pensados con compromiso en cada detalle.	\N	t	t	4	1	1	2026-04-24 05:28:05.574	2026-04-24 23:03:52.436
6	Diseño de interiores	Transformamos tus espacios con equilibrio entre estética y funcionalidad, creando ambientes únicos que se adaptan a tu estilo de vida.	\N	t	t	5	\N	\N	2026-04-24 23:03:52.439	2026-04-24 23:03:52.439
1	Cocinas	Diseñamos cocinas personalizadas que organizan tu espacio y reflejan tu estilo, con la calidad que mereces.	Descripción de prueba	t	t	1	1	1	2026-04-24 05:21:52.998	2026-05-02 02:54:57.45
7	Nosotros	Conoce nuestra historia	\N	t	f	99	\N	\N	2026-05-02 03:14:56.496	2026-05-02 03:14:56.496
8	Inicio	Página principal	\N	t	f	98	\N	1	2026-05-02 03:14:56.5	2026-05-02 03:20:16.619
\.


--
-- Data for Name: Video; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Video" (id, url, orden, "seccionId", "creadoPor", "actualizadoPor", "creadoEn", "actualizadoEn", "rutaArchivo") FROM stdin;
1	http://localhost:3000/uploads/videos/81a0bdb0-3b21-456f-becc-495f782a3e9a.mp4	1	8	\N	\N	2026-05-02 03:14:56.508	2026-05-02 03:14:56.508	videos/81a0bdb0-3b21-456f-becc-495f782a3e9a.mp4
2	http://localhost:3000/uploads/videos/da64715c-69d4-4736-9f53-4cce43c7fc8d.mp4	2	8	\N	\N	2026-05-02 03:14:56.515	2026-05-02 03:14:56.515	videos/da64715c-69d4-4736-9f53-4cce43c7fc8d.mp4
3	http://localhost:3000/uploads/videos/c4024206-2703-4b0d-85f6-fc4e346d14aa.mp4	3	8	\N	\N	2026-05-02 03:14:56.523	2026-05-02 03:14:56.523	videos/c4024206-2703-4b0d-85f6-fc4e346d14aa.mp4
4	http://localhost:3000/uploads/videos/c7d7f584-a073-47cd-9961-1e665f0f5c25.mp4	4	8	\N	\N	2026-05-02 03:14:56.532	2026-05-02 03:14:56.532	videos/c7d7f584-a073-47cd-9961-1e665f0f5c25.mp4
5	http://localhost:3000/uploads/videos/af288be2-b807-46af-bc08-8beb02350fc6.mp4	1	7	\N	\N	2026-05-02 03:14:56.55	2026-05-02 03:14:56.55	videos/af288be2-b807-46af-bc08-8beb02350fc6.mp4
6	http://localhost:3000/uploads/videos/15c7c484-5fdb-4fc1-b07c-0c1aba8fb48a.mp4	2	7	\N	\N	2026-05-02 03:14:56.553	2026-05-02 03:14:56.553	videos/15c7c484-5fdb-4fc1-b07c-0c1aba8fb48a.mp4
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
46e006c0-5dc7-4d5b-93ab-0ebcba45deb9	6563fdc0461c482877d1b3256e517591e0a67d5ab4824e7be407984e7a8d4d93	2026-04-23 22:56:02.005837-06	20260316173208_init	\N	\N	2026-04-23 22:56:01.923152-06	1
0ebf1f11-4f43-470f-8399-ae00531ade49	6551053b0918f993dd429effbb1f8f190478f507af96d4e4f7318b86c8e6c22a	2026-04-23 23:56:12.0869-06	20260424055612_renombrar_public_id_a_ruta_archivo	\N	\N	2026-04-23 23:56:12.071744-06	1
13fac0f3-0afc-412b-8aa3-8974d7d206ac	873914d511ffb1d3de1fd6752662ead7b30cdce1fb9712d09544df658a06a10e	2026-04-24 16:11:07.769885-06	20260424221107_agregar_nombre_descripcion_material	\N	\N	2026-04-24 16:11:07.750916-06	1
34f5f71b-6d6c-40fd-9975-ee6da8e7e719	b2f69bbd5d8ff3a88845cc15525880bbce27ce56145d3bc500a994e2c888651a	2026-04-24 16:33:37.388714-06	20260424222000_unique_url_imagen_nombre_patrocinador	\N	\N	2026-04-24 16:33:37.359752-06	1
5117e67a-1a6c-42ff-9536-8d7e9b219bca	0e23bfa2976a8263b180615a69338bfdca42f18b31564820ed2845d1622ab0db	2026-04-24 17:03:26.469171-06	20260424223000_unique_nombre_seccion	\N	\N	2026-04-24 17:03:26.458082-06	1
292ec396-0f81-407d-ba81-ff8074d23991	2e7800bf2eae66f52d2ac6e5b9979f6bcafd388b7902af6adf8f5ecaa9c110e3	2026-05-01 23:03:04.092662-06	20260502050200_remove_usuario_rol_permiso	\N	\N	2026-05-01 23:03:04.080602-06	1
\.


--
-- Name: Imagen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Imagen_id_seq"', 29, true);


--
-- Name: Material_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Material_id_seq"', 4, true);


--
-- Name: Patrocinador_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Patrocinador_id_seq"', 8, true);


--
-- Name: Seccion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Seccion_id_seq"', 8, true);


--
-- Name: Video_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Video_id_seq"', 6, true);


--
-- Name: Imagen Imagen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Imagen"
    ADD CONSTRAINT "Imagen_pkey" PRIMARY KEY (id);


--
-- Name: Material Material_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Material"
    ADD CONSTRAINT "Material_pkey" PRIMARY KEY (id);


--
-- Name: Patrocinador Patrocinador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patrocinador"
    ADD CONSTRAINT "Patrocinador_pkey" PRIMARY KEY (id);


--
-- Name: Seccion Seccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Seccion"
    ADD CONSTRAINT "Seccion_pkey" PRIMARY KEY (id);


--
-- Name: Video Video_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Video"
    ADD CONSTRAINT "Video_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Imagen_url_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Imagen_url_key" ON public."Imagen" USING btree (url);


--
-- Name: Patrocinador_nombre_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Patrocinador_nombre_key" ON public."Patrocinador" USING btree (nombre);


--
-- Name: Seccion_nombre_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Seccion_nombre_key" ON public."Seccion" USING btree (nombre);


--
-- Name: Imagen Imagen_seccionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Imagen"
    ADD CONSTRAINT "Imagen_seccionId_fkey" FOREIGN KEY ("seccionId") REFERENCES public."Seccion"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Material Material_seccionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Material"
    ADD CONSTRAINT "Material_seccionId_fkey" FOREIGN KEY ("seccionId") REFERENCES public."Seccion"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Video Video_seccionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Video"
    ADD CONSTRAINT "Video_seccionId_fkey" FOREIGN KEY ("seccionId") REFERENCES public."Seccion"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict xfjUS1hHJS8M7azTipV8MTBlAgIdDZMnVssDJyyK6Bi6S3GGZyxe2WHJk3EuBdX

