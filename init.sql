-- Создание схемы, если она не существует
CREATE SCHEMA IF NOT EXISTS taskflow_schema;


-- Создание таблицы users
CREATE TABLE taskflow_schema.users (
                                       id SERIAL NOT NULL,
                                       username VARCHAR NOT NULL,
                                       email VARCHAR NOT NULL,
                                       password VARCHAR NOT NULL,
                                       user_pic VARCHAR,
                                       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                       updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                       deleted_at TIMESTAMP WITH TIME ZONE NULL,
                                       CONSTRAINT UQ_97672ac88f789774dd47f7c8be3 UNIQUE (email),
                                       CONSTRAINT PK_a3ffb1c0c8416b9fc6f907b7433 PRIMARY KEY (id)
);

-- Создание таблицы tasks
CREATE TABLE taskflow_schema.tasks (
                                       id SERIAL NOT NULL,
                                       title VARCHAR NOT NULL,
                                       description VARCHAR,
                                       color VARCHAR,
                                       category VARCHAR,
                                       due_date TIMESTAMP NOT NULL,
                                       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                       updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                       is_completed BOOLEAN NOT NULL,
                                       user_id INTEGER,
                                       CONSTRAINT PK_8d12ff38fcc62aaba2cab748772 PRIMARY KEY (id),
                                       CONSTRAINT FK_db55af84c226af9dce09487b61b FOREIGN KEY (user_id) REFERENCES taskflow_schema.users (id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE taskflow_schema.settings (

                                         id         SERIAL                   NOT NULL,
                                         language   VARCHAR                  NOT NULL,
                                         theme      VARCHAR                  NOT NULL,
                                         created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                         updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                         user_id    INTEGER,
                                         CONSTRAINT REL_a2883eaa72b3b2e8c98e744609 UNIQUE (user_id),
                                         CONSTRAINT PK_0669fe20e252eb692bf4d344975 PRIMARY KEY (id)
);

ALTER TABLE taskflow_schema.settings
    ADD CONSTRAINT FK_a2883eaa72b3b2e8c98e7446098 FOREIGN KEY (user_id)
        REFERENCES taskflow_schema.users (id)
        ON DELETE CASCADE ON UPDATE NO ACTION;

