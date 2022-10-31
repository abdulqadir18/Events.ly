CREATE TABLE IF NOT EXISTS public.event
(
    event_id integer NOT NULL DEFAULT nextval('event_event_id_seq'::regclass),
    event_name text COLLATE pg_catalog."default",
    event_description text COLLATE pg_catalog."default",
    CONSTRAINT event_pkey PRIMARY KEY (event_id)
)
