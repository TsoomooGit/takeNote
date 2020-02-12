var bodyParser=require("body-parser");
var express=require("express");
var path=require("path");
var fs=require("fs");

var app=express();
var PORT=process.env.PORT || 8099;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/static', express.static(__dirname + './js/'));

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.get('/notes',function(req,res){
    res.sendFile(path.join(__dirname+'/public/notes.html'));
});

app.post('/api/notes',function(req,res){

    fs.readFile('./db/db.json', function (err, data) {
    var json = JSON.parse(data);
    json.push(req.body);
    fs.writeFile("./db/db.json",JSON.stringify(json,null,2),function(err){
       if(err) throw err;
       console.log("Saved!");
   }) 
   res.sendFile(path.join(__dirname+'/public/notes.html'));
});
});

app.get('/api/notes', function(req,res){
    fs.readFile('./db/db.json', function (err, data) {
    res.send(JSON.parse(data));
    });
});


app.delete('/api/notes/:jsonId', function(req,res){
    var idToDelete=req.params.jsonId;
    fs.readFile('./db/db.json', function (err, data) {
    var list=JSON.parse(data);
    for(var i=0; i<list.length; i++){
       if(list[i].id==idToDelete){
           list.splice(i,1);
       }
    }
    fs.writeFile("./db/db.json",JSON.stringify(list,null,2),function(err){
        if(err) throw err;
        console.log("Saved!");
     });
    });
    res.sendFile(path.join(__dirname+'/public/notes.html'));
});


app.listen(PORT,function(){
    console.log("App is listening on PORT: "+PORT);
});