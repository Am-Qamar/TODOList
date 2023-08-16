const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require("mongoose");

const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/toDoListDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const tDLschema = new mongoose.Schema({ name: 'string'});
const Item = mongoose.model('item', tDLschema);
const item1=new Item({
  name:"Home Task"
});
const item2=new Item({
  name:"Bouns"
});
const item3=new Item({
  name:"bike"});

const DefaultItems=[];
DefaultItems.push(item1);
DefaultItems.push(item2);
DefaultItems.push(item3);
const ListSchema=new mongoose.Schema({
  ListName:String,
  ListItems:[tDLschema]
})
const List=mongoose.model('list',ListSchema);






app.get("/", function(req, res) {

  Item.find({},function(err,ItemFound)
  {

    if(!err)
    {
      if(ItemFound.length===0)
      {
        Item.insertMany(DefaultItems,function(err)
        {
          if(err)
          console.log("Error in insersion!");
          else
          console.log(" No Error in insersion!");
        });
         res.redirect("/");

      }
      else
      {
        res.render("list", {listTitle: "day", newListItems: ItemFound});
      }

    }
    else {
      console.log(err);
    }

  })
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listAdd=req.body.list;
  const item4=new Item({
    name:itemName
  });
  if(listAdd==="day")
  {
    item4.save();
    res.redirect("/");
  }
  else
  {
    List.findOne({ListName:listAdd},function(err,foundit)
  {
    if(!err){
    foundit.ListItems.push(item4);
    foundit.save();
    res.redirect("/post/"+listAdd);
  }else
  {
    console.log("There are some errors in post request!");
  }
  })
  }

});
app.post("/delete",function(req,res)
{
  const deleteId=req.body.deletethis;
  Item.findByIdAndRemove(deleteId,function(err)
{
  if(!err)
  {
    console.log("No error! woo woo");
  }
});
res.redirect("/");

});



app.get("/post/:customList", function(req,res){
  const listT=req.params.customList;
   console.log(listT);
   List.findOne({ListName:listT},function(err,foundit){
     if(!err)
     {
       if(!foundit)
       {
     const newList=new List({
       ListName:listT,
       ListItems:DefaultItems
     })
     newList.save();
     res.redirect("/post/"+listT);

       }
       else
       {
         console.log(foundit);
         //res.render("list", {listTitle:foundit.ListName, newListItems: foundit.ListItems});
         res.render("list", {listTitle:foundit.ListName, newListItems: foundit.ListItems});
       }

      }
   })

    });





app.listen(process.env.port || 3000, function() {
  console.log("Server has stated success fully! wow");
});
