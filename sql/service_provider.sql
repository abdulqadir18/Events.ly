CREATE TABLE IF NOT EXISTS public.service_provider
(
    sp_id integer NOT NULL DEFAULT nextval('service_provider_sp_id_seq'::regclass),
    sp_type text COLLATE pg_catalog."default",
    sp_speciality text COLLATE pg_catalog."default",
    sp_headline text COLLATE pg_catalog."default",
    sp_description text COLLATE pg_catalog."default",
    CONSTRAINT service_provider_pkey PRIMARY KEY (sp_id)
)
