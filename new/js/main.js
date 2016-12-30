
define(['./kiss/episodes', './kiss/series'], function (eps, series) {
  eps('http://kisscartoon.me/Cartoon/Rwby-Season-4/Episode-1?id=72259')
  .then((ep) => console.log('ep', ep));
  series("http://kisscartoon.me/Cartoon/Rwby-Season-4")
  .then((series) => console.log('series', series));
});
