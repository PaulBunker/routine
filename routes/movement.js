var express = require('express');
var router = express.Router();
var Movement = require('../models/movement');



router.route('/')

  .get(function(req, res) {
    "use strict";
    Movement.find(function(err, movies) {

      if (err) {
        return res.send(err);
      }

      res.json(movies);

    });

  })

  .post(function(req, res) {
    "use strict";
    var newMovement = new Movement(req.body);

    newMovement.save(function(err, movement) {
      if (err) {
        return res.send(err);
      }
      res.json({ message: "Movement successfully added!", movement });
    });

  });


router.route('/:id')

  .put(function(req,res){
    "use strict";
    Movement.findOne({ _id: req.params.id }, function(err, movement) {

      if (err) {
        return res.send(err);
      }

      for (let prop in req.body) {
        movement[prop] = req.body[prop];
      }

      // save the movement
      movement.save(function(err) {
        if (err) {
          return res.send(err);
        }

        res.json({ message: 'Movement updated!', movement });
      });
    });
  })

  .get(function(req, res) {
    "use strict";
    Movement.findOne({ _id: req.params.id}, function(err, movement) {
      if (err) {
        return res.send(err);
      }

      res.json(movement);
    });
  })

  .delete(function(req, res) {
    "use strict";
    Movement.remove({
      _id: req.params.id
    }, function(err, result) {
      if (err) {
        return res.send(err);
      }

    res.json({ message: 'Movement successfully deleted!', result });
  });
});



module.exports = router;
