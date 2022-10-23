CREATE TABLE "user" (
    user_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE user_docs (
    doc_id uuid PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content JSON,
    user_id INT,
    CONSTRAINT fk_user_id
        FOREIGN KEY(user_id)
            REFERENCES "user"(user_id)
);

ALTER TABLE user_docs 
    ALTER COLUMN title SET DEFAULT 'Untitled';

