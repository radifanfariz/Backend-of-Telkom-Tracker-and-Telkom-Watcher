const { ValidateRegister } = require("../middleware/user.js");

module.exports = (app) => {
    const trackernity = require("../controllers/trackernity.controller.js");
    const userData = require("../controllers/trackernity.authentication.controller.js");
    
    var router = require("express").Router();

    router.post("/", trackernity.insert);

    router.post("/alpro", trackernity.insertAlpro);

    router.post("/gangguan",trackernity.insertGangguan);

    router.post("/perkiraan",trackernity.insertPerkiraan);

    router.get("/", trackernity.getTeknisi);

    router.get("/alpro", trackernity.getAlproFilteredByRemarks);

    router.get("/alpro-second", trackernity.getAlproSecond);

    router.get("/gangguan", trackernity.getGangguanFilteredByRemarks);

    router.get("/perkiraan", trackernity.getPerkiraanFilteredByRemarks);

    router.get("/tracking-history",trackernity.getTrackingHistory)

    router.get("/tracking-history-detail",trackernity.getTrackingHistoryDetail)

    router.get("/dropdown-item",trackernity.getDropdownItemTrackernity);

    router.get("/dropdown-item-second",trackernity.getDropdownItemTrackernitySecond);
    
    router.get("/dropdown-item-others",trackernity.getDropdownItemTrackernityOthers);

    router.get("/dropdown-item-auth",userData.getDropdownItemAuth);

    ////////////////////dropdown item apro per item AND get alpro//////////////////

    router.get("/dropdown-item-treg",trackernity.getDropdownItemTrackernityTreg);

    router.get("/dropdown-item-witel",trackernity.getDropdownItemTrackernityWitel);

    router.get("/dropdown-item-remarks",trackernity.getDropdownItemTrackernityRemarks);

    router.get("/dropdown-item-routes",trackernity.getDropdownItemTrackernityRoutes);

    router.get("/alpro-third",trackernity.getAlproThird);

    ////////////////////////////////////////////////////////////////

    router.post("/sign-up",ValidateRegister,userData.signUp);

    router.post("/login",userData.login);

    app.use('/api/trackernity', router);
};