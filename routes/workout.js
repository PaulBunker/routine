var express = require('express');
var router = express.Router();
var Workout = require('../models/workout');



router.route('/')

  .get(function(req, res) {
    "use strict";
    Workout.find(function(err, workout) {

      if (err) {
        return res.send(err);
      }

      res.json(workout);

    });

  })

  .post(function(req, res) {
    "use strict";
    var newWorkout = new Workout(req.body);

    newWorkout.save(function(err, workout) {
      if (err) {
        return res.send(err);
      }
      res.json({ message: "Workout successfully added!", workout });
    });

  });


router.route('/:id')

  .put(function(req,res){
    "use strict";
    Workout.findOne({ _id: req.params.id }, function(err, workout) {

      if (err) {
        return res.send(err);
      }

      for (let prop in req.body) {
        workout[prop] = req.body[prop];
      }

      // save the workout movement
      workout.save(function(err) {
        if (err) {
          return res.send(err);
        }

        res.json({ message: 'Workout updated!', workout });
      });
    });
  })

  .get(function(req, res) {
    "use strict";
    Workout.findOne({ _id: req.params.id})
      .populate({
        path : 'workoutMovements',
        populate: { path:'movement' }
      })
      .exec(function(err, workout ) {

        if (err) {
          return res.send(err);
        }

        res.json(workout);

      }
    );
  })

  .delete(function(req, res) {
    "use strict";
    Workout.remove({
      _id: req.params.id
    }, function(err, result) {
      if (err) {
        return res.send(err);
      }

    res.json({ message: 'Workout successfully deleted!', result });
  });
});



module.exports = router;
