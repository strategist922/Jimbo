var SP = require('../models/snippetProvider-redis');
var sharejs = require('share');

arr = ["{\"op\":[{\"p\":0,\"i\":\"$\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312519045}}",
 "{\"op\":[{\"p\":1,\"i\":\"()\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312519159}}",
 "{\"op\":[{\"p\":2,\"i\":\"\\\"\\\"\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312519264}}",
 "{\"op\":[{\"p\":3,\"i\":\".\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312520166}}",
 "{\"op\":[{\"p\":4,\"i\":\"b\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312520527}}",
 "{\"op\":[{\"i\":\"tn\",\"p\":5}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312520625}}",
 "{\"op\":[{\"p\":9,\"i\":\".\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312521961}}",
 "{\"op\":[{\"i\":\"cl\",\"p\":10}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312522104}}",
 "{\"op\":[{\"p\":12,\"i\":\"i\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312522241}}",
"{\"op\":[{\"i\":\"ck\",\"p\":13}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312522421}}",
"{\"op\":[{\"p\":15,\"i\":\"()\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312523208}}",
"{\"op\":[{\"p\":16,\"i\":\"f\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312523612}}",
"{\"op\":[{\"i\":\"un\",\"p\":17}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312523742}}",
"{\"op\":[{\"i\":\"cti\",\"p\":19}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312524150}}",
"{\"op\":[{\"p\":22,\"i\":\"o\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312524234}}",
"{\"op\":[{\"p\":23,\"i\":\"n\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312524386}}",
"{\"op\":[{\"p\":24,\"i\":\"()\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312524725}}",
"{\"op\":[{\"p\":26,\"i\":\"{}\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312525869}}",
"{\"op\":[{\"i\":\"\\n  \\n\",\"p\":27}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312526211}}",
"{\"op\":[{\"p\":33,\"i\":\";\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312527164}}",
"{\"op\":[{\"p\":30,\"i\":\"v\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312528413}}",
"{\"op\":[{\"p\":31,\"i\":\"a\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312528476}}",
"{\"op\":[{\"p\":32,\"i\":\"r\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312528601}}",
"{\"op\":[{\"p\":33,\"i\":\" \"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312528692}}",
"{\"op\":[{\"p\":34,\"i\":\"n\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312528914}}",
"{\"op\":[{\"i\":\"am\",\"p\":35}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312529011}}",
"{\"op\":[{\"p\":37,\"i\":\"e\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312529245}}",
"{\"op\":[{\"p\":38,\"i\":\" \"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312529399}}",
"{\"op\":[{\"p\":39,\"i\":\"=\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312529591}}",
"{\"op\":[{\"p\":40,\"i\":\" \"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312529616}}",
"{\"op\":[{\"p\":41,\"i\":\"$\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312531781}}",
"{\"op\":[{\"p\":42,\"i\":\"()\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312531919}}",
"{\"op\":[{\"p\":43,\"i\":\"\\\"\\\"\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312532790}}",
"{\"op\":[{\"p\":44,\"i\":\"i\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312533207}}",
"{\"op\":[{\"p\":45,\"i\":\"n\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312533415}}",
"{\"op\":[{\"p\":46,\"i\":\"o\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312533732}}",
"{\"op\":[{\"p\":47,\"i\":\"u\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312533999}}",
"{\"op\":[{\"p\":48,\"i\":\"t\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312534075}}",
"{\"op\":[{\"p\":46,\"d\":\"o\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312535390}}",
"{\"op\":[{\"p\":46,\"i\":\"p\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312535775}}",
"{\"op\":[{\"p\":51,\"i\":\".\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312536789}}",
"{\"op\":[{\"p\":52,\"i\":\"v\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312537024}}",
"{\"op\":[{\"p\":53,\"i\":\"a\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312537108}}",
"{\"op\":[{\"p\":54,\"i\":\"l\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312537210}}",
"{\"op\":[{\"p\":55,\"i\":\"()\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312537752}}",
"{\"op\":[{\"p\":57,\"i\":\";\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312538744}}",
"{\"op\":[{\"i\":\"\\n  \",\"p\":58}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312540907}}",
"{\"op\":[{\"p\":61,\"i\":\"$\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312541845}}",
"{\"op\":[{\"p\":62,\"i\":\"()\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312542590}}",
"{\"op\":[{\"p\":63,\"i\":\"\\\"\\\"\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312542642}}",
"{\"op\":[{\"p\":64,\"i\":\"s\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312543173}}",
"{\"op\":[{\"p\":65,\"i\":\"p\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312543327}}",
"{\"op\":[{\"p\":66,\"i\":\"a\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312543461}}",
"{\"op\":[{\"p\":67,\"i\":\"n\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312543636}}",
"{\"op\":[{\"p\":68,\"i\":\"#\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312549959}}",
"{\"op\":[{\"p\":69,\"i\":\"n\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312550049}}",
"{\"op\":[{\"p\":70,\"i\":\"a\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312550156}}",
"{\"op\":[{\"p\":71,\"i\":\"m\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312550374}}",
"{\"op\":[{\"p\":72,\"i\":\"e\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312550485}}",
"{\"op\":[{\"p\":75,\"i\":\".\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312552302}}",
"{\"op\":[{\"p\":76,\"i\":\"h\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312553149}}",
"{\"op\":[{\"i\":\"tm\",\"p\":77}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312553351}}",
"{\"op\":[{\"p\":79,\"i\":\"l\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312553468}}",
"{\"op\":[{\"p\":80,\"i\":\"()\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312553865}}",
"{\"op\":[{\"p\":81,\"i\":\"\\\"\\\"\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312556006}}",
"{\"op\":[{\"p\":82,\"i\":\"H\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312556782}}",
"{\"op\":[{\"p\":83,\"i\":\"e\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312556938}}",
"{\"op\":[{\"p\":84,\"i\":\"l\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312557065}}",
"{\"op\":[{\"p\":85,\"i\":\"l\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312557140}}",
"{\"op\":[{\"p\":86,\"i\":\"o\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312557543}}",
"{\"op\":[{\"p\":87,\"i\":\" \"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312558232}}",
"{\"op\":[{\"p\":89,\"i\":\" \"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312558773}}",
"{\"op\":[{\"p\":90,\"i\":\"+\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312559359}}",
"{\"op\":[{\"p\":91,\"i\":\" \"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312559434}}",
"{\"op\":[{\"p\":92,\"i\":\"n\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312559680}}",
"{\"op\":[{\"p\":93,\"i\":\"a\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312559786}}",
"{\"op\":[{\"p\":94,\"i\":\"m\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312559929}}",
"{\"op\":[{\"p\":95,\"i\":\"e\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312560031}}",
"{\"op\":[{\"p\":97,\"i\":\";\"}],\"meta\":{\"source\":\"d197925d1f115e609fe6db5496be2962\",\"ts\":1393312560977}}",
"{\"op\":[{\"i\":\"\\n  \",\"p\":98}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312562992}}",
"{\"op\":[{\"p\":101,\"i\":\"$(\\\"input\\\").val();\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312568702}}",
"{\"op\":[{\"p\":116,\"i\":\"\\\"\\\"\"}],\"meta\":{\"source\":\"3492020d6fb6720c301d515ebff53469\",\"ts\":1393312570100}}"]

exports.newSnippet = function(req, res) {        
    res.render("snippet/index");
};

exports.reviewCode = function(req, res) {
    res.render("snippet/review");
};
console.log(sharejs.server);
exports.getOps = function(req, res) {
    var name = req.body['docName'];
    console.log(name);
    res.json({
        ops: arr,
        error: null
    });

    // sharejs.getOps(name, 0, -1, function(err, ops){
    //     if(!err)
    //         res.json({
    //             ops: ops,
    //             error: null
    //         });
    //     else {
    //         res.json({
    //             ops: null,
    //             error: err
    //         });
    //     }
    // })
};

exports.loadSnippet = function(req, res) {        
    var sId = req.body.snippetId;
    var type = "html";
    request(
        {
            uri: "/doc/" + sId + "-" + type,
            method: "GET"
        },
        function(err, response, body){
            console.log(response);        
        }        
    );
        
};

