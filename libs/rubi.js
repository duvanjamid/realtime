/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Libraries | Rubi
 * Romel Pérez, prhone.blogspot.com
 * Enero, 2015
 **/

var rubi = require('mongoose');
var config = require('../config');
var log = require('./log')('libs:rubi');


// -------------------------------------------------------------------------- //
// COLLECTIONS :: PORTAL //

// Usuarios.
var UsersSchema = rubi.Schema({
  _id: String,
  codEst: Number,
  codPos: Number,
  codProf: Number,
  active: Boolean,  // es un usuario activo
  admin: Boolean,  // es un administrador
  name: String,
  photo: String,
  ip: String,  // última ip conectada
  timeLastIn: Date,  // último login, momento de entrar
  timeLastOut: Date,  // último login, momento de salir
  devices: [{
    _id: String,  // socket
    agent: String  // el user-agent del navegador
  }]
}, {
  collection: 'users'
});
var UsersModel = rubi.model('users', UsersSchema);


// Mensajes.
var MessagesSchema = rubi.Schema({
  type: String,  // persistent | instant
  publishedBy: String,  // user id
  startDate: Date,  // mostrar desde cuando
  endDate: Date,  // hasta cuando
  message: String
}, {
  collection: 'messages'
});
var MessagesModel = rubi.model('messages', MessagesSchema);


// -------------------------------------------------------------------------- //
// COLLECTIONS :: AULACHAT //

// Classes.
var AC_ClassesSchema = rubi.Schema({
  subject: String,  // código de materia
  group: String,  // grupo
  guion: String,  // guión del aula
  teacher: String,
  students: [String],
  subgroups: [{
    _id: String,  // código del subgrupo del aula
    students: [String]  // estudiantes del subgrupo
  }]
}, {
  collection: 'ac_classes'
});
var AC_ClassesModel = rubi.model('ac_classes', AC_ClassesSchema);


// Rooms.
var AC_RoomsSchema = rubi.Schema({
  _id: String,  // nombre de la sala: MATERIA_GRUPO(_SUBGRUPO)
  type: String,  // tipo de sala: class | subgroup | guion
  available: Boolean,  // si se puede chatear o no (en caso de exámen o quiz)
  teacher: String,  // id de profesor si lo hay en la sala
  users: [{  // estudiantes y profesor si lo hay
    _id: String,
    socket: String,  // identificador del socket de conexión
    state: String,  // el estado: available | away | offline
    timeLastIn: Date,  // último login, momento de entrar
    timeLastOut: Date  // último login, momento de salir
  }],
  messages: [{
    _id: Date,  // datetime de publicación
    user: String,
    content: String  // contenido de la publicación
  }]
}, {
  collection: 'ac_rooms'
});
var AC_RoomsModel = rubi.model('ac_rooms', AC_RoomsSchema);


// -------------------------------------------------------------------------- //
// PUBLIC //

var controller = {

  // Mongoose.
  db: rubi,

  // Modelo de usuarios.
  users: UsersModel,

  // Modelo de mensajes.
  messages: MessagesModel,

  // Modelo de clases del aula.
  ac_classes: AC_ClassesModel,

  // Modelo de salas de chat del aula.
  ac_rooms: AC_RoomsModel,

  // Conectarse.
  connect: function (callback) {

    // Error al conectarse.
    rubi.connection.on('error', function (err) {
      callback(err);
      log.error('conectándose con rubi:', err);
    });

    // Cuando esté conectado.
    rubi.connection.once('open', callback);

    // Conectarse a la db.
    rubi.connect('mongodb://'+ config.mongodb.host +':'+ config.mongodb.port
    +'/'+ config.mongodb.db, {
      user: config.mongodb.user,
      pass: config.mongodb.pass,
      server: {socketOptions: {keepAlive: 1}},
      replset: {socketOptions: {keepAlive: 1}}
    });

    return this;
  },

  // Desconectarse.
  disconnect: function (callback) {
    rubi.disconnect(function (err) {
      if (err) {
        if (callback) callback(err);
        log.error('desconectándose de rubi:', err);
      } else {
        if (callback) callback();
      }
    });
    return this;
  }

};

// Hacer público el controlador.
module.exports = exports = controller;
