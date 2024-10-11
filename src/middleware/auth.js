const adminAuth = ("/admin",(req,res, next)=>{
    const token = "xyz";
    const isAuthentication = token === "xyzaaaa";
    if(!isAuthentication){
        res.status(404).send("Admin Authentication failed");
    }
    else{
        next();
    }
});

const  userAuth = ("/user",(req,res,next)=>{
    const token = "abc";
    const isAuthentication = token === "abcccc";
    if(!isAuthentication){
        res.status(404).send("User Authentication failed");
    }
    else{
        next();
    }
})

module.exports={adminAuth, userAuth};