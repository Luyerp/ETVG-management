-- ETVG / ETVM_db — run against database ETVM_db
-- PostgreSQL

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  description VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  slot_id INT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  tel VARCHAR(20),
  entry_date TIMESTAMP,
  withdraw_date TIMESTAMP,
  role_id INT REFERENCES roles (id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- Operator accounts: password required for destructive actions (e.g. delete member)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(200),
  role_id INT NOT NULL REFERENCES roles (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  member_id INT REFERENCES members (id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_members_role_id ON members (role_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
