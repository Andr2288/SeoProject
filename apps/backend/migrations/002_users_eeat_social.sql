-- E-E-A-T (лаб. №2): публічні профілі авторів
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500),
    ADD COLUMN IF NOT EXISTS github_url VARCHAR(500);

COMMENT ON COLUMN users.linkedin_url IS 'Публічне посилання на LinkedIn (лаб. E-E-A-T)';
COMMENT ON COLUMN users.github_url IS 'Публічне посилання на GitHub (лаб. E-E-A-T)';
