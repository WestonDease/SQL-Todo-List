const db = require('../models/');

const mongoose = require("mongoose");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {

  //get routes
  app.get('/api/task', function(req, res) {
    db.Todo.findAll({})
    .then(function(data) {
      console.log(data);
      res.json(data);
    })
    .catch(function(err) {
      res.json(err);
    });
  });
  
  app.get('/api/task/:task', function(req, res) {
    const matchingTasks = [];
    db.Todo.find({})
    .then(function(data) {
      data.forEach(task => {
        if (task.description === req.params.task){
          matchingTasks.push(task);
        }
      })
      res.json(matchingTasks);
    })
    .catch(function(err) {
      res.json(err);
    });
  });
  
  // post routes
  app.post('/api/task', function(req, res) {
    //console.log(req.body);
    db.Todo.create({
        description: req.body.description,
        check: req.body.check
    })
    // .then(function(dbItem) {
    //   return res.json(dbItem);
    // })
    .then(function(data) {
      //console.log(data);
      res.json(data);
    })
    .catch(function(err) {
      res.json(err);
    });
  });

  /// put routes
  app.put('/api/task/:task', function(req, res) {
    db.Todo.update({
        description: req.body.description,
        check: req.body.check
    }, {
        where: {
            description: req.params.task
        }})
    .then(function(dbItem) {
      //console.log(dbItem);
      return res.json(dbItem);
    })
      .catch(function(err) {
      res.json(err);
    });
  });

  //delete routes
  app.delete('/api/task/:task', function(req, res) {
    //console.log(req.params.task);
    db.Todo.destroy({
        where: {
            description: req.params.task
        }
        })
    .then(function(dbItem) {
      //console.log(dbItem);
      return res.json(dbItem);
    })
      .catch(function(err) {
      res.json(err);
    });
  });

  app.delete('/api/task/:id', function(req, res) {
    //console.log(req.params.task);
    db.Todo.findOneAndDelete({_id: req.params.id})
    .then(function(dbItem) {
      //console.log(dbItem);
      return res.json(dbItem);
    })
      .catch(function(err) {
      res.json(err);
    });
  });
}
