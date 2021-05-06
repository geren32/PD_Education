const { DataTypes } = require('sequelize');
module.exports = function(sequelize ) {
  return sequelize.define('pages', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    banner: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sections: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    template: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    created_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    updated_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    slag: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.INTEGER,
      defaultValue: Math.floor(new Date().getTime() / 1000)
  },
  updatedAt: {
      type: DataTypes.INTEGER,
      defaultValue: Math.floor(new Date().getTime() / 1000)
  }
  }, {
    sequelize,
    tableName: 'pages',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
