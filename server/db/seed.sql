-- PanelTracker does not seed accounts or progress records.
-- Users must register through Express so passwords are always hashed by bcrypt.
-- This keeps db:reset safe to run against a new database without inventing
-- credentials or assigning shared progress to a user.
SELECT 1;
