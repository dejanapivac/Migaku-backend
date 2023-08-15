CREATE TABLE users
(
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    password        VARCHAR(255) NOT NULL,
    city            VARCHAR(255) NOT NULL,
    country         VARCHAR(255) NOT NULL
);

CREATE TABLE deeds
(
    id              SERIAL PRIMARY KEY,
    creator_user_id uuid,
    image           VARCHAR(255) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    category        VARCHAR(255) NOT NULL,
    street          VARCHAR(255) NOT NULL,
    zipCode         varchar(255),
    city            VARCHAR(255) NOT NULL,
    country         VARCHAR(255) NOT NULL,
    start_time      TIMESTAMP    NOT NULL,
    description     VARCHAR(255) NOT NULL,
    FOREIGN KEY (creator_user_id) REFERENCES users(id)
);

CREATE TABLE comments
(
    id            SERIAL PRIMARY KEY,
    comment_by_id uuid,
    deed_id       INT          NOT NULL,
    comment       VARCHAR(255) NOT NULL,
    FOREIGN KEY (comment_by_id) REFERENCES users (id),
    FOREIGN KEY (deed_id) REFERENCES deeds (id)
);

CREATE TABLE reviews
(
    review_id          SERIAL PRIMARY KEY NOT NULL,
    review_by_id       uuid,
    person_reviewed_id uuid,
    grade              INT                NOT NULL,
    review             VARCHAR(200)       NOT NULL,
    FOREIGN KEY (review_by_id) REFERENCES users (id),
    FOREIGN KEY (review_by_id) REFERENCES users (id)
);

CREATE TABLE attendants
(
    user_id     uuid
        references users,
    deed_id     integer
        references deeds,
    review_done boolean default false,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (deed_id) REFERENCES deeds (id)
);