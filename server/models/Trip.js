const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Agency = require('./Agency');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  agencyId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'agency_id',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'end_date',
  },
}, {
  tableName: 'trips',
  underscored: true,
});

Agency.hasMany(Trip, { foreignKey: 'agencyId', onDelete: 'CASCADE' });
Trip.belongsTo(Agency, { foreignKey: 'agencyId' });

module.exports = Trip;
