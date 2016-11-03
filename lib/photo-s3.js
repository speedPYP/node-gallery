var aws = require('aws-sdk'),
path = require('path'),
_ = require('underscore'),
exif = require('./exif-s3.js'),
common;

module.exports = function(config){
  common = require('./common')(config);
  return function(req, res, next){
    var s3 = new aws.S3();
    aws.config.region = 'us-west-2';

    var albumPath = req.params[0] || '', // This CAN be undefined, if a photo exists at root
    photoName = req.params[1] || '',
    photoBreadcrumbPath = path.join(albumPath, photoName), // Path for breadcrumb mostly
    params = {Bucket: 'speedpyp-test', Key : photoBreadcrumbPath},
    photoWebPath,
    photoS3Body;

    s3.getObject(params, function(err, data) {
      if (err){
        //console.log(err, err.stack); // an error occurred
        return common.error(req, res, next, 404, 'Photo not found', err);
      }
      else{
        photoS3Body = data.Body;
        console.log(photoS3Body);
        
        exif(photoS3Body, function(exifErr, exifInfo){
          if (exifErr){
            // TODO: At least log these errors
            // don't care about exif errors - they are frequent with malformed files
            //exifInfo = {};
            console.log(exifErr)
            return common.error(req, res, next, 404, 'Photo not reconized', err);
          }
          req.tpl = 'photo.ejs';
          req.data = _.extend(config, {
            name : photoName,
            breadcrumb : common.breadcrumb(common.friendlyPath(photoBreadcrumbPath)),
            src : photoWebPath,
            path : photoBreadcrumbPath,
            exif : exifInfo
          });
          return next();
        });
      }
    });
    s3.getSignedUrl('getObject', params, function(err, url){
      if (err){
        return common.error(req, res, next, 404, 'Photo not found', err);
      }
      else{
        photoWebPath = url
        console.log(photoWebPath);
      }
    });
  }
};
