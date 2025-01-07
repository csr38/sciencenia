import { QueryInterface } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  // Step 1: Remove duplicates
  await queryInterface.sequelize.query(`
    DELETE FROM "Scholarships"
    WHERE id NOT IN (
      SELECT MIN(id)
      FROM "Scholarships"
      GROUP BY "studentId", "applicationPeriodId"
    );
  `);

  // Step 2: Add the unique index on studentId and applicationPeriodId
  await queryInterface.addIndex('Scholarships', ['studentId', 'applicationPeriodId'], {
    name: 'Scholarship_student_application_unique',
    unique: true,
  });
};

export const down = async ({ context: queryInterface }: { context: QueryInterface }) => {
  // Step to remove the index in case of rollback
  await queryInterface.removeIndex('Scholarships', 'Scholarship_student_application_unique');
};
