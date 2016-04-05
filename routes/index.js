
/*
 * GET home page.
 */

exports.index = function(req, res){
	console.log(req.db);
  res.render('index.html', { title: 'Cloudant Boiler Plate' });
};