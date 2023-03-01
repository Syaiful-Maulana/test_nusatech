'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     *
     */
    await queryInterface.bulkInsert(
      'Currencies',
      [
        {
          name: 'Rupiah',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Dolar',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Real',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Yen',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
