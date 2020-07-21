const asyncHandler=require("express-async-handler");
const customError=require("../authorization/tokenTest");
const { options } = require("../../Routers/answer");
const {searchHelp,searhcPopulation, sortQuesitonHelper , panigationHelp}=require("./searchHelper");
const questionQueryMiddlewares=function(model,option){

    return asyncHandler(async(req,res,next)=>{
 
        let query=model.find();
        query=searchHelp("title",query,req);

        if(option && option.population){
            query=searhcPopulation(query,option.population);
        }
        query=sortQuesitonHelper(query,req);

        const paginationResult=await panigationHelp(model,query,req);
        query=paginationResult.query;
        const pagi=paginationResult.pagination;

        const queryResults=await query;

        res.queryResults={
           success:true,
           count:queryResults.length,
           pagination:pagi,
           data:queryResults

        };
        next();
    });
};

module.exports=questionQueryMiddlewares;