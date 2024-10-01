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
                                       CONSTRAINT UQ_97672ac88f789774dd47f7c8be3 UNIQUE (email),
                                       CONSTRAINT PK_a3ffb1c0c8416b9fc6f907b7433 PRIMARY KEY (id)
);

-- Создание таблицы tasks
CREATE TABLE taskflow_schema.tasks (
                                       id SERIAL NOT NULL,
                                       title VARCHAR NOT NULL,
                                       description VARCHAR NOT NULL,
                                       color VARCHAR NOT NULL,
                                       category VARCHAR NOT NULL,
                                       due_date TIMESTAMP NOT NULL,
                                       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                       updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                       is_completed BOOLEAN NOT NULL,
                                       user_id INTEGER,
                                       CONSTRAINT PK_8d12ff38fcc62aaba2cab748772 PRIMARY KEY (id),
                                       CONSTRAINT FK_db55af84c226af9dce09487b61b FOREIGN KEY (user_id) REFERENCES taskflow_schema.users (id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Команды для удаления таблиц и схемы (в обратном порядке) для очистки при необходимости
-- Включите их только для тестирования или инициализации
-- DROP TABLE IF EXISTS taskflow_schema.tasks;
-- DROP TABLE IF EXISTS taskflow_schema.users;
-- DROP SCHEMA IF EXISTS taskflow_schema CASCADE;
-- DROP DATABASE IF EXISTS taskflow_db;