const { HaversineMethod, bearingFunc } = require("../utility/distance-methods.js");
const { getLatLng, getLatLngVincenty } = require("../utility/latlng-process.js");
const sql = require("./db.js");

//constructor
const Trackernity = function(trackernity){
    this.nama = trackernity.nama;
    this.regional = trackernity.regional;
    this.witel = trackernity.witel;
    this.unit = trackernity.unit;
    this.user_id = trackernity.user_id;
    this.c_profile = trackernity.c_profile;
    this.lat = trackernity.lat;
    this.lgt = trackernity.lgt;
    this.continuity = trackernity.continuity;
    this.remarks = trackernity.remarks;
    this.token = trackernity.token;
};

const TrackernityAlpro = function(trackernity_alpro){
    this.user_id = trackernity_alpro.user_id;
    this.lat = trackernity_alpro.lat;
    this.lgt = trackernity_alpro.lgt;
    this.continuity = trackernity_alpro.continuity;
    this.remarks = trackernity_alpro.remarks;
    this.descriptions = trackernity_alpro.descriptions;
};

const TrackernityGangguan = function(trackernity_gangguan){
    this.regional = trackernity_gangguan.regional;
    this.witel = trackernity_gangguan.witel;
    this.unit = trackernity_gangguan.unit;
    this.user_id = trackernity_gangguan.user_id;
    this.lat = trackernity_gangguan.lat;
    this.lgt = trackernity_gangguan.lgt;
    this.remarks = trackernity_gangguan.remarks;
    this.remarks2 = trackernity_gangguan.remarks2;
    this.descriptions = trackernity_gangguan.descriptions;
    this.notes = trackernity_gangguan.notes;
    this.id_perkiraan = trackernity_gangguan.id_perkiraan;
}

const TrackernityPerkiraan = function(trackernity_perkiraan){
    this.regional = trackernity_perkiraan.regional;
    this.witel = trackernity_perkiraan.witel;
    this.unit = trackernity_perkiraan.unit;
    this.user_id = trackernity_perkiraan.user_id;
    this.lat = trackernity_perkiraan.lat;
    this.lgt = trackernity_perkiraan.lgt;
    this.remarks = trackernity_perkiraan.remarks;
    this.remarks2 = trackernity_perkiraan.remarks2;
    this.descriptions = trackernity_perkiraan.descriptions;
    this.notes = trackernity_perkiraan.notes;
    this.perkiraan_jarak_gangguan = trackernity_perkiraan.perkiraan_jarak_gangguan;
    this.id_perkiraan = trackernity_perkiraan.id_perkiraan;
    // this.polyline_encoded = trackernity_perkiraan.polyline_encoded;
}

Trackernity.insert = (newValues, result) => {
    sql.query("INSERT INTO t_posisi_teknisi_new SET ?",newValues,(err, res) =>{
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }else{
            console.log("created new values: ",{...newValues});
            result(null, {...newValues});
        }
    });
};

TrackernityAlpro.insertAlpro = (newValues, result) => {
    sql.query("INSERT INTO t_posisi_alpro_new SET ?",newValues,(err, res) =>{
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }else{
            console.log("created new values: ",{...newValues});
            result(null, {...newValues});
        }
    });
};

TrackernityGangguan.insertGangguan = (newValues, result) => {
    sql.query("INSERT INTO t_posisi_gangguan SET ?",newValues,(err, res) =>{
        if(err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }else{
            sql.query(`UPDATE t_posisi_gangguan_perkiraan SET flagging_gangguan_selesai = 1 WHERE id_perkiraan = ${sql.escape(newValues.id_perkiraan)}`,(err2, res2) =>{
                if(err) {
                    console.log("error: ", err2);
                    result(err2, null);
                    return;
                }else{
                    console.log("Update flagging_gangguan_selesai Success !!! ");
                }
            });
            console.log("created new values: ",{...newValues});
            result(null, {...newValues});
        }
    });
};

///////////////legacy code/////////////////////////////////////////////////////
// sql.query(`SELECT id_perkiraan FROM t_posisi_gangguan_perkiraan ORDER BY id_perkiraan DESC LIMIT 1`,(err, res) =>{
//     if(err) {
//         console.log("error: ", err);
//         result(err, null);
//         return;
//     }else{
//         if(res[res.length-1].id_perkiraan != newValues.id_perkiraan){
//             newValues.id_perkiraan = res[res.length-1].id_perkiraan
//         }
//         console.log("id_perkiraan: "+newValues.id_perkiraan);
//     }
// });
////////////////////////////////////////////////////////////////////////////

TrackernityPerkiraan.insertPerkiraan = (order_query="ASC",realRemarks,newValues, result) => {
    sql.query(`SELECT * from t_posisi_alpro_new WHERE remarks = ${sql.escape(newValues.remarks)} ORDER BY id ${order_query}`,
    (err,res) => {
        if(err){
            throw err;
            result(err,null);
            return;
        }
        if(!res.length){
            console.log("error: Something went wrong!");
            result("Something went wrong!", null);
            return;
        }else{
            // const data = getLatLng(newValues.perkiraan_jarak_gangguan,res);
            // newValues.lat = data.latLon.lat;
            // newValues.lgt = data.latLon.lon;
            // newValues.polyline_encoded = data.polyline_encoded;

            try {
                const latLon = getLatLngVincenty(newValues.perkiraan_jarak_gangguan,res);
                newValues.lat = latLon.lat;
                newValues.lgt = latLon.lon;
                
            } catch (error) {
                console.log("error: Something went wrong!");
                result("Something went wrong!", null);
                return;
            }

            if(realRemarks != null || realRemarks != ""){
                newValues.remarks = realRemarks;
            }

            sql.query("SELECT id_perkiraan FROM t_posisi_gangguan_perkiraan ORDER BY id DESC LIMIT 1",(err2,res2) => {
                if(err2) {
                    console.log("error: ", err2);
                    result(err2, null);
                    return;
                }
                if(!res2.length){
                    newValues.id_perkiraan = 0;
                }else{
                    newValues.id_perkiraan = res2[0].id_perkiraan + 1;
                }
                sql.query("INSERT INTO t_posisi_gangguan_perkiraan SET ?",newValues,(err3, res3) =>{
                    if(err3) {
                        console.log("error: ", err3);
                        result(err3, null);
                    }
            
                    console.log("created new values: ",{...newValues});
                    result(null, {...newValues});
                });
            })
        }
    })
}

////Function Still Developed////

// Trackernity.getAlproByParam = (param, result) =>{
//     let query = "SELECT * FROM t_posisi_alpro";

//     if(typeof param !== 'undefined'){
//         query += ` WHERE '${param}' IN (user_id,date_time,continuity,remarks)`;
//     }

//     query += " ORDER BY id";

//     sql.query(query, (err, res) => {
//         if(err){
//             console.log("error: ",err);
//             result(null, err);
//         }

//         //console.log("Data: ", res);
//         result(null, res);
//     });
// };

////////dropdown item tracking per item AND get alpro///////////////////
Trackernity.getDropdownItemTrackernityTreg = (result) => {
    let query = `SELECT DISTINCT treg FROM p_witel`;
    let dropdownItem = {
        dropdown_items:[]
    };
    sql.query(query,
        (err,res) => {
            if(err || !res.length){
                console.log("error: ","No Data!");
                result("No Data!", null);
                return;
            }
            for(let i in res){
                dropdownItem.dropdown_items.push(res[i].treg);
            }
            result(null,dropdownItem);
        }
    )
}

Trackernity.getDropdownItemTrackernityWitel = (treg,result) => {
    let query = `SELECT DISTINCT witel FROM p_witel WHERE treg = ${sql.escape(treg)}`;
    let dropdownItem = {
        dropdown_items:[]
    };
    sql.query(query,
        (err,res) => {
            if(err || !res.length){
                console.log("error: ","No Data!");
                result("No Data!", null);
                return;
            }
            for(let i in res){
                dropdownItem.dropdown_items.push(res[i].witel);
            }
            result(null,dropdownItem);
        }
    )
}

Trackernity.getDropdownItemTrackernityRemarks = (treg,witel,result) =>  {
    let query = `SELECT DISTINCT SUBSTRING_INDEX(remarks,"-",1) AS dropdown_item_head,SUBSTRING_INDEX(remarks,"-",-1) AS dropdown_item_tail FROM t_posisi_alpro_new WHERE treg = ${sql.escape(treg)} AND witel = ${sql.escape(witel)}`;
    let dropdownItem = {
        dropdown_items:{
            Head:[],
            Tail:[],
            All:[]
        }
    };
    sql.query(query,
    (err,res) => {
        if(err || !res.length){
            console.log("error: ","No Data!");
            result("No Data!", null);
            return;
        }
        let i = 0;
        let headSet = new Set();
        let tailSet = new Set();
        let allSet = new Set();
        while(i < res.length){
            headSet.add(res[i].dropdown_item_head);
            tailSet.add(res[i].dropdown_item_tail);
            allSet.add(res[i].dropdown_item_head);
            allSet.add(res[i].dropdown_item_tail);
            i++;
        }  
        dropdownItem.dropdown_items.Head = Array.from(headSet);
        dropdownItem.dropdown_items.Tail = Array.from(tailSet);
        dropdownItem.dropdown_items.All  = Array.from(allSet);
        result(null,dropdownItem);
    })
}

Trackernity.getDropdownItemTrackernityRoutes = (remarks,result) => {
    let query = `SELECT DISTINCT descriptions FROM t_posisi_alpro_new WHERE remarks = ${sql.escape(remarks)}`;
    let dropdownItem = {
        dropdown_items:[]
    };
    sql.query(query,
        (err,res) => {
            if(err || !res.length){
                console.log("error: ","No Data!");
                result("No Data!", null);
                return;
            }
            for(let i in res){
                dropdownItem.dropdown_items.push(res[i].descriptions);
            }
            result(null,dropdownItem);
        }
    )
}

Trackernity.getAlproThird = (treg,witel,remarks,descriptions, result) =>{
    let query = `SELECT * FROM t_posisi_alpro_new WHERE treg = ${sql.escape(treg)} AND witel = ${sql.escape(witel)} AND remarks = ${sql.escape(remarks)} AND descriptions = ${sql.escape(descriptions)} ORDER BY id`;

    sql.query(query, (err, res) => {
        if(err || !res.length){
            console.log("error: ","No Data!");
            result("No Data!", null);
            return;
        }

        //console.log("Data: ", res);
        result(null, res);
    });
};

////////////////////////////////////////////////////////////////////////




/////////dropdown item racking others////////////////////
Trackernity.getDropdownItemTrackernityOthers = (result) =>{
    let query = `SELECT * FROM p_others`;
    let dropdownItemOther = {
        dropdown_item_others:{
            notes:[],
            descriptions:[],
        }
    };
    sql.query(query,(err,res) => {
        if(err || !res.length){
            console.log("error: ","No Data!");
            result("No Data!", null);
            return;
        }
        for(let i in res){
            if(res[i].notes != null && res[i].notes != ""){
                dropdownItemOther.dropdown_item_others.notes.push(res[i].notes);
            }
            if(res[i].descriptions != null && res[i].descriptions != ""){
                dropdownItemOther.dropdown_item_others.descriptions.push(res[i].descriptions);
            }
        }
        result(null,dropdownItemOther);
    });
}

////////////dropdown item tracking 2////////////

/////////remember one of json item is dropdown_item not dropdown_items
/////////not like a new one. lack of 's' in this 'dropdown_item' item
Trackernity.getDropdownItemTrackernitySecond = (result) => {
    let query = `SELECT DISTINCT SUBSTRING_INDEX(remarks,"-",1) AS dropdown_item_head,SUBSTRING_INDEX(remarks,"-",-1) AS dropdown_item_tail FROM t_posisi_alpro_new`;
    let query2 = `SELECT DISTINCT witel,treg FROM p_witel`;
    let dropdownItem = {
        dropdown_item:{
            treg:[],
            witel:[],
            remarks:{
                Head:[],
                Tail:[],
                All:[]
            }
        }
    };
    sql.query(query,
    (err,res) => {
        if(err || !res.length){
            console.log("error: ","No Data!");
            result("No Data!", null);
            return;
        }
        let i = 0;
        while(i < res.length){
            dropdownItem.dropdown_item.remarks.Head.push(res[i].dropdown_item_head);
            dropdownItem.dropdown_item.remarks.Tail.push(res[i].dropdown_item_tail);
            dropdownItem.dropdown_item.remarks.All.push(res[i].dropdown_item_head);
            dropdownItem.dropdown_item.remarks.All.push(res[i].dropdown_item_tail);
            i++;
        }  
        sql.query(query2,(err2,res2) => {
            if(err2 || !res2.length){
                console.log("error: ","No Data!");
                result("No Data!", null);
                return;
            }
            let i = 0;
            while(i < res.length || i < res2.length){
                if(i < res2.length){
                    if(dropdownItem.dropdown_item.treg.indexOf(res2[i].treg) === -1){
                        dropdownItem.dropdown_item.treg.push(res2[i].treg);
                    }
                    if(dropdownItem.dropdown_item.witel.indexOf(res2[i].witel) === -1){
                        dropdownItem.dropdown_item.witel.push(res2[i].witel);
                    }
                 }
                i++;
            }   
            result(null,dropdownItem);
        })
    }
    )
}

////////////dropdown item tracking////////////

/////////remember one of json item is dropdown_item not dropdown_items
/////////not like a new one. lack of 's' in this 'dropdown_item' item
Trackernity.getDropdownItemTrackernity = (result) => {
    let query = `SELECT DISTINCT SUBSTRING_INDEX(remarks,"-",1) AS dropdown_item FROM t_posisi_alpro_new UNION DISTINCT SELECT DISTINCT SUBSTRING_INDEX(remarks,"-",-1) AS dropdown_item FROM t_posisi_alpro_new`;
    sql.query(query,
    (err,res) => {
        if(err || !res.length){
            console.log("error: ","No Data!");
            result("No Data!", null);
            return;
        }
        let i = 0;
        let dropdownItem = {
            dropdown_item:{
                Head:[],
                Tail:[],
                All:[]
            }
        };
        while(i < res.length){
            if(i % 2 == 0){
                dropdownItem.dropdown_item.Head.push(res[i].dropdown_item);
            }else{
                dropdownItem.dropdown_item.Tail.push(res[i].dropdown_item);
            }
            dropdownItem.dropdown_item.All.push(res[i].dropdown_item);
            i++;
        }   
        result(null,dropdownItem);
    }
    )
}


Trackernity.getPerkiraanFilteredByRemarks = (remarks, result) =>{
    let query = `SELECT * FROM t_posisi_gangguan_perkiraan WHERE remarks = ${sql.escape(remarks)} AND flagging_gangguan_selesai = 0 ORDER BY id`;

    sql.query(query, (err, res) => {
        if(err || !res.length){
            console.log("error: ","No Data!");
            result("No Data!", null);
            return;
        }

        //console.log("Data: ", res);
        result(null, res);
    });
};

Trackernity.getGangguanFilteredByRemarks = (remarks, result) =>{
    ///////filtered by remarks and flagging_ggn_selesai//////////////
    // let query = `SELECT * FROM t_posisi_gangguan WHERE remarks = ${sql.escape(remarks)} AND flagging_ggn_selesai = 0 ORDER BY id`;

    let query = `SELECT * FROM t_posisi_gangguan WHERE remarks = ${sql.escape(remarks)} ORDER BY id`;
    sql.query(query, (err, res) => {
        if(err || !res.length){
            console.log("error: ","No Data!");
            result("No Data!", null);
            return;
        }

        //console.log("Data: ", res);
        result(null, res);
    });
};

Trackernity.getAlproSecond = (treg,witel,remarks, result) =>{
    let query = `SELECT * FROM t_posisi_alpro_new WHERE treg = ${sql.escape(treg)} AND witel = ${sql.escape(witel)} AND remarks = ${sql.escape(remarks)} ORDER BY id`;

    sql.query(query, (err, res) => {
        if(err || !res.length){
            console.log("error: ","No Data!");
            result("No Data!", null);
            return;
        }

        //console.log("Data: ", res);
        result(null, res);
    });
};


Trackernity.getAlproFilteredByRemarks = (remarks, result) =>{
    let query = `SELECT * FROM t_posisi_alpro_new WHERE remarks = ${sql.escape(remarks)} ORDER BY id`;

    sql.query(query, (err, res) => {
        if(err || !res.length){
            console.log("error: ","No Data!");
            result("No Data!", null);
            return;
        }

        //console.log("Data: ", res);
        result(null, res);
    });
};

Trackernity.getTeknisi = (user_id,result) => {
    
    let query = "SELECT * FROM t_posisi_teknisi_new";

    if(typeof user_id !== 'undefined'){
        query += ` WHERE user_id = '${sql.escape(user_id)}'`;
    }

    query += " ORDER BY id DESC LIMIT 1";

    sql.query(query, (err, res) => {
        if(err || !res.length){
            console.log("error: ","No Data!");
            result("No Data!", null);
            return;
        }

        //console.log("Data: ", res);
        result(null, res);
    });
};

/////history and history detail implementation////
const TrackernityHistory = function(trackernity_hitory){
    this.user_id = trackernity_hitory.user_id;
    this.remarks = trackernity_hitory.remarks;
    this.date_start = trackernity_hitory.date_start;
    this.date_end = trackernity_hitory.date_end;
};

TrackernityHistory.getTrackingHistory = (trackernity_history,result) =>{
    let query = `SELECT token,user_id,remarks,DATE_FORMAT(date_time,"%Y-%m-%d") as date_time,id FROM t_posisi_teknisi_new WHERE 
    user_id IN (SELECT user_id FROM t_posisi_teknisi_new WHERE DATE(date_time) BETWEEN 
    ${sql.escape(trackernity_history.date_start)} AND ${sql.escape(trackernity_history.date_end)} 
    AND user_id = ${sql.escape(trackernity_history.user_id)} AND remarks = ${sql.escape(trackernity_history.remarks)}) GROUP BY token ORDER BY date_time ASC;`;

    sql.query(query, (err, res) => {
        if(err){
            throw err;
            result(err,null);
            return;
        }
        if(!res.length){
            console.log("error: ","No Data !");
            result("No Data !",null);
            return;
        }else{
            const successGetHistory = {
                code:"200",
                status:"Success!",
                data:res
            }
            console.log("Data History: ", successGetHistory);
            result(null, successGetHistory);
            return;
        }
    });
}

const TrackernityHistoryDetail = function(trackernity_history_detail){
    this.token = trackernity_history_detail.token
};

TrackernityHistoryDetail.getTrackingHistoryDetail = (trackernity_history_detail,result) => {
    let query = `SELECT * FROM t_posisi_teknisi_new WHERE token = ${sql.escape(trackernity_history_detail.token)};`;

    sql.query(query, (err, res) => {
        if(err){
            throw err;
            result(err,null);
            return;
        }
        if(!res.length){
            console.log("error: ","No Data !");
            result("No Data !", null);
            return;
        }else{
            const successGetHistoryDetail = {
                code:"200",
                status:"Success!",
                data:res
            }
            console.log("Data History Detail: ", successGetHistoryDetail);
            result(null, successGetHistoryDetail);
            return;
        }
    });
}

module.exports = {
    trackernity: Trackernity,
    trackernityAlpro: TrackernityAlpro,
    trackernityGangguan: TrackernityGangguan,
    trackernityHistory: TrackernityHistory,
    trackernityHistoryDetail: TrackernityHistoryDetail,
    trackernityPerkiraan: TrackernityPerkiraan,
};