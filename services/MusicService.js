const Music = require('../models/MusicModel');
const musicUtil = require('../utils/mediaUtil');
const slug = require('slug');


exports.test = (req, res) => {
    res.status(200).json({
        info: "Music Controller is working!"
    })
};

exports.createMusic = (req, res) => {
    Music.find({title: req.body.title, year: req.body.year, author: req.body.author})
    .exec()
    .then(music =>{
        if(music.length === 0){
            let newMusic = new Music({
                title: req.body.title,
                description: req.body.description,
                author: req.body.description,
                album: req.body.album,
                year: req.body.year,
                genre: req.body.genre,
                tags: req.body.tags,
                language: req.body.language,
                slug: slug(req.body.title+'_'+req.body.year),
                file_path: process.env.MUSIC_PATH + slug(req.body.title+'_'+req.body.year),
                length: req.body.length,
                age_rate: req.body.age_rate
            });
            newMusic.save()
                .then( () => {
                    musicUtil.res(res, 201, {msg: "Created Meta Data for Music", slg: newMusic.slug});
                })
                .catch(error =>{
                    console.log(error);
                    musicUtil.res(res, 500, "Cannot create music");
                })
        }else{
            musicUtil.res(res, 404, "Music already exist");
        }
    })
    .catch(error =>{
        musicUtil.res(res, 500, 'Error while searching for Music ' + error);
    })
};

exports.uploadMusic = (req, res) => {
    Music.find({slug: req.params.slug})
        .exec()
        .then(music =>{
            if(music.length === 1){
                let file = process.env.MUSIC_PATH + req.params.slug;
                musicUtil.upload(req, res, file);
            }else{
                musicUtil.res(res, 409, "Existing two or more movies with same slug");
            }
        })
        .catch(error =>{
            musicUtil.res(res, 404, "Problem with movie " + error);
        })
}

exports.getMusic = (req, res) => {
    Music.find({slug: req.params.slug})
        .exec()
        .then(music =>{
            if(music.length === 1){
                musicUtil.res(res, 200, music[0]);
            }else{
                musicUtil.res(res, 404, "Music has not been found!");
            }
        })
        .catch(error =>{
            console.log(error);
            musicUtil.res(res, 500, "Internal Error");
        })
};

exports.updateMusic = (req, res) => {
    let toUpdate = {};
    for(let param in req.body){
        toUpdate[param] = req.body[param];
    }
    Music.updateOne({slug: req.params.slug}, {$set: toUpdate})
        .exec()
        .then(() =>{
            musicUtil.res(res, 200, "Music data updated");
        })
        .catch(error => {
            musicUtil.res(res, 500, error);
        })
};

exports.deleteMusic = (req, res) => {
    Music.find({slug: req.params.slug})
        .exec()
        .then(music =>{
            if(music.length === 1){
                let toDelete = music[0].file_path;
                music[0].delete()
                    .then(() =>{
                        musicUtil.removeMedia(toDelete);
                        musicUtil.res(res, 200, "Music deleted from DB and storage")
                    })
                    .catch(error =>{
                        musicUtil.res(res, 500, "Error during deleting music")
                    })
            }else{
                musicUtil.res(res, 404, "Cannot find music to delete");
            }
        })
        .catch(error => {
            musicUtil.res(res, 500, "Error during searching for movie " + error);
        })
};

exports.allMusic = (req, res) => {
    Music.find()
        .exec()
        .then(music =>{
            musicUtil.res(res, 200, music);
        })
        .catch(error =>{
            console.log(error);
            musicUtil.res(res, 500, "Cannot download music - Error");
        })
};

exports.allMusicAgeRate = (req, res) =>{
    let ageRate = req.userData.age;
    Music.find({age_rate: {$lte: ageRate}})
        .exec()
        .then( music => {
            musicUtil.res(res, 200, music);
        })
        .catch(error =>{
            console.log(error);
            musicUtil.res(res, 500, "Cannot download music - error");
        })
};

exports.distinctValues = (req, res) => {
    Music.distinct(req.params.field)
        .exec()
        .then(allFromCategory => {
            musicUtil.res(res, 200, allFromCategory);
        })
        .catch(error =>{
            console.log(error);
            musicUtil.res(res, 500, "Cannot download distinct categories");
        })
  };
  
  exports.streamMusic = (req, res) =>{
      let mediaToStream = process.env.MUSIC_PATH+req.params.slug;
      try{
          musicUtil.streamMedia(res, req, mediaToStream, 'audio/mpeg');
      }catch(error){
          musicUtil.res(res, 500, "Error during streaming music");
      }
  };
  
  exports.getMusicWithParameters = (req, res) =>{
      let parameters = req.body.parameters;
      Music.find({parameters})
          .exec()
          .then(music => {
              if(music.length > 0){
                  musicUtil.res(res, 200, photos);
              }else{
                musicUtil.res(res, 404, "No music to fulfil criteria");
              }
          })
          .catch(error =>{
            musicUtil.res(res, 500, "Internal Error" + error);
          })
  };
