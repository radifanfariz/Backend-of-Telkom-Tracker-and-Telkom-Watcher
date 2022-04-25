// const { encode } = require("@googlemaps/polyline-codec");
const { HaversineMethod, bearingFunc, VincentyMethod } = require("./distance-methods");

// const latLngAndPolyline = function(latLon,polyline){
//     this.latLon = latLon,
//     this.polyline = polyline
// }

exports.getLatLng = (jarakPerkiraan,queryRow) => {

    let i = 0;
    let jarakProses = 0;
    let currentJarak;
    // let path = [[]];
    while(jarakProses < jarakPerkiraan){
        if(queryRow[i+1] != null){
            const haversineMethod = new HaversineMethod({
                lat1: queryRow[i].lat,
                lon1: queryRow[i].lgt,
                lat2: queryRow[i+1].lat,
                lon2: queryRow[i+1].lgt,
            });
            currentJarak = haversineMethod.distance();
            jarakProses += currentJarak;

            // path[i] = ([haversineMethod.lat1,haversineMethod.lon1]);
            // path[i+1] = ([haversineMethod.lat2,haversineMethod.lon2]);
        }else{
            break;
        }
        i++;
    }
    const deltaDistance = Math.abs(jarakPerkiraan - Math.abs(jarakProses - currentJarak));
    const bearing = bearingFunc({
        lat1: queryRow[i-1].lat,
        lon1: queryRow[i-1].lgt,
        lat2: queryRow[i].lat,
        lon2: queryRow[i].lgt,
    });

    const latLon = new HaversineMethod({
        lat1: queryRow[i-1].lat,
        lon1: queryRow[i-1].lgt,
        lat2: null,
        lon2: null,
    }).destination(bearing,deltaDistance);

    // console.log(`test polyline:${path}`);
    // const polylineEncoded = encode(path,5);

    // return new latLngAndPolyline(latLon,polylineEncoded);

    return latLon;

}

exports.getLatLngVincenty = (jarakPerkiraan,queryRow) => {

    let i = 0;
    let jarakProses = 0;
    let currentJarak;
    while(jarakProses < jarakPerkiraan){
        if(queryRow[i+1] != null){
            const vincentyMethod = new VincentyMethod({
                lat1: queryRow[i].lat,
                lon1: queryRow[i].lgt,
                lat2: queryRow[i+1].lat,
                lon2: queryRow[i+1].lgt,
            });
            currentJarak = vincentyMethod.distance();
            jarakProses += currentJarak;
        }else{
            break;
        }
        i++;
    }
    const deltaDistance = Math.abs(jarakPerkiraan - Math.abs(jarakProses - currentJarak));
    console.log(`delta:${deltaDistance}, current:${currentJarak}, proses:${jarakProses}, perkiraan:${jarakPerkiraan}`);
    const bearing = bearingFunc({
        lat1: queryRow[i-1].lat,
        lon1: queryRow[i-1].lgt,
        lat2: queryRow[i].lat,
        lon2: queryRow[i].lgt,
    });

    const latLon = new VincentyMethod({
        lat1: queryRow[i-1].lat,
        lon1: queryRow[i-1].lgt,
        lat2: null,
        lon2: null,
    }).destination(bearing,deltaDistance);

    // console.log(`test: ${jarakProses}`)

    return latLon;

}