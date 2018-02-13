require('harmonize')() // Node 0.12 fix

var should = require('chai').should()
var Metalsmith = require('metalsmith')
var metadata = require('../lib/index.js')

it('should read a single JSON file and put into metalsmith.metadata()', function (done) {
  var metalsmith = Metalsmith('test/fixtures/json-single').source('./src').use(metadata({ directory: './**/*.json' }))
  metalsmith.build(function(err) {
    if (err) {
      return done(err)
    }

    metalsmith.metadata().should.deep.equal({ 'example': { text: 'Text from a json file' } })

    done()
  })
})

it('should read multiple JSON files and put into metalsmith.metadata()', function (done) {
  var metalsmith = Metalsmith('test/fixtures/json-multiple').source('./src').use(metadata({ directory: './**/*.json' }))
  metalsmith.build(function(err) {
    if (err) {
      return done(err)
    }

    metalsmith.metadata().should.deep.equal({ 'example': { text: 'Text from a json file' }, 'subdirectory/site': { url: 'http://test.dev' } })

    done()
  })
})

it('should read multiple JSON files, including subdirctories and put into metalsmith.metadata()', function (done) {
  var metalsmith = Metalsmith('test/fixtures/json-subdirectory').source('./src').use(metadata({ directory: './**/*.json' }))
  metalsmith.build(function(err) {
    if (err) {
      return done(err)
    }

    metalsmith.metadata().should.deep.equal({ 'example': { text: 'Text from a json file' }, 'subdirectory/site': { url: 'http://test.dev' } })

    done()
  })
})

it('should error if a JSON file is malformed', function (done) {
  var metalsmith = Metalsmith('test/fixtures/json-malformed').source('./src').use(metadata({ directory: './**/*.json' }))
  metalsmith.build(function(err) {
    errMessage = String(err);
    err.should.be.an('error')
    errMessage.should.equal('Error: Malformed .json data in example.json')

    done() // don't return the error to metalsmith
  })
})

it('should ignore a JSON file if is empty', function (done) {
  var metalsmith = Metalsmith('test/fixtures/json-empty').source('./src').use(metadata({ directory: './**/*.json' }))
  metalsmith.build(function(err) {
    if (err) {
      return done(err)
    }

    metalsmith.metadata().should.deep.equal({ 'example': { text: 'Text from a json file' } })

    done()
  })
})
