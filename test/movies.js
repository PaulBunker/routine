//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//let mongoose = require("mongoose");
let Movie = require('../models/movie');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Movies', () => {
  "use strict";
  beforeEach((done) => { //Before each test we empty the database
      Movie.remove({}, (err) => {
         done();
      });
  });
  /*
  * Test the /GET route
  */
  describe('/GET movie', () => {
      it('it should GET all the movies', (done) => {
        chai.request(server)
            .get('/api/movies')
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
  describe('/POST movie', () => {
    it('it should not POST a movie without director field', (done) => {
      let movie = {
        "title": "jurrasic",
        "releaseYear": "2015",
        //"director": "ami",
        "genre": "entertain"
      };
      chai.request(server)
          .post('/api/movies')
          .send(movie)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('errors');
              res.body.errors.should.have.property('director');
              res.body.errors.director.should.have.property('kind').eql('required');
            done();
          });
    });

    it('it should POST a movie ', (done) => {
      let movie = {
        "title": "jurrasic",
        "releaseYear": "2015",
        "director": "ami",
        "genre": "entertain"
      };
      chai.request(server)
          .post('/api/movies')
          .send(movie)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Movie successfully added!');
              res.body.movie.should.have.property('title');
              res.body.movie.should.have.property('releaseYear');
              res.body.movie.should.have.property('director');
              res.body.movie.should.have.property('genre');
            done();
          });
    });

  });

  /*
   * Test the /GET/:id route
   */
  describe('/GET/:id movies', () => {
      it('it should GET a movie by the given id', (done) => {
        let movie = new Movie({
          "title": "jurrasic",
          "releaseYear": "2015",
          "director": "ami",
          "genre": "entertain"
        });
        movie.save((err, movie) => {
            chai.request(server)
            .get('/api/movies/' + movie.id)
            .send(movie)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('releaseYear');
                res.body.should.have.property('director');
                res.body.should.have.property('director');
                res.body.should.have.property('_id').eql(movie.id);
              done();
            });
        });

      });
  });

  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id movies', () => {
     it('it should UPDATE a movie given the id', (done) => {
       let movie = new Movie({
         "title": "jurrasic",
         "releaseYear": "2015",
         "director": "ami",
         "genre": "entertain"
       });
       movie.save((err, movie) => {
               chai.request(server)
               .put('/api/movies/' + movie.id)
               .send({"title": "jurrasic", "releaseYear": "2015", "director": "ami", "genre": "horror"})
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
    describe('/DELETE/:id movie', () => {
      it('it should DELETE a movie given the id', (done) => {
        let movie = new Movie({
          "title": "jurrasic",
          "releaseYear": "2015",
          "director": "ami",
          "genre": "entertain"
        });
        movie.save((err, movie) => {
               chai.request(server)
               .delete('/api/movies/' + movie.id)
               .end((err, res) => {
                   res.should.have.status(200);
                   res.body.should.be.a('object');
                   res.body.should.have.property('message').eql('Movie successfully deleted!');
                   res.body.result.should.have.property('ok').eql(1);
                   res.body.result.should.have.property('n').eql(1);
                 done();
               });
         });
      });
    });

});