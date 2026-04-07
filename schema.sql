-- ================================================
-- Industry Readiness Scoring System (IRSS) Schema
-- ================================================
-- Run this in your MySQL client before starting the backend.

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS irss_db;
USE irss_db;

-- 2. Users table
CREATE TABLE IF NOT EXISTS users (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- 3. Scores table
CREATE TABLE IF NOT EXISTS scores (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT          NOT NULL,
    cgpa           FLOAT        NOT NULL,
    skills         INT          NOT NULL,
    internships    INT          NOT NULL,
    certifications INT          NOT NULL,
    projects       INT          NOT NULL,
    total_score    INT          NOT NULL,
    status         VARCHAR(50)  NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Verification: DONE
-- Tables will also be auto-created via Spring JPA (ddl-auto=update).
-- This script is provided for manual reference.
