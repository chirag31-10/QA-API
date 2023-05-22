const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String 
  };
  
const Article = mongoose.model("Article", articleSchema);

/////////////////////////All Articles///////////////////////////////////

app.route("/articles")

.get(function(req, res){
    Article.find()
        .then(function(foundArticles){
            res.send(foundArticles);
        })
        .catch(function(err){
            console.log(err);
        });
})

.post(function(req, res){

    const newArticle = new Article({
        title:   req.body.title,
        content: req.body.content
    });

    newArticle.save()
    .then(function(savedArticle){
        res.send("Successfully added a new article");
    })
    .catch(function(err){
        res.send(err);
    });

})

.delete(function(req, res){
    Article.deleteMany()
        .then(function(){
            res.send("Successfully deleted all articles");
        })
        .catch(function(err){
            res.send(err);
        });
}); 


/////////////////////////Individual Articles///////////////////////////////////

app.route("/articles/:articleTitle")
    .get(function(req, res){
        Article.findOne({title: req.params.articleTitle})
            .then(function(foundArticle){
                if(foundArticle) {
                    res.send(foundArticle);
                } else {
                    res.send("No article with that title found.");
                }
            })
            .catch(function(err){
                res.send(err);
            });
    })
    .put(function(req, res){
        Article.updateOne(
            {title: req.params.articleTitle}, // condition
            {title: req.body.title, content: req.body.content} // updates
        )
            .then(function(){
                res.send("Successfully updated article.");
            })
            .catch(function(err){
                res.send(err);
            });
    })

    .patch(function(req, res){
        Article.updateOne(
            {title: req.params.articleTitle}, // condition
            {$set:  req.body},     
        )
            .then(function(){
                res.send("Successfully updated article.");
            })
            .catch(function(err){
                res.send(err);
            }); 
    })

    .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.articleTitle}, // condition    
        )
            .then(function(){
                res.send("Successfully deleted article.");
            })
            .catch(function(err){
                res.send(err);
            }); 
    });




app.listen(3000, function() {
  console.log("Server started on port 3000");
}); 