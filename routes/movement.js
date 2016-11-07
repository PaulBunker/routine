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

  // .put(function(req,res){
  //   Movie.findOne({ _id: req.params.id }, function(err, movie) {
  //     if (err) {
  //       return res.send(err);
  //     }

  //     for (prop in req.body) {
  //       movie[prop] = req.body[prop];
  //     }

  //     // save the movie
  //     movie.save(function(err) {
  //       if (err) {
  //         return res.send(err);
  //       }

  //       res.json({ message: 'Movie updated!', movie });
  //     });
  //   });
  // })

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
