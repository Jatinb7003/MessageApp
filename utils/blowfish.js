// const Blowfish=require("blowfish")
// Example import for a specific version
const { Blowfish } = require('blowfish');

// var bf =Blowfish.initialize(" key","Secret");
const bf = Blowfish.initialize("key", "Secret");
 module.exports=bf;