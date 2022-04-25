const { trackernityHistoryDetail } = require("../models/trackernity.model.js");
const theModule = require("../models/trackernity.model.js");
const Trackernity = theModule.trackernity;
const TrackernityAlpro = theModule.trackernityAlpro;
const TrackernityGangguan = theModule.trackernityGangguan;
const TrackernityHistory = theModule.trackernityHistory;
const TrackernityHistoryDetail = theModule.trackernityHistoryDetail;
const TrackernityPerkiraan = theModule.trackernityPerkiraan;

exports.insert = (req,res) => {
    if (!req.body){
        res.status(400).send("Content can not be empty!");
        return;
    }

    const trackernity = new Trackernity({
        nama:req.body.nama,
        regional:req.body.regional,
        witel:req.body.witel,
        unit:req.body.unit,
        user_id: req.body.user_id,
        c_profile: req.body.c_profile,
        lat: req.body.lat,
        lgt: req.body.lgt,
        continuity: req.body.continuity,
        remarks: req.body.remarks,
        token: req.body.token
    });

    const response = {
        code:"200",
        status:"success",
        data:[
            {
                user_id:trackernity.user_id,
                date_time:new Date().toISOString()
            }
        ]
    }

    Trackernity.insert(trackernity,(err, data) => {
        if(err){
            res.status(500).send(err.message || "Some error occurred.");
        }
        else{
            res.send(response);
            req.io.sockets.emit("location_data",data);
        }
    });
};

///////////////insertAlpro

exports.insertAlpro = (req,res) => {
    if (!req.body){
        res.status(400).send("Content can not be empty!");
        return;
    }

    const trackernityAlpro = new TrackernityAlpro({
        user_id: req.body.user_id,
        lat: req.body.lat,
        lgt: req.body.lgt,
        continuity: req.body.continuity,
        remarks: req.body.remarks,
        descriptions:req.body.descriptions,
    });

    const response = {
        code:"200",
        status:"success",
        data:[
            {
                user_id:trackernityAlpro.user_id,
                date_time:new Date().toISOString()
            }
        ]
    }

    TrackernityAlpro.insertAlpro(trackernityAlpro,(err, data) => {
        if(err){
            res.status(500).send(err.message || "Some error occurred.");
        }
        else{
            res.send(response);
            // req.io.sockets.emit("location_data_alpro",data);
        }
    });
};

exports.insertGangguan = (req,res) => {
    if (!req.body){
        res.status(400).send("Content can not be empty!");
        return;
    }

    const trackernityGangguan = new TrackernityGangguan({
        regional: req.body.regional,
        witel: req.body.witel,
        unit: req.body.unit,
        user_id: req.body.user_id,
        lat: req.body.lat,
        lgt: req.body.lgt,
        remarks: req.body.remarks,
        remarks2: req.body.remarks2,
        descriptions:req.body.descriptions,
        notes: req.body.notes,
        id_perkiraan: req.body.id_perkiraan
    });

    const response = {
        code:"200",
        status:"success",
        data:[
            {
                user_id:trackernityGangguan.user_id,
                date_time:new Date().toISOString()
            }
        ]
    }

    TrackernityGangguan.insertGangguan(trackernityGangguan,(err, data) => {
        if(err){
            res.status(500).send(err.message || "Some error occurred.");
        }
        else{
            res.send(response);
            // req.io.sockets.emit("location_data_alpro",data);
        }
    });
};

exports.insertPerkiraan = (req,res) => {
    if (!req.body){
        res.status(400).send("Content can not be empty!");
        return;
    }

    const order_query = req.body.order_query;

    const realRemarks = req.body.real_remarks;

    const trackernityPerkiraan = new TrackernityPerkiraan({
        regional: req.body.regional,
        witel: req.body.witel,
        unit: req.body.unit,
        user_id: req.body.user_id,
        remarks: req.body.remarks,
        remarks2: req.body.remarks2,
        descriptions:req.body.descriptions,
        notes: req.body.notes,
        perkiraan_jarak_gangguan: req.body.perkiraan_jarak_gangguan,
    });

    const response = {
        code:"200",
        status:"success",
        data:[]
    }

    TrackernityPerkiraan.insertPerkiraan(order_query,realRemarks,trackernityPerkiraan,(err, data) => {
        if(err){
            res.status(500).send(err.message || "Some error occurred.");
        }
        else{
            response.data.push(   {
                id_perkiraan: data.id_perkiraan,
                user_id:trackernityPerkiraan.user_id,
                date_time:new Date().toISOString()
            })
            res.send(response);
            // req.io.sockets.emit("location_data_alpro",data);
        }
    });
};

////Function Still Developed////

// exports.getAlproByParam = (req,res) => {
//     const param = req.query.param;

//     Trackernity.getAlproByParam(param, (err, data) => {
//         if(err){
//             console.info("Some error occurred.");
//             res.status(500).send({
//                 message: err.message || "Some error occurred."
//             });
//         }
//         else{
//             console.info(data);
//             res.send(data);
//         }
//     });
// };

/////////////////dropdown item alpro per item AND get alpro/////////////////////////

exports.getDropdownItemTrackernityTreg = (req,res) => {
    Trackernity.getDropdownItemTrackernityTreg((err,data) => {
        if(err){
            console.info("Some error occurred.");
            res.status(500).send(err);
        }else{
            console.info(data);
            res.send(data);
        }
    })
}

exports.getDropdownItemTrackernityWitel = (req,res) => {
    let treg = req.query.treg;
    Trackernity.getDropdownItemTrackernityWitel(treg,(err,data) => {
        if(err){
            console.info("Some error occurred.");
            res.status(500).send(err);
        }else{
            console.info(data);
            res.send(data);
        }
    })
}

exports.getDropdownItemTrackernityRemarks = (req,res) => {
    let treg = req.query.treg;
    let witel = req.query.witel;
    Trackernity.getDropdownItemTrackernityRemarks(treg,witel,(err,data) => {
        if(err){
            console.info("Some error occurred.");
            res.status(500).send(err);
        }else{
            console.info(data);
            res.send(data);
        }
    })
}

exports.getDropdownItemTrackernityRoutes = (req,res) => {
    let remarks = req.query.remarks;
    Trackernity.getDropdownItemTrackernityRoutes(remarks,(err,data) => {
        if(err){
            console.info("Some error occurred.");
            res.status(500).send(err);
        }else{
            console.info(data);
            res.send(data);
        }
    })
}

exports.getAlproThird = (req,res) => {
    const treg = req.query.treg;
    const witel = req.query.witel;
    const remarks = req.query.remarks;
    const descriptions = req.query.descriptions;
    Trackernity.getAlproThird(treg,witel,remarks,descriptions,(err,data) => {
        if(err){
            console.info("Some error occurred.");
            res.status(500).send(err);
        }else{
            console.info(data);
            res.send(data);
        }
    })
}

////////////////////////////////////////////////////////////////////////////////


exports.getDropdownItemTrackernityOthers = (req,res) =>{
    Trackernity.getDropdownItemTrackernityOthers((err, data) => {
        if(err){
            console.info("Some error occurred.");
            res.status(500).send(err);
        }else{
            console.info(data);
            res.send(data);
        }
    })
}


exports.getDropdownItemTrackernitySecond = (req,res) => {
    Trackernity.getDropdownItemTrackernitySecond((err, data) => {
        if(err){
            console.info("Some error occurred.");
            res.status(500).send(err);
        }
        else{
            console.info(data);
            res.send(data);
        }
    });
};

exports.getDropdownItemTrackernity = (req,res) => {
    Trackernity.getDropdownItemTrackernity((err, data) => {
        if(err){
            console.info("Some error occurred.");
            res.status(500).send(err);
        }
        else{
            console.info(data);
            res.send(data);
        }
    });
};

exports.getPerkiraanFilteredByRemarks = (req,res) => {
    const remarks = req.query.remarks;

    Trackernity.getPerkiraanFilteredByRemarks(remarks, (err, data) => {
        if(err){
            console.info("Some error occurred.");
            res.status(500).send(err);
        }
        else{
            console.info(data);
            res.send(data);
        }
    });
};

exports.getGangguanFilteredByRemarks = (req,res) => {
    const remarks = req.query.remarks;

    Trackernity.getGangguanFilteredByRemarks(remarks, (err, data) => {
        if(err){
            console.info("Some error occurred.");
            res.status(500).send(err);
        }
        else{
            console.info(data);
            res.send(data);
        }
    });
};

exports.getAlproSecond = (req,res) => {
    const treg = req.query.treg;
    const witel = req.query.witel;
    const remarks = req.query.remarks;

    Trackernity.getAlproSecond(treg,witel,remarks, (err, data) => {
        if(err){
            console.info("Some error occurred.");
            res.status(500).send(err);
        }
        else{
            console.info(data);
            res.send(data);
        }
    });
};


exports.getAlproFilteredByRemarks = (req,res) => {
    const remarks = req.query.remarks;

    Trackernity.getAlproFilteredByRemarks(remarks, (err, data) => {
        if(err){
            console.info("Some error occurred.");
            res.status(500).send(err);
        }
        else{
            console.info(data);
            res.send(data);
        }
    });
};

exports.getTeknisi = (req,res) => {
    const user_id = req.query.user_id;

    Trackernity.getTeknisi(user_id, (err, data) => {
        if(err){
            console.info("Some error occurred.");
            res.status(500).send(err);
        }
        else{
            console.info(data);
            res.send(data);
        }
    });
};

    /////////////get tracking history//////////////


exports.getTrackingHistory = (req,res) => {
    if (!req.query){
        res.status(400).send("Content can not be empty!");
        return;
    }

    const trackernityHistory = new TrackernityHistory({
        user_id:req.query.user_id,
        remarks:req.query.remarks,
        date_start:req.query.date_start,
        date_end:req.query.date_end
    });
    TrackernityHistory.getTrackingHistory(trackernityHistory, (err, data) => {
        if(err){
            console.info("Some error occurred.");
            res.status(500).send(err);
        }
        else{
            console.info(data);
            res.send(data);
        }
    });
};

exports.getTrackingHistoryDetail = (req,res) => {
    if (!req.query){
        res.status(400).send("Content can not be empty!");
        return;
    }

    const trackernityHistoryDetail = new TrackernityHistoryDetail({
        token:req.query.token
    });
    TrackernityHistoryDetail.getTrackingHistoryDetail(trackernityHistoryDetail, (err, data) => {
        if(err){
            console.info("Some error occurred.");
            res.status(500).send(err);
        }
        else{
            console.info(data);
            res.send(data);
        }
    });
};