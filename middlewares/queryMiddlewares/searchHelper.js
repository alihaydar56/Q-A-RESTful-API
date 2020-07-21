const Question=require("../../models/Question");
const User=require("../../models/User");
const searchHelp=function(searchkey,query,req){
    
    if (req.query.search) {
      
        queryObject = {};
        
        const regex = new RegExp(req.query.search,"i");
        queryObject[searchkey] = regex;

        return query.where(queryObject);

    }
    return query;

};
const searhcPopulation=function(query,population){
    return query.populate(population);
}
const sortQuesitonHelper=function(query,req){
    const sortKey=req.query.sortBy;
    if(sortKey==="most-answered"){
        return query.sort("-answerCount");
    }
    if(sortKey==="most-liked"){
        return query.sort("-likesCount");
    }
    return query.sort("createdAt");
};
const panigationHelp=async(model,query,req)=>{

    const sayfa=parseInt(req.query.page) ||1;// request e girilen sayfa sayısı
    const limit=parseInt(req.query.limit) || 5;// request e girilen limit sayısı
    const başlangıIndex=(sayfa-1)*limit; // başlangıç index i hesaplama
    const bitisIndex=sayfa*limit; // bitis index i hesaplama

    const toplam_soru= await model.countDocuments();// mongoDb deki toplam soru sayısını alma.

    // skip(başlangıIndex)== eger biz buna 2 verirsek ilk 2 soruyu atlıyacak ve 3.sorudan başlıyacak
    // limit(bitisIndex)== eger limite 3 verirsek 1 sayfada en fazla 3 tane soru gözükecek.
    // 1 2 3 4 5 6 7 8 9 10 =örnegin biizm mongoDb de 10 tane sorumuz var
    // bizim tüm soruları 1 anda mongoDb den almak yerine(işlem uzun sürebileceği için.)
    // soruları mongoDb den parça parça almalıyız.
    // bunun için bizim başlangıIndex imiz ve bitisIndex imiz olucak
    // başlangıIndex imiz sayfa sayımızın 1 eksiği * limit olucak.
    // bitisIndex imiz sayfa sayısı*limit olucak
    // eger bizim başlangıIndex imiz 0 dan büyük ise previous sayfamız olucak
    // eger bizim bitisIndex imiz mongoDb deki total sorulardan daha küçük ise next sayfamız olucak.

    const pagination={};

    if(başlangıIndex>0){
        pagination.previous={
             sayfa:sayfa-1,
             limit:limit
        }
    } 
    if(bitisIndex<toplam_soru){
        pagination.next={
            sayfa:sayfa+1,
            limit:limit
        }
    }
    return {
      query:query.skip(başlangıIndex).limit(bitisIndex),
      pagination:pagination
    };
};
module.exports={
    searchHelp,
    searhcPopulation,
    sortQuesitonHelper,
    panigationHelp
}