var express= require('express');
var cookieParser=require('cookie-parser')
var session=require('express-session')
var fs=require('fs');
var multer=require("multer");
const nodemailer = require("nodemailer");


var app= express();
var bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({secret:"this is my secrete"}));
app.use(express.static(__dirname+'/public'))
app.use(express.static(__dirname+'/upload'))

app.set('view engine','pug')
app.set('views','./views');



var procced=0;




app.post("/authenticate",function(req,res){
    console.log("request from the sessionid",req.sessionID)
    var flag=0;
    var fooddata = JSON.parse((fs.readFileSync(__dirname+'/alldata.json').toString()));
    var userdata=fooddata.userdata;
   
    userdata.forEach(function(a,b){
        if(a.username==req.body.username&&a.password==req.body.password)
        {
            flag=1;
        }
    })
    if(flag==1)
    {
          req.session.user=req.body;
          procced=1;
          console.log(req.session.user);
   
       res.redirect('/home');
    }
    else{
        res.redirect("/register.html")
    }   
    
})
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'C:/Users/Padma Rayudu/Desktop/WAL_training/food_app/upload')
    },
   

})
var xyz=multer({storage:storage})

app.post("/register",xyz.single("userpic"),function(req,res){
  
    var mytest = JSON.parse((fs.readFileSync(__dirname+'/alldata.json').toString()));
    var obj = JSON.parse(JSON.stringify(req.body));
    obj.profilepic=req.file.filename;
    mytest.userdata.push(obj);
    fs.writeFileSync('alldata.json',JSON.stringify(mytest),'utf-8')
    res.redirect('/login.html');
})


app.get("/home",function(req,res){
    if(procced==1){
    var fooddata = JSON.parse((fs.readFileSync(__dirname+'/alldata.json').toString()));
    var data=fooddata.fooddetails;
    var location=[];
    data.forEach(function(a,b){
        if(location.includes(a.location)){

        }
        else{
            location.push(a.location)
        }
    })
    res.render("foodhome",{fo:data,locations:location,use:req.session.user.username})
}
else
{
    res.redirect("/logout")
}

})
app.post("/home2",function(req,res){
    if(procced==1){
    var fooddata = JSON.parse((fs.readFileSync(__dirname+'/alldata.json').toString()));
    var data=fooddata.fooddetails;
    var location=[];
    data.forEach(function(a,b){
        if(location.includes(a.location)){

        }
        else{
            location.push(a.location)
        }
    })
    console.log(req.body.mylocation)
    res.render("foodhome2",{fo:data,locations:location,selectedloc:req.body.mylocation,use:req.session.user.username})
}
else{
    res.redirect("/logout");
}

})


var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'C:/Users/Padma Rayudu/Desktop/WAL_training/food_app/upload')
    },
   

})
var abcd=multer({storage:storage})

app.post("/fooddata",abcd.array("foodpic"),function(req,res){
   if(procced==1){
    console.log(req.file);
     var images=[];
    console.log(ob);
    req.files.forEach(function(a,b){
        images.push(a.filename)
    })
   
    var mytest = JSON.parse((fs.readFileSync(__dirname+'/alldata.json').toString()));
    var l=mytest.fooddetails.length;
    var ob={
        foodname:req.body.foodname,
        noeat:req.body.noeat,
        price:req.body.price,
        remark:req.body.remarks,
        location:req.body.location,
        delivery:req.body.delivery,
        foodpic:images,
        user:req.session.user.username,
        id:l+1
   }
      
    mytest.fooddetails.push(ob);
    fs.writeFileSync('alldata.json',JSON.stringify(mytest),'utf-8')
    // res.send("hii");
    res.redirect('/home');
}
else{
    res.redirect("/logout")
}


})

app.get("/food/:key",function(req,res){
    if(procced==1){
    console.log(req.params.key);
    var fooddata = JSON.parse((fs.readFileSync(__dirname+'/alldata.json').toString()));
    var data=fooddata.fooddetails;
    res.render("unique",{fo:data,id:req.params.key})

    //res.send("hii");
    }
    else{
        res.redirect("/logout") 
    }
  

})
app.get("/forgotpassword",function(req,res){

    async function main() {
  
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: 'yallanagachandrika@gmail.com', // generated ethereal user
            pass: 'nagachandrika', // generated ethereal password
          },
        });
      
      
        let info = await transporter.sendMail({
          from: 'yallanagachandrika@gmail.com', // sender address
          to: "padma.rayudu1234@gmail.com", // list of receivers
          subject: "Forgot Password", // Subject line
          text: "padma123", // plain text body
           // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        
      }
      
      main().catch(console.error);
    res.send("Ok Ok");
})
app.get("/orderdetails/:key",function(req,res){
    if(procced==1){
    var fooddata = JSON.parse((fs.readFileSync(__dirname+'/alldata.json').toString()));
    var ob={placeditem:req.params.key,
            user:req.session.user.username}
    fooddata.placedorders.push(ob);
    fs.writeFileSync('alldata.json',JSON.stringify(fooddata),'utf-8')
    res.redirect("/home")
    }
    else{
        res.redirect("/logout")
    }


  
})
app.get("/deletefood/:key",function(req,res){
    var id=req.params.key;
    var fooddata = JSON.parse((fs.readFileSync(__dirname+'/alldata.json').toString()));
    var data=fooddata.fooddetails
    console.log("beforee")
    console.log(data);
    var index;
    data.forEach(function(a,b)
    {
        if(a.id==id)
        {
            index=b;
        }
    })
    data.splice(index,1);
    //console.log("afters")
    //console.log(data);
    fooddata.fooddetails=data;
    //console.log("afters")

    //console.log(fooddata.fooddetails)

    fs.writeFileSync('alldata.json',JSON.stringify(fooddata),'utf-8')
   res.redirect("/home");


})
app.get("/updatefood/:key",function(req,res){
    var fooddata = JSON.parse((fs.readFileSync(__dirname+'/alldata.json').toString()));
    var data=fooddata.fooddetails;
    res.render("editfooditem",{fo:data,id:req.params.key})

})
app.get("/placed",function(req,res){
    if(procced==1)
    {
    var fooddata = JSON.parse((fs.readFileSync(__dirname+'/alldata.json').toString()));
    var data=fooddata.fooddetails
    var plc=fooddata.placedorders
    res.render("placeditem",{fo:data,placed:plc,u:req.session.user.username})  
    }
    else
    {res.redirect("/logout")}

})
app.get("/myorder",function(req,res){
    if(procced==1){
    var fooddata = JSON.parse((fs.readFileSync(__dirname+'/alldata.json').toString()));
    var data=fooddata.fooddetails
    var plc=fooddata.placedorders
    res.render("oderitem",{fo:data,placed:plc,u:req.session.user.username})  
    }
    else{
        res.redirect("/logout")
    }

})
app.get("/myfood",function(req,res){
    var fooddata = JSON.parse((fs.readFileSync(__dirname+'/alldata.json').toString()));
    var data=fooddata.fooddetails;
    //console.log(req.session.user.username);
    res.render("myfood",{fdata:data,uu:req.session.user.username})
})
app.get("/myprofile",function(req,res){
    var fooddata = JSON.parse((fs.readFileSync(__dirname+'/alldata.json').toString()));
    var users=fooddata.userdata;
    console.log(req.session.user.username);
    res.render("profiles",{udata:users,uu:req.session.user.username})

})
app.get("/logout",function(req,res){

    req.session.destroy();
    res.redirect("/login.html")
    procced=0;
})

app.listen(process.env.PORT)