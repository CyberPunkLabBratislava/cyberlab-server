// Global packages
var logger = require('../util/logger');

// Private

function buildLog(ini, message, agent, other){
  try{
    var aux = message;
    var date = new Date();
    var duration = date.getTime() - ini.getTime();
    aux = typeof agent !== 'undefined' ? agent + " - " + aux : "Unknown" + " - " + aux;
    aux = date.toISOString() + " - " + aux;
    aux = aux + " - " + duration + "ms";
    if(typeof other === 'object'){
      aux = aux + goThroughObject(other);
    } else if(typeof other === 'string'){
      aux = aux + " - " + other;
    } else {
      aux = aux;
    }
    return aux;
  } catch(err) {
    return err;
  }
}

function goThroughObject(other){
  var aux = "";
  for(var i in other){
    aux = aux + " - " + i + " : " + other[i];
  }
  return aux;
}

// Public Constructor

module.exports = Log;

function Log() {
  this.initial_time = new Date();
}

// Methods

Log.prototype.debug = function(message, agent, other){
  if(process.env.NODE_ENV !== "production"){
    logger.debug(buildLog(this.initial_time, message, agent, other));
  }
};

Log.prototype.info = function(message, agent, other){
  logger.info(buildLog(this.initial_time, message, agent, other));
};

Log.prototype.warn = function(message, agent, other){
  logger.warn(buildLog(this.initial_time, message, agent, other));
};

Log.prototype.error = function(message, agent, other){
  logger.error(buildLog(this.initial_time, message, agent, other));
};
