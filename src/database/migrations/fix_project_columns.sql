-- Fix project table column names to match Sequelize model
ALTER TABLE project RENAME COLUMN budget TO "totalBudget";
ALTER TABLE project RENAME COLUMN storeys TO "numberOfStoreys";
ALTER TABLE project RENAME COLUMN progress TO "progressPercentage";

