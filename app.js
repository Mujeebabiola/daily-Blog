//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const PurifyString = require('./myfunction.js');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://abiola:abiola@cluster0.txqqy5y.mongodb.net/dailyjournal');
const notes = mongoose.model('notes', { title: String,Post:String })


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
var posts =[] //to be deleted
const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get('/',function(req,res){
  notes.find(function(err,result){
    if(err){
      console.log(err)
    }
    else{
      posts = result
      res.render("MyHome",{HomeDisplay:homeStartingContent,posts:result});
    }
  })
 

});



app.get('/about',function(req,res){
  res.render("about",{AboutDisplay:aboutContent});
})

app.get('/contact',function(req,res){
  res.render("contact",{ContactDisplay:contactContent});
})
app.get('/compose',function(req,res){
  res.render("compose");
});


app.post('/compose',function(req,res){
  const post ={
    title: req.body.Title,
    Post:req.body.content
  }
  if (post.title.length && post.Post.length)
  {
    posts.push(post)   //to be deleted
    const newpost = new notes({ title: post.title,Post:post.Post });
    newpost.save()
    res.redirect('/')
  }
 
});


var Postname =''
app.get('/post/:postName',function(req,res){
  var i =0;
  const requested = req.params.postName;
  Postname = requested;
while (i<posts.length){
    if (PurifyString(posts[i].title)===PurifyString(requested))
    {
      let title = posts[i].title;
      let content = posts[i].Post;
      res.render("post",{title:title,content:content,postname:requested})
    }
    
    i+=1;
  }

});


var Postindex=''
var ID =''
app.get('/post/:postname/update',function(req,res){
  var postname= req.params.postname;
  NameOfPost =postname;
 var i = 0;
 while(i<posts.length)
 {
  if (PurifyString( posts[i].title)===PurifyString( postname))
  {
    var posttitle = posts[i].title;
    var postcontent = posts[i].Post;
    var postID = posts[i]._id;
    Postindex=i
    ID = postID

    break;
  }
  i = i+1;
 }

//  posts.push({title: posttitle,Post :postcontent}) this piece of code gave you alot of problem
 

 res.render('update',{title:posttitle,content:postcontent})

})

app.post('/post/:postname/update',function(req,res){
 
  const post ={
    title: req.body.Title,
    Post:req.body.content
  }
  
  if (post.title && post.Post)

  {
  posts.splice(Postindex, 1) //delete the  element array from the content after you've posted a new one
  notes.findByIdAndDelete(ID,function(err,result){
    if (err){
      console.log(err)
    }
    else{
      console.log('successfully deleted')
    }
  })

  posts.push(post)
  const newpost = new notes({ title: post.title,Post:post.Post });
  newpost.save()

  res.redirect('/')
  }

  else{
    res.send("Invalid post, try longer texts");
  }

})

//setting up a delete button
//1.create the delete button on the page
//2.when the button is clicked, it takes us to a new page,with the option yes or no 
//3.The new page needs to be designed as well
//4.If the clicked option is no, it returns back to the former page
//5.if the option is yes, it returns back to the homepage with content already deleted.

app.get('/post/:postname/delete',function(req,res){
  res.render('confirmdelete',{postname:Postname})
  
})

app.post('/post/:postname/delete',function(req,res){
 
  var postname= req.params.postname;
  var i = 0;
 while(i<posts.length)
 {
  if (PurifyString( posts[i].title)===PurifyString( postname))
  {
    // posts.splice(i, 1) //delete the  element array from the content after you've posted a new one
    notes.findByIdAndDelete(posts[i]._id,function(err,result){
      if (err){
        console.log(err)
      }
      else{
        console.log('successfully deleted')
      }
    })
   
    break;
  }
  i = i+1;
 }
 res.redirect('/')
  
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
