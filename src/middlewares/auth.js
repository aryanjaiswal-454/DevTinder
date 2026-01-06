const adminAuth = (req,res,next)=>{
    console.log("Authenticating admin routes")
    const token = "abc";
    const isAuthorized = token === "abc";
    if(!isAuthorized) res.status(401).send("Unauthorized request");
    else next();
}
const userAuth = (req,res,next)=>{
    console.log("Authenticating user routes")
    const token = "abc";
    const isAuthorized = token === "abc";
    if(!isAuthorized) res.status(401).send("Unauthorized request");
    else next();
}
module.exports = {
    adminAuth,
    userAuth
}