Number.prototype.toRad = function(){
    return this * Math.PI / 180;
}

Number.prototype.toDegree = function(){
    return this * 180 / Math.PI;
}

const LatLon = function(lat,lon){
    this.lat = lat;
    this.lon = lon;
}


/////////////Haversine Method Distance/////////////////
class HaversineMethod {
    constructor(item) {
        this.lat1 = item.lat1;
        this.lon1 = item.lon1;
        this.lat2 = item.lat2;
        this.lon2 = item.lon2;
    }
    distance() {
        const R = 6378137;
        const x1 = this.lat2 - this.lat1;
        const dLat = x1.toRad();
        const x2 = this.lon2 - this.lon1;
        const dLon = x2.toRad();
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.lat1.toRad()) * Math.cos(this.lat2.toRad()) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;

        console.log(`distance : ${d}`);

        return d;
    }

    destination(brng,dist){
        const R = 6378137;
        let destLat = Math.asin(Math.sin(this.lat1.toRad()) * Math.cos(dist/R) +
        Math.cos(this.lat1.toRad()) * Math.sin(dist/R) * Math.cos(brng.toRad()));
        let destLon = this.lon1.toRad() + Math.atan2(Math.sin(brng.toRad()) * Math.sin(dist/R) * Math.cos(this.lat1.toRad()),
        Math.cos(dist/R) - Math.sin(this.lat1.toRad())* Math.sin(destLat));
        
        return new LatLon(destLat.toDegree(),destLon.toDegree());
    }
}

/////////////Vincenty Method Distance/////////////////
class VincentyMethod {
    constructor(item) {
        this.lat1 = item.lat1;
        this.lon1 = item.lon1;
        this.lat2 = item.lat2;
        this.lon2 = item.lon2;
    }
    distance() {
        let a = 6378137,
        b = 6356752.3142,
        f = 1/298.257223563,
        L = (this.lon2 - this.lon1).toRad(),
        U1 = Math.atan((1 - f) * Math.tan(this.lat1.toRad())),
        U2 = Math.atan((1 - f) * Math.tan(this.lat2.toRad())),
        sinU1 = Math.sin(U1),
        cosU1 = Math.cos(U1),
        sinU2 = Math.sin(U2),
        cosU2 = Math.cos(U2),
        lambda = L,
        lambdaP,
        iterLimit = 100;

        /////Initiate Variable////
        let sinLambda,cosLambda,sinSigma,cosSigma,sigma,sinAlpha,cosSqAlpha,cos2SigmaM,C;
        do {
                sinLambda = Math.sin(lambda);
                cosLambda = Math.cos(lambda);
                sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
            if (0 === sinSigma) {
             return 0; // co-incident points
            };
                cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
                sigma = Math.atan2(sinSigma, cosSigma);
                sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
                cosSqAlpha = 1 - sinAlpha * sinAlpha;
                cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
                C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
            if (isNaN(cos2SigmaM)) {
             cos2SigmaM = 0; // equatorial line: cosSqAlpha = 0 (§6)
            };
            lambdaP = lambda;
            lambda = L + (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
        } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);
          
        if (!iterLimit) {
        return NaN; // formula failed to converge
        };
        
        let uSq = cosSqAlpha * (a * a - b * b) / (b * b),
            A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq))),
            B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq))),
            deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM))),
            s = b * A * (sigma - deltaSigma);
        // return s.toFixed(3); // round to 1mm precision and convert to string
        console.log(`distance : ${s}`);
        return s;
    }

    destination(brng, dist) {
        let a = 6378137,
            b = 6356752.3142,
            f = 1 / 298.257223563, // WGS-84 ellipsiod
            s = dist,
            alpha1 = brng.toRad(),
            sinAlpha1 = Math.sin(alpha1),
            cosAlpha1 = Math.cos(alpha1),
            tanU1 = (1 - f) * Math.tan(this.lat1.toRad()),
            cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1,
            sigma1 = Math.atan2(tanU1, cosAlpha1),
            sinAlpha = cosU1 * sinAlpha1,
            cosSqAlpha = 1 - sinAlpha * sinAlpha,
            uSq = cosSqAlpha * (a * a - b * b) / (b * b),
            A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq))),
            B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq))),
            sigma = s / (b * A),
            sigmaP = 2 * Math.PI;


        ///////Initiate Variable///////
        let cos2SigmaM,sinSigma,cosSigma, deltaSigma;

        while (Math.abs(sigma - sigmaP) > 1e-12) {
         cos2SigmaM = Math.cos(2 * sigma1 + sigma);
             sinSigma = Math.sin(sigma);
             cosSigma = Math.cos(sigma);
             deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
         sigmaP = sigma;
         sigma = s / (b * A) + deltaSigma;
        };
        let tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1,
            destLat = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1, (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)),
            lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1),
            C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha)),
            L = lambda - (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM))),
            revAz = Math.atan2(sinAlpha, -tmp); // final bearing
    return new LatLon(destLat.toDegree(), this.lon1 + L.toDegree());
    }
}

///////////////////////Bearing function///////////////////////
function bearingFunc(originDestination){
    const X = Math.cos(originDestination.lat2.toRad()) * Math.sin(originDestination.lon2.toRad() - originDestination.lon1.toRad());
    const Y = Math.cos(originDestination.lat1.toRad()) * Math.sin(originDestination.lat2.toRad()) - Math.sin(originDestination.lat1.toRad()) *
     Math.cos(originDestination.lat2.toRad()) * Math.cos(originDestination.lon2.toRad() - originDestination.lon1.toRad());
    const brng = Math.atan2(X,Y).toDegree();

    if (brng >= 0) {
        return brng;
    } else {
        return 360 + brng;
    }
}

///////////////////exporting//////////////////
module.exports =  {HaversineMethod, VincentyMethod, bearingFunc};

