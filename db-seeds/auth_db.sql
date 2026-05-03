--
-- PostgreSQL database dump
--

\restrict BZLtJvS9aXPzqbdIGLVsMduXBDpSo05dcZh76g2zeGoBxkz4kEFkoaQGK0iTJOO

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

ALTER TABLE IF EXISTS ONLY public."Usuario" DROP CONSTRAINT IF EXISTS "Usuario_rolId_fkey";
ALTER TABLE IF EXISTS ONLY public."TokenRefresco" DROP CONSTRAINT IF EXISTS "TokenRefresco_usuarioId_fkey";
ALTER TABLE IF EXISTS ONLY public."RolPermiso" DROP CONSTRAINT IF EXISTS "RolPermiso_rolId_fkey";
ALTER TABLE IF EXISTS ONLY public."RolPermiso" DROP CONSTRAINT IF EXISTS "RolPermiso_permisoId_fkey";
DROP INDEX IF EXISTS public."Usuario_email_key";
DROP INDEX IF EXISTS public."TokenRefresco_token_key";
DROP INDEX IF EXISTS public."Rol_nombre_key";
DROP INDEX IF EXISTS public."Permiso_nombre_key";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."Usuario" DROP CONSTRAINT IF EXISTS "Usuario_pkey";
ALTER TABLE IF EXISTS ONLY public."TokenRefresco" DROP CONSTRAINT IF EXISTS "TokenRefresco_pkey";
ALTER TABLE IF EXISTS ONLY public."Rol" DROP CONSTRAINT IF EXISTS "Rol_pkey";
ALTER TABLE IF EXISTS ONLY public."RolPermiso" DROP CONSTRAINT IF EXISTS "RolPermiso_pkey";
ALTER TABLE IF EXISTS ONLY public."Permiso" DROP CONSTRAINT IF EXISTS "Permiso_pkey";
ALTER TABLE IF EXISTS public."Usuario" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."TokenRefresco" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Rol" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Permiso" ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public._prisma_migrations;
DROP SEQUENCE IF EXISTS public."Usuario_id_seq";
DROP TABLE IF EXISTS public."Usuario";
DROP SEQUENCE IF EXISTS public."TokenRefresco_id_seq";
DROP TABLE IF EXISTS public."TokenRefresco";
DROP SEQUENCE IF EXISTS public."Rol_id_seq";
DROP TABLE IF EXISTS public."RolPermiso";
DROP TABLE IF EXISTS public."Rol";
DROP SEQUENCE IF EXISTS public."Permiso_id_seq";
DROP TABLE IF EXISTS public."Permiso";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Permiso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permiso" (
    id integer NOT NULL,
    nombre text NOT NULL
);


ALTER TABLE public."Permiso" OWNER TO postgres;

--
-- Name: Permiso_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Permiso_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Permiso_id_seq" OWNER TO postgres;

--
-- Name: Permiso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Permiso_id_seq" OWNED BY public."Permiso".id;


--
-- Name: Rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Rol" (
    id integer NOT NULL,
    nombre text NOT NULL
);


ALTER TABLE public."Rol" OWNER TO postgres;

--
-- Name: RolPermiso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RolPermiso" (
    "rolId" integer NOT NULL,
    "permisoId" integer NOT NULL
);


ALTER TABLE public."RolPermiso" OWNER TO postgres;

--
-- Name: Rol_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Rol_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Rol_id_seq" OWNER TO postgres;

--
-- Name: Rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Rol_id_seq" OWNED BY public."Rol".id;


--
-- Name: TokenRefresco; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TokenRefresco" (
    id integer NOT NULL,
    token text NOT NULL,
    "usuarioId" integer NOT NULL,
    "expiraEn" timestamp(3) without time zone NOT NULL,
    revocado boolean DEFAULT false NOT NULL,
    "revocadoEn" timestamp(3) without time zone,
    "ipAddress" text,
    "userAgent" text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TokenRefresco" OWNER TO postgres;

--
-- Name: TokenRefresco_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TokenRefresco_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TokenRefresco_id_seq" OWNER TO postgres;

--
-- Name: TokenRefresco_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TokenRefresco_id_seq" OWNED BY public."TokenRefresco".id;


--
-- Name: Usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Usuario" (
    id integer NOT NULL,
    nombre text NOT NULL,
    email text NOT NULL,
    contrasena text NOT NULL,
    "rolId" integer NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Usuario" OWNER TO postgres;

--
-- Name: Usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Usuario_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Usuario_id_seq" OWNER TO postgres;

--
-- Name: Usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Usuario_id_seq" OWNED BY public."Usuario".id;


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
-- Name: Permiso id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permiso" ALTER COLUMN id SET DEFAULT nextval('public."Permiso_id_seq"'::regclass);


--
-- Name: Rol id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rol" ALTER COLUMN id SET DEFAULT nextval('public."Rol_id_seq"'::regclass);


--
-- Name: TokenRefresco id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TokenRefresco" ALTER COLUMN id SET DEFAULT nextval('public."TokenRefresco_id_seq"'::regclass);


--
-- Name: Usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuario" ALTER COLUMN id SET DEFAULT nextval('public."Usuario_id_seq"'::regclass);


--
-- Data for Name: Permiso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permiso" (id, nombre) FROM stdin;
1	contenido:gestionar
2	usuarios:gestionar
\.


--
-- Data for Name: Rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Rol" (id, nombre) FROM stdin;
1	admin
2	editor
3	recepcionista
\.


--
-- Data for Name: RolPermiso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RolPermiso" ("rolId", "permisoId") FROM stdin;
1	1
1	2
2	1
\.


--
-- Data for Name: TokenRefresco; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TokenRefresco" (id, token, "usuarioId", "expiraEn", revocado, "revocadoEn", "ipAddress", "userAgent", "creadoEn") FROM stdin;
1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc3Njk4NzEyLCJleHAiOjE3Nzc3MDIzMTJ9.09JyEGYtNCa8QEMONwQ6p9R4htDu6NlF5rsfvGoUGUo	1	2026-05-09 05:11:52.964	f	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-02 05:11:52.965
2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzc3Njk5MDM4LCJleHAiOjE3Nzc3MDI2Mzh9.Gd8v_Yw3zVEtWWqPIhgzft1HcqPG7OhLHfd0BJdii-E	2	2026-05-09 05:17:18.643	f	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-02 05:17:18.644
3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc3Njk5MDU0LCJleHAiOjE3Nzc3MDI2NTR9.W9NIYEdwvpeP8oz7j0uJE2-L6u6trlNrZcbzJnEIQyo	3	2026-05-09 05:17:34.351	f	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-02 05:17:34.352
4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc3Njk5NjY3LCJleHAiOjE3Nzc3MDMyNjd9.8CqLH5CKWCrBOP0uqyURKRGc_WClVxwlstR8UfsVaSc	1	2026-05-09 05:27:47.98	f	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-02 05:27:47.982
5	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc3Nzc0NjY4LCJleHAiOjE3Nzc3NzgyNjh9.uo_ixthEjowR2fWAs9b6YiKoofOQbHYitYqID9CvU48	1	2026-05-10 02:17:48.453	f	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-03 02:17:48.454
6	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzc3Nzc0NzE3LCJleHAiOjE3Nzc3NzgzMTd9.jXrSEo-A9AeyxUpAQ0Kw7Cx2-GcnpupJTgejGAj741E	2	2026-05-10 02:18:37.72	f	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-03 02:18:37.721
7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc3Nzc0NzM0LCJleHAiOjE3Nzc3NzgzMzR9.cPGnbXC7nXXsqn6QI9cWGc_QTNa4YM9Jg7emhc8ra3c	3	2026-05-10 02:18:54.064	f	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-03 02:18:54.065
8	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc3NzgzMDY4LCJleHAiOjE3Nzc3ODY2Njh9.JOpmidXR4VDAWmratwTmdzototJbvPS5RF7ycH5vWHQ	1	2026-05-10 04:37:48.171	f	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-03 04:37:48.172
\.


--
-- Data for Name: Usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Usuario" (id, nombre, email, contrasena, "rolId", "creadoEn", "actualizadoEn") FROM stdin;
1	Administrador	admin@santino.com	$2b$10$UjyGBl28xdrYah65ztdaPumnhiTOZep/8b1832xNDn3Lf0Cv3xC.e	1	2026-05-02 05:01:11.721	2026-05-02 05:01:11.721
2	Leonardo	leo@santino.com	$2b$10$EIfohOlHnhLMgTpx7jm/z.J0vUHekAxaPAxkbj5K8u0TUPEkCz3X.	2	2026-05-02 05:16:45.288	2026-05-02 05:16:45.288
3	Sandra	sandra@santino.com	$2b$10$W5wzRjjUMvKN5YYXrRTB4u/9vx2sobLb0o9KvQ8IpE7vHNmHSq.Cq	3	2026-05-02 05:17:08.207	2026-05-02 05:17:08.207
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
4c431fd3-77ea-4337-b9a5-d81cda35ea3e	bc6a1778f78e64f6677e7eae4c3497654a7bd20e4b124a69688cae1325291a85	2026-05-01 23:00:41.926561-06	20260320044613_init	\N	\N	2026-05-01 23:00:41.893575-06	1
0bb23910-c670-4355-a9cb-ad85f248e74e	10e6fa8e08c9c4bd30928a49851909ce7b89993aa3a40ddd0603d0c89be42a55	2026-05-01 23:00:41.942141-06	20260428070623_add_rol_table	\N	\N	2026-05-01 23:00:41.927053-06	1
2dc96b02-0f3b-42ba-a3a7-117f97439b9e	544223e99ea0b17f4d2151e09804e0548be180669b87f866c00d92f4f1b40577	2026-05-01 23:01:00.477913-06	20260502050100_add_permiso_rolpermiso	\N	\N	2026-05-01 23:01:00.447989-06	1
\.


--
-- Name: Permiso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Permiso_id_seq"', 2, true);


--
-- Name: Rol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Rol_id_seq"', 3, true);


--
-- Name: TokenRefresco_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TokenRefresco_id_seq"', 8, true);


--
-- Name: Usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Usuario_id_seq"', 3, true);


--
-- Name: Permiso Permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permiso"
    ADD CONSTRAINT "Permiso_pkey" PRIMARY KEY (id);


--
-- Name: RolPermiso RolPermiso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolPermiso"
    ADD CONSTRAINT "RolPermiso_pkey" PRIMARY KEY ("rolId", "permisoId");


--
-- Name: Rol Rol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rol"
    ADD CONSTRAINT "Rol_pkey" PRIMARY KEY (id);


--
-- Name: TokenRefresco TokenRefresco_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TokenRefresco"
    ADD CONSTRAINT "TokenRefresco_pkey" PRIMARY KEY (id);


--
-- Name: Usuario Usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Permiso_nombre_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Permiso_nombre_key" ON public."Permiso" USING btree (nombre);


--
-- Name: Rol_nombre_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Rol_nombre_key" ON public."Rol" USING btree (nombre);


--
-- Name: TokenRefresco_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TokenRefresco_token_key" ON public."TokenRefresco" USING btree (token);


--
-- Name: Usuario_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Usuario_email_key" ON public."Usuario" USING btree (email);


--
-- Name: RolPermiso RolPermiso_permisoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolPermiso"
    ADD CONSTRAINT "RolPermiso_permisoId_fkey" FOREIGN KEY ("permisoId") REFERENCES public."Permiso"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RolPermiso RolPermiso_rolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolPermiso"
    ADD CONSTRAINT "RolPermiso_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES public."Rol"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TokenRefresco TokenRefresco_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TokenRefresco"
    ADD CONSTRAINT "TokenRefresco_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Usuario Usuario_rolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES public."Rol"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict BZLtJvS9aXPzqbdIGLVsMduXBDpSo05dcZh76g2zeGoBxkz4kEFkoaQGK0iTJOO

