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
     */
    await queryInterface.bulkInsert(
      'Wallets',
      [
        {
          id_currency: 1,
          id_user: 1,
          amount: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id_currency: 2,
          id_user: 1,
          amount: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id_currency: 3,
          id_user: 1,
          amount: 1000,
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
