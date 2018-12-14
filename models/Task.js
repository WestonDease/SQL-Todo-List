module.exports = function(sequelize, DataTypes) {
    // Create the model called Todo. The model should include two fields:
    //  text: DataTypes.STRING,
    //  complete: DataTypes.BOOLEAN
    // });
    const Todo = sequelize.define("Todo", {
      description: DataTypes.STRING,
      check: DataTypes.INTEGER
    } , {
      freezeTableName: true
    });
    return Todo;
  };