var express = require('express');
var router = express.Router();
var request=require('request')
var probe = require('pmx').probe();
var postmetric=0;
var getmetric=0;

var imgsrc="";
/* GET home page. */
var metric1 = probe.metric({
    name    : 'GET Metric',
    value   : function() {
        return   getmetric;
    }
});
var metric2 = probe.metric({
    name    : 'POST Metric',
    value   : function() {
        return postmetric;
    }
});
router.get('/', function(req, res, next) {
    getmetric=getmetric+1;
  res.render('index', { title: 'Domain stats', condition: false, anyArray: [1,2,3] });
});
router.get('/test/:domain/:ip/:city/:country/:isp/:org', function(req, res,next){
    getmetric=getmetric+1;
  res.render('test',{output1:req.params.domain,output2:req.params.ip,output3:imgsrc,output4:req.params.city,output5:req.params.country,output6:req.params.isp,output7:req.params.org});
});
router.post('/test/submit',function(req,res,next){
  var id=req.body.id;
  postmetric=postmetric+1;

  var url1='https://www.validator.pizza/email/'+id;
  var url2='http://ip-api.com/json/www.';
  request(url1, function (error, response, body) {
      var param1='';
      var param2='';
      var param3='';
      var param4='';
      var param5='';
      var param6='';
        if (!error && response.statusCode == 200) {
            var obj1 = JSON.parse(body);
            param1=obj1.domain;
            request(url2+param1, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var obj2 = JSON.parse(body);
                    if(obj2.query)
                        param2=obj2.query;
                    else
                        param2='Not defined';

                    if (obj2.city)
                        param3=obj2.city;
                    else
                        param3='Not defined';

                    if (obj2.country)
                        param4=obj2.country;
                    else
                        param4='Not defined';

                    if(obj2.isp)
                        param5=obj2.isp;
                    else
                        param5='Not defined';

                    if(obj2.org)
                        param6=obj2.org;
                    else
                        param6='Not defined';

                    request('http://api.whoapi.com/?apikey=3675648e62d4bd55cf176e2f3c95969c&r=screenshot&domain='+param2+'&process=thumb&resolution=1366x768&delay=&thumbwidth=&thumbheight=', function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var obj3 = JSON.parse(body);
                            imgsrc=obj3.full_size;
                            res.redirect('/test/'+ param1+'/'+param2+'/'+param3+'/'+param4+'/'+param5+'/'+param6);
                        }
                    });
                }else{
                imgsrc='/images/error400Badrequest.jpg';
                res.redirect('/test/Error wrong domain/Error wrong domain/Error wrong domain/Error wrong domain/Error wrong domain/Error wrong domain');}
            });
        }else
        {imgsrc='/images/error400Badrequest.jpg';
      res.redirect('/test/Error wrong mail format/Error wrong mail format/Error wrong mail format/Error wrong mail format/Error wrong mail format/Error wrong mail format');}
    });




});
module.exports = router;
