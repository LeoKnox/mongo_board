var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
var path = require('path');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ani_dashboard');

app.use(express.static(path.join(__dirname, './views')));
app.set('vews', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var CommentSchema = new mongoose.Schema({
    name:String,
    comment:String
}, {timestamps: true})
var AuthorSchema = new mongoose.Schema({
    name: String,
    post:String,
    comments:[CommentSchema]
}, {timestamps: true})
mongoose.model('Post', AuthorSchema);
mongoose.model('Comment', CommentSchema);
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');


app.get('/', function(req, res){
    Post.find({}, function(err, home){
        if (err) {
            console.log(err);
        } else {
            console.log(home);
            res.render('index', {data: home});
        }
    })
})
app.post('/comment/:id', function(req, res){
    var commentInstance = new Comment();
    var id = req.params.id;
    commentInstance.name = req.body.name;
    commentInstance.comment = req.body.comment;
    Post.findOneAndUpdate({_id: id}, {$push: {comments:commentInstance}}, function(err, data){
        if(err) {
            console.log(err);
        } else {
            console.log(Post);
            res.redirect('/');
        }
    })

})

app.post('/post', function(req, res){
    var authorInstance = new Post();
    authorInstance.name = req.body.name;
    authorInstance.post = req.body.post;
    authorInstance.save(function(err){
        if (err) {
            console.log(err);
        } else {
            console.log('ok');
        }
    })
    res.redirect('/');
})

app.listen(8000, function() {
    console.log("listen port 8000");
})