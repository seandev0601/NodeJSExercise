const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require("../config/database.js");

const User = sequelize.define('User', {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING },
  favoriteColor: { type: DataTypes.TEXT, defaultValue: 'green' },
  age: DataTypes.INTEGER,
  cash: DataTypes.INTEGER
}, {
  // Other model options go here
});

(async () => {
  await sequelize.sync();
  // Code here
  console.log('Create User table successfully.')

  //Insert
  // const jane = await User.create({ firstName: "Jane" });
  // Jane exists in the databas e now!

  // const insert_users = await User.bulkCreate([
  //   { firstName: 'Jack', age: 20, favoriteColor: 'red' },
  //   { firstName: 'Jones', age: 18, favoriteColor: 'black' },
  //   { firstName: 'Emma', age: 30, favoriteColor: 'pink' }
  // ]);
  // console.log(insert_users.length)
  

  //Select
  // Find all users
  const users = await User.findAll();
  console.log(users.length);
  console.log("All users:", JSON.stringify(users, null, 2));

  //Select firstName and favoriteColor
  // const users_name_color = await User.findAll({
  //   attributes: ['firstName', 'favoriteColor']
  // });
  // console.log("All users:", JSON.stringify(users_name_color, null, 2));

  //Select exclude favoriteColor
  // const users_exclude_color = await User.findAll({
  //   attributes: { exclude: ['favoriteColor']}
  // });
  // console.log("All users:", JSON.stringify(users_exclude_color, null, 2));

  //Select where firstName = Jane
  // const users_where_name = await User.findAll({
  //   where: {
  //     firstName: 'Jane'
  //   }
  // });
  // console.log("All users:", JSON.stringify(users_where_name, null, 2));

  // Find all users Order by age
  // const users_order_age = await User.findAll({
  //   order: [
  //     ['age', 'DESC']
  //   ]
  // });
  // console.log("All users:", JSON.stringify(users_order_age, null, 2));

  // Find all users Group by age
  // const users_group_age = await User.findAll({ 
  //   group: 'age',
  //   attributes: [
  //     'age', 
  //     [sequelize.fn('COUNT', sequelize.col('age')), 'count']
  //   ]
  // });
  // console.log("All users:", JSON.stringify(users_group_age, null, 2));

  // Fetch age DESC, top 3 instances/rows
  // const users_limit = await User.findAll({ 
  //   limit: 3,
  //   attributes: { exclude: ['cash','favoriteColor']},
  //   order:[
  //     ['age', 'DESC']
  //   ]
  // });
  // console.log(users_limit.length);
  // console.log("All users:", JSON.stringify(users_limit, null, 2));

  // Update
  // Change everyone without a last name to "Doe"
  // await User.update({ lastName: "Doe" }, {
  //   where: {
  //     lastName: null
  //   }
  // });

  // Change everyone without a age to 20
  // await User.update({ age: 20 }, {
  //   where: {
  //     age: null
  //   }
  // });

  // Delete
  // Delete everyone named "Jane"
  // await User.destroy({
  //   where: {
  //     firstName: "Jane"
  //   }
  // });
  
})();