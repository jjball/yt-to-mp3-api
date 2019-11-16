var express = require('express');
var router = express.Router();
var ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');

router.get('/video', function(req, res, next) {
  console.log(`Query: ${req.query.url}`);

  ytdl.getInfo(req.query.url, (err, info) => {
    if (err) res.status(400).send(`Error get info for url: ${req.query.url}`);
    let stream = ytdl(req.query.url, {
      quality: 'highestaudio',
      // filter: 'audioonly',
    });

    ffmpeg(stream)
      .audioBitrate(128)
      .save(`${__dirname}/../mp3-downloads/${info.title}.mp3`)
      .on('end', () => {
        console.log(`Done downloading ${req.query.url}.mp3`);
        res.status(200)
          .download(`${__dirname}/../mp3-downloads/${info.title}.mp3`);
      })
      .on('error', function(err) {
        console.log(`Error occured: ${err.message}`);
        res.status(400).send(`Error downloading from url: ${req.query.url}`);
      });
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
