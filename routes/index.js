var express = require('express');
var router = express.Router();
var ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');

router.get('/video', function(req, res, next) {
  console.log(`Query: ${req.query.url}`);
  let stream = ytdl(req.query.url, {
    quality: 'highestaudio',
    // filter: 'audioonly',
  });

  ffmpeg(stream)
    .audioBitrate(128)
    .save(`${__dirname}/../mp3-downloads/firstdownloaded.mp3`)
    .on('end', () => {
      console.log(`Done downloading ${req.query.url}.mp3`);
    })
    .on('error', function(err) {
      console.log(`Error occured: ${err.message}`);
    });

  res.json(req.query.url);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
