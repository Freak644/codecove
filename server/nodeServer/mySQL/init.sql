/*
===================================
    🗄️database: if not exists;
===================================
*/

CREATE DATABASE IF NOT EXISTS codecove_db;
USE codecove_db;

/*
===================================
  🧑‍💻Create the users table if not exists;
===================================
*/

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(50) NOT NULL UNIQUE CHECK (LENGTH(username) > 0),
    email VARCHAR(100) NOT NULL UNIQUE CHECK (LENGTH(email) > 0),
    password VARCHAR(255) NOT NULL CHECK (LENGTH(password) > 0),
    avatar VARCHAR(255) DEFAULT '/Images/Avtar/default.png',
    bio VARCHAR(100) DEFAULT 'Stay! Ahead, Follow the Revolution',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
===================================
  🧑‍💻Create session Store table if not exists;
===================================
*/

CREATE TABLE IF NOT EXISTS user_sessions (
  session_id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  id CHAR(36) NOT NULL,
  ip VARCHAR(45),
  country VARCHAR(64),
  region VARCHAR(128),
  city VARCHAR(128),
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  isp VARCHAR(255),
  user_agent TEXT,
  browser VARCHAR(64),
  browser_version VARCHAR(32),
  os VARCHAR(64),
  device_type VARCHAR(64) DEFAULT 'desktop',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked BOOLEAN DEFAULT FALSE,
  last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (id)
);

/*
===================================
  🖼️ POST Table
===================================
*/

CREATE TABLE IF NOT EXISTS posts (
  post_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  id CHAR(36) NOT NULL,
  image_url VARCHAR(255),
  caption TEXT,
  visibility BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (id)
);