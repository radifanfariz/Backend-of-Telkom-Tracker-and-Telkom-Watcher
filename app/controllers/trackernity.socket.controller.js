const Trackernity = require("../models/trackernity.model.js");

exports.socketInsertLocation = (locationDataJson) => {
    if(!locationDataJson){
        console.info("Data is empty !!!");
    }
    const trackernity = new Trackernity({
        user_id: locationDataJson.user_id,
        lat: locationDataJson.lat,
        lgt: locationDataJson.lgt,
        continuity: locationDataJson.continuity,
        remarks: locationDataJson.remarks,
    });

    Trackernity.insert(trackernity,(err, data) => {
        if(err){
            console.info("Some error occurred !!!");
        }
        else{
            exports.user_id = trackernity.user_id;
            console.info("Insert data success");
        }
    });
};

exports.socketGetAlproFilteredByRemarks = (remarks=null) => {

    Trackernity.getAlproFilteredByRemarks(remarks, (err, data) => {
        if(err){
            //console.log(err);
            exports.result = {msg:err};

        }
        else{
            //console.log(data);
            exports.result = data;
        }
    });
};