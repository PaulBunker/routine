//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//let mongoose = require("mongoose");
let Movement = require('../models/movement');
let WorkoutMovement = require('../models/workoutMovement');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('WorkoutMovement', () => {
  "use strict";
  //TODO: I don't like all this nesting. There must be a better way
  beforeEach((done) => { //Before each test we empty the database
    WorkoutMovement.remove({}, (err) => {
     Movement.remove({},(err) => {
      done();
     });
   });
  });


  /*
  * Test the /GET route
  */
  describe('/GET workoutMovement', () => {
    it('it should GET all the movements', (done) => {
      chai.request(server)
      .get('/api/workoutMovement')
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
  describe('/POST workoutMovement', () => {
    it('it should not POST a workoutMovement without movement field', (done) => {
      let workoutMovement = {
        "numSets" : 3,
        "repRange" : "3/9"
      };
      chai.request(server)
      .post('/api/workoutMovement')
      .send(workoutMovement)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('movement');
        res.body.errors.movement.should.have.property('kind').eql('required');
        done();
      });
    });

    it('it should not POST a workoutMovement with incorrect movement id', (done) => {
      let workoutMovement = {
        "movement": 1,
        "numSets" : 3,
        "repRange" : "3/9"
      };
      chai.request(server)
      .post('/api/workoutMovement')
      .send(workoutMovement)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('movement');
        res.body.errors.movement.should.have.property('name').eql('CastError');
        done();
      });
    });

    it('it should not POST a workoutMovement', (done) => {
      let movement = new Movement({
        "name": "Flat Bench Press"
      });
      movement.save((err, movement) => {
        let workoutMovement = {
          "movement": movement.id,
          "numSets" : 3,
          "repRange" : "3/9"
        };
        chai.request(server)
        .post('/api/workoutMovement')
        .send(workoutMovement)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Workout Movement successfully added!');
          done();
        });
      });
    });
  });


  /*
  * Test the /GET/:id route
  */
  describe('/GET/:id workoutMovement', () => {
    it('it should GET a workoutMovement by the given id', (done) => {
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
          chai.request(server)
          .get('/api/workoutMovement/' + workoutMovement.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('_id').eql(workoutMovement.id);
            res.body.should.have.property('movement');
            res.body.movement.should.be.a('object');
            res.body.movement.should.have.property('_id').eql(movement.id);

            done();
          });
        });
      });
    });
  });


  /*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id workoutMovement', () => {
    it('it should UPDATE a workoutMovement given the id', (done) => {
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
          chai.request(server)
          .put('/api/workoutMovement/' + workoutMovement.id)
          .send({"numSets": 5})
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Workout Movement updated!');
            res.body.workoutMovement.should.have.property('numSets').eql(5);
            res.body.workoutMovement.should.have.property('repRange').eql("3/9");
            done();
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
          chai.request(server)
          .delete('/api/workoutMovement/' + workoutMovement.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Workout Movement successfully deleted!');
            res.body.result.should.have.property('ok').eql(1);
            res.body.result.should.have.property('n').eql(1);
            done();
          });
        });

      });
     });
   });

});