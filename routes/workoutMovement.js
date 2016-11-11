var express = require('express');
var router = express.Router();
var WorkoutMovement = require('../models/workoutMovement');



router.route('/')

  .get(function(req, res) {
    "use strict";
    WorkoutMovement.find(function(err, workoutMovement) {

      if (err) {
        return res.send(err);
      }

      res.json(workoutMovement);

    });

  })

  .post(function(req, res) {
    "use strict";
    var newWorkoutMovement = new WorkoutMovement(req.body);

    newWorkoutMovement.save(function(err, workoutMovement) {
      if (err) {
        return res.send(err);
      }
      res.json({ message: "Workout Movement successfully added!", workoutMovement });
    });

  });


router.route('/:id')

  .put(function(req,res){
    "use strict";
    WorkoutMovement.findOne({ _id: req.params.id }, function(err, workoutMovement) {

      if (err) {
        return res.send(err);
      }

      for (let prop in req.body) {
        workoutMovement[prop] = req.body[prop];
      }

      // save the workout movement
      workoutMovement.save(function(err) {
        if (err) {
          return res.send(err);
        }

        res.json({ message: 'Workout Movement updated!', workoutMovement });
      });
    });
  })

  .get(function(req, res) {
    "use strict";
    WorkoutMovement.findOne({ _id: req.params.id})
      .populate('movement')
      .exec(function(err, workoutMovement) {
      if (err) {
        return res.send(err);
      }

      res.json(workoutMovement);
    });
  })

  .delete(function(req, res) {
    "use strict";
    WorkoutMovement.remove({
      _id: req.params.id
    }, function(err, result) {
      if (err) {
        return res.send(err);
      }

    res.json({ message: 'Workout Movement successfully deleted!', result });
  });
});



module.exports = router;
