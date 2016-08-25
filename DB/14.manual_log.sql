drop table manual_logs cascade;

CREATE TABLE manual_logs (
	pk serial primary key,
	employees_pk int references employees(pk),
	type text not null,
	time_log timestamptz NOT NULL,
	date_created timestamptz default now(),
	archived boolean default false
);

ALTER TABLE manual_logs owner to chrs;

create table manual_logs_status (
	manual_logs_pk int references manual_logs(pk),
	status text default 'Pending',
	created_by int references employees(pk),
	date_created timestamptz default now(),
	remarks text not null,
	archived boolean default false
);
ALTER TABLE manual_logs_status owner to chrs;