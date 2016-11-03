var ExifImage = require('exif').ExifImage;

/*
 * Utility function to convert exif data into something a bit more consumable
 * by a template
 */
var exif = function(imageBuffer, callback){
  try {
    new ExifImage({
      image : imageBuffer
    }, function (error, data) {

      if (error){
        return callback(error);
      }else{
        var exifMap = {};
        var image = Object.keys(data.image).map(function(k) { return data[k] });
        var exif = Object.keys(data.exif).map(function(k) { return data[k] });
        gps = Object.keys(data.gps).map(function(k) { return data[k] });
        //console.log(data['image']['Make']);


        var careAbout = { // what props we're interested in, and what we call them in output, rather than silly exif-ey names
          "image.Make" : "Make",
          "image.Model" : "Model",
          "exif.DateTimeOriginal" : "Time",
          "exif.ApertureValue" : "aperture",
          "exif.FocalLength" : "focalLength",
          "exif.ISOSpeedRatings" : "ISO",
          "exif.ExposureTime" : "Shutter Speed",
          "exif.GPSLatitude" : "Lat",
          "exif.GPSLongitude" : "Long",
          "image.ImageDescription" : "Description"
        };
        careAboutKeys = Object.keys(careAbout);
        for (var i=0; i<careAboutKeys.length; i++){
          var t = careAboutKeys[i];
          var path=t.split(".");
          j=0;
          cData=data;
          while(j<path.length && cData!=undefined){
            cData=cData[path[j]];
            j+=1;
            if(j==(path.length)){
              exifMap[careAbout[t]] = cData;
            }
          }
        }
        return callback(null, exifMap);
      }
    });
  } catch (error) {
    return callback(error);
  }
}

// source: http://stackoverflow.com/questions/95727/how-to-convert-floats-to-human-readable-fractions
function dec2frac(d) {

  var df = 1;
  var top = 1;
  var bot = 1;

  while (df != d) {
    if (df < d) {
      top += 1;
    }
    else {
      bot += 1;
      top = parseInt(d * bot);
    }
    df = top / bot;
  }
  return top + '/' + bot;
}

module.exports = exif;
