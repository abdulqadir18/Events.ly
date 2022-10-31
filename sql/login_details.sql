CREATE TABLE IF NOT EXISTS public.login_details
(
    email character varying(200) COLLATE pg_catalog."default" NOT NULL,
    "First_name" character varying(200) COLLATE pg_catalog."default",
    "Last_name" character varying COLLATE pg_catalog."default",
    password character varying(200) COLLATE pg_catalog."default",
    street character varying(200) COLLATE pg_catalog."default",
    city character varying COLLATE pg_catalog."default",
    state character varying(200) COLLATE pg_catalog."default",
    country character varying COLLATE pg_catalog."default",
    type character varying(200) COLLATE pg_catalog."default",
    CONSTRAINT login_details_pkey PRIMARY KEY (email)
)
