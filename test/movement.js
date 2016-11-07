//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//let mongoose = require("mongoose");
let Movement = require('../models/movement');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Movement', () => {
  "use strict";
  beforeEach((done) => { //Before each test we empty the database
      Movement.remove({}, (err) => {
         done();
      });
  });

  /*
  * Test the /GET route
  */
  describe('/GET movement', () => {
      it('it should GET all the movements', (done) => {
        chai.request(server)
            .get('/api/movement')
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
  describe('/POST movement', () => {
    it('it should not POST a movement without name field', (done) => {
      let movement = {};
      chai.request(server)
          .post('/api/movement')
          .send(movement)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('errors');
              res.body.errors.should.have.property('name');
              res.body.errors.name.should.have.property('kind').eql('required');
            done();
          });
    });

    it('it should POST a movement ', (done) => {
      let movement = {
        "name": "Flat Bench Press"
      };
      chai.request(server)
          .post('/api/movement')
          .send(movement)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Movement successfully added!');
              res.body.movement.should.have.property('name');
            done();
          });
    });

  });

  /*
   * Test the /GET/:id route
   */
  describe('/GET/:id movement', () => {
      it('it should GET a movement by the given id', (done) => {
        let movement = new Movement({
          "name": "Flat Bench Press"
        });
        movement.save((err, movement) => {
            chai.request(server)
            .get('/api/movement/' + movement.id)
            .send(movement)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id').eql(movement.id);
              done();
            });
        });
      });
  });

  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id movement', () => {
     it('it should UPDATE a movie given the id', (done) => {
       let movement = new Movement({
         "name": "Bench Press"
       });
       movie.save((err, movie) => {
               chai.request(server)
               .put('/api/movies/' + movie.id)
               .send({"name": "Flat Bench Press"})
               .end((err, res) => {
                   res.should.have.status(200);
                   res.body.should.be.a('object');
                   res.body.should.have.property('message').eql('Movie updated!');
                   res.body.movie.should.have.property('genre').eql('horror');
                 done();
               });
         });
     });
  });

   /*
    * Test the /DELETE/:id route
    */
    describe('/DELETE/:id movement', () => {
      it('it should DELETE a movement given the id', (done) => {
        let movement = new Movement({
          "name": "Flat Bench Press"
        });
        movement.save((err, movement) => {
               chai.request(server)
               .delete('/api/movement/' + movement.id)
               .end((err, res) => {
                   res.should.have.status(200);
                   res.body.should.be.a('object');
                   res.body.should.have.property('message').eql('Movement successfully deleted!');
                   res.body.result.should.have.property('ok').eql(1);
                   res.body.result.should.have.property('n').eql(1);
                 done();
               });
         });
      });
    });

});