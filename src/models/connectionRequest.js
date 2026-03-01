const mongoose = require('mongoose');
 
const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
        },
        toUserId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
        },
        status : {
            type : String,
            enum : {
                values : ["ignored","intrested","accepted","rejected"],
                message : `{VALUE} is incorrect status type`,
            },
            required : true,
        }
    },
    {
        timestamps : true,
    } 
);

connectionRequestSchema.index({fromUserId : 1, toUserId : 1});   // compound index  for faster query performance

// connectionRequestSchema.pre("save", async function(next){
//     const connectionRequest = this;
//     if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
//         throw new Error("You cannot send connection request to yourself");
//     }
//     next();
// })

const connectionRequestModel = new mongoose.model("connectionRequest",connectionRequestSchema);
module.exports = connectionRequestModel;