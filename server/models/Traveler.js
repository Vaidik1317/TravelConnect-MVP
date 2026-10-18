const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Trip = require('./Trip');

const Traveler = sequelize.define('Traveler', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tripId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'trip_id',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  travelerId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'traveler_id',
  },
}, {
  tableName: 'travelers',
  underscored: true,
});

Trip.hasMany(Traveler, { foreignKey: 'tripId', onDelete: 'CASCADE' });
Traveler.belongsTo(Trip, { foreignKey: 'tripId' });

module.exports = Traveler;
