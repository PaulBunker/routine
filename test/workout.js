//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//let mongoose = require("mongoose");
let Movement = require('../models/movement');
let WorkoutMovement = require('../models/workoutMovement');
let Workout = require('../models/workout');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
//let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Workout', () => {
  "use strict";
  //TODO: I don't like all this nesting. There must be a better way
  beforeEach((done) => { //Before each test we empty the database
    Workout.remove({}, (err) => {
      WorkoutMovement.remove({}, (err) => {
        Movement.remove({},(err) => {
         done();
        });
      });
    });
  });

  /*
  * Test the /GET route
  */
  describe('/GET Workout', () => {
    it('it should GET all the Workouts', (done) => {
      chai.request(server)
      .get('/api/Workout')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });
  });


  /*
  * Test the /POST route
  */
  describe('/POST workout', () => {

    it('it should not POST a workout without name field', (done) => {
      let workout = {
        "workoutMovements" : []
      };
      chai.request(server)
      .post('/api/workout')
      .send(workout)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('name');
        res.body.errors.name.should.have.property('kind').eql('required');
        done();
      });
    });
  });


  /*
  * Test the /GET/:id route
  */
  describe('/GET/:id workout', () => {
    it('it should GET a workout by the given id', (done) => {
      let movement = new Movement({
        "name": "Flat Bench Press"
      });
      movement.save((err, movement) => {
        let workoutMovement = new WorkoutMovement({
          "movement": movement.id,
          "numSets" : 3,
          "repRange" : "3/9"
        });
        workoutMovement.save((err, workoutMovement) => {
          let workout = new Workout({
            name:'Chest Day #1',
            workoutMovements:[workoutMovement.id]
          });
          workout.save((err, workout) => {

            chai.request(server)
            .get('/api/workout/' + workout.id)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('name').eql(workout.name);
              res.body.should.have.property('_id').eql(workout.id);
              done();
            });
          });
        });
      });
    });
  });



  /*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id workout', () => {

    it('it should UPDATE a movement given the id', (done) => {
      let movement = new Movement({
        "name": "Flat Bench Press"
      });
      movement.save((err, movement) => {
       let workoutMovement = new WorkoutMovement({
         "movement": movement.id,
         "numSets" : 3,
         "repRange" : "3/9"
       });
       workoutMovement.save((err, workoutMovement) => {
         let workout = new Workout({
           name:'Chest Day #1',
           workoutMovements:[workoutMovement.id]
         });
         workout.save((err, workout) => {
           chai.request(server)
           .put('/api/workout/' + workout.id)
           .send({name:'hi'})
           .end((err, res) => {
             res.should.have.status(200);
             res.body.should.be.a('object');
             res.body.should.have.property('message').eql('Workout updated!');

             done();
           });
         });
       });
     });
    });

    it('it should UPDATE a workout given the id', (done) => {
      //set up some data!
      let movements = [{"name": "Flat Bench Press"},{"name": "Incline Bench Press"}];
      Movement.create(movements, (err, movements) => {

        let workoutMovements = [
          {
            "movement": movements[0].id,
            "numSets" : 3,
            "repRange" : "3/9"
          },
          {
            "movement": movements[1].id,
            "numSets" : 3,
            "repRange" : "3/9"
          }
        ];

        WorkoutMovement.create(workoutMovements, (err, workoutMovements) => {
          let workout = new Workout({
            name:'Chest Day #1',
            workoutMovements:[workoutMovements[0].id,workoutMovements[1].id]
          });

          workout.save((err, workout) => {

            chai.request(server)
            .put('/api/workout/' + workout.id)
            .send({
              name:"Epic Chest Day",
              workoutMovements:[workoutMovements[1].id,workoutMovements[0].id]
            })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Workout updated!');
              res.body.workout.should.have.property('name').eql("Epic Chest Day");
              res.body.workout.should.have.property('workoutMovements');
              res.body.workout.workoutMovements[0].should.eql(workoutMovements[1].id);
              done();
            });
          });
        });
      });
    });
  });

  /*
   * Test the /DELETE/:id route
   */
   describe('/DELETE/:id workoutMovement', () => {
     it('it should DELETE a movement given the id', (done) => {
       let movement = new Movement({
         "name": "Flat Bench Press"
       });
       movement.save((err, movement) => {
        let workoutMovement = new WorkoutMovement({
          "movement": movement.id,
          "numSets" : 3,
          "repRange" : "3/9"
        });
        workoutMovement.save((err, workoutMovement) => {
          let workout = new Workout({
            name:'Chest Day #1',
            workoutMovements:[workoutMovement.id]
          });
          workout.save((err, workout) => {
            chai.request(server)
            .delete('/api/workout/' + workout.id)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Workout successfully deleted!');
              res.body.result.should.have.property('ok').eql(1);
              res.body.result.should.have.property('n').eql(1);
              done();
            });
          });
        });
      });
     });
   });



});