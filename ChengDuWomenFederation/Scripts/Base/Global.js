﻿window.CDWF = {
    Map: null,
    MapObj: null,
    Chengdu: {
        x: 104.06258321778,//102.54441,//30.662272573243
        y: 30.662272573243,//104.06258321778 30.42126
        region: "104.426407, 30.603622;104.436282, 30.602244;104.443773, 30.596905;104.454868, 30.599578;104.459728, 30.595611;104.48289, 30.601529;104.499984, 30.600029;104.501111, 30.606089;104.511294, 30.60462;104.524041, 30.61981;104.532338, 30.619214;104.534415, 30.628581;104.550508, 30.631962;104.549201, 30.641119;104.572218, 30.633393;104.576382, 30.64533;104.584777, 30.649376;104.59211, 30.635651;104.604387, 30.639091;104.619425, 30.624193;104.627807, 30.62618;104.633646, 30.620648;104.644505, 30.623733;104.659347, 30.617467;104.660762, 30.61155;104.668816, 30.616922;104.674634, 30.612208;104.678834, 30.615365;104.691525, 30.606795;104.707657, 30.602344;104.7004, 30.58697;104.693723, 30.585008;104.691608, 30.563973;104.697741, 30.557746;104.734022, 30.544803;104.739296, 30.531092;104.73858, 30.520133;104.766013, 30.511174;104.769056, 30.499871;104.773041, 30.496876;104.769537, 30.491075;104.781155, 30.492423;104.789441, 30.497523;104.812388, 30.49829;104.813122, 30.510585;104.819635, 30.514827;104.84289, 30.516633;104.857899, 30.510608;104.869871, 30.515708;104.88212, 30.515121;104.88318, 30.520005;104.88874, 30.521991;104.887447, 30.527801;104.899181, 30.547664;104.895917, 30.561677;104.884256, 30.556733;104.88213, 30.566424;104.872555, 30.570576;104.86956, 30.590948;104.863918, 30.58977;104.860519, 30.593079;104.855488, 30.588206;104.847864, 30.594029;104.846861, 30.588599;104.838955, 30.589027;104.834003, 30.585093;104.825273, 30.584065;104.823496, 30.593058;104.8278, 30.604983;104.838569, 30.615639;104.844278, 30.631692;104.853792, 30.637318;104.853694, 30.646288;104.846183, 30.656322;104.837006, 30.65616;104.831139, 30.649731;104.828325, 30.650906;104.824912, 30.670027;104.817719, 30.685849;104.80944, 30.696027;104.795823, 30.698289;104.79533, 30.715908;104.801013, 30.722318;104.79979, 30.72582;104.78259, 30.727787;104.774461, 30.724428;104.773117, 30.73301;104.755191, 30.734033;104.755053, 30.742287;104.748326, 30.746758;104.752449, 30.757264;104.745375, 30.764139;104.739794, 30.783269;104.73448, 30.785302;104.724705, 30.777603;104.716928, 30.778776;104.717318, 30.784616;104.721333, 30.782919;104.720454, 30.790557;104.705387, 30.826174;104.70159, 30.829486;104.687495, 30.831922;104.682929, 30.837223;104.646774, 30.844247;104.635781, 30.857966;104.615942, 30.853086;104.602489, 30.869502;104.585877, 30.870359;104.54795, 30.885585;104.526873, 30.889275;104.526495, 30.894852;104.53338, 30.901542;104.533409, 30.910517;104.538951, 30.922178;104.519868, 30.941425;104.500474, 30.943059;104.471139, 30.956036;104.452331, 30.948244;104.430664, 30.949507;104.412594, 30.943572;104.40037, 30.948744;104.394506, 30.930545;104.389213, 30.93846;104.381458, 30.942655;104.36804, 30.931089;104.358473, 30.909621;104.353447, 30.912176;104.350758, 30.907971;104.338642, 30.906376;104.328338, 30.898381;104.304724, 30.907963;104.272567, 30.905671;104.266387, 30.910227;104.256346, 30.904692;104.244325, 30.90211;104.239553, 30.904111;104.228977, 30.898502;104.20783, 30.918282;104.198365, 30.919362;104.177933, 30.913372;104.17282, 30.924981;104.156146, 30.92022;104.147775, 30.934481;104.159158, 30.93574;104.158726, 30.945501;104.171634, 30.9601;104.176613, 30.979178;104.172492, 30.999339;104.163023, 31.010551;104.155245, 31.010114;104.14973, 31.016449;104.125684, 31.024898;104.126926, 31.037119;104.105621, 31.039724;104.093948, 31.046143;104.084177, 31.057958;104.083975, 31.069936;104.073261, 31.073762;104.072452, 31.078708;104.053374, 31.088522;104.049829, 31.092259;104.051903, 31.095874;104.038755, 31.102986;104.033751, 31.111188;104.028091, 31.110122;104.035748, 31.119297;104.026017, 31.121496;104.031517, 31.132021;104.017216, 31.158631;104.021445, 31.17161;104.015778, 31.182568;104.006792, 31.185314;104.001713, 31.193542;103.978517, 31.213517;103.970406, 31.209952;103.965853, 31.203401;103.961618, 31.209705;103.954708, 31.203772;103.949532, 31.213531;103.9561, 31.220442;103.951677, 31.220269;103.951192, 31.224342;103.935616, 31.238541;103.941075, 31.249846;103.932393, 31.264565;103.939263, 31.272261;103.934423, 31.278767;103.920575, 31.285281;103.899907, 31.307417;103.900928, 31.332087;103.917783, 31.34825;103.931787, 31.353862;103.934778, 31.361413;103.926064, 31.369671;103.926642, 31.377296;103.902887, 31.407636;103.903376, 31.423863;103.897114, 31.427137;103.890221, 31.421632;103.882585, 31.420772;103.873523, 31.427223;103.860009, 31.419532;103.843559, 31.42029;103.837338, 31.417286;103.823909, 31.428838;103.82248, 31.438141;103.816991, 31.440826;103.78456, 31.437341;103.760756, 31.423006;103.752029, 31.421534;103.746496, 31.404544;103.73648, 31.40037;103.707883, 31.397618;103.704236, 31.389978;103.688341, 31.378278;103.677143, 31.362143;103.670955, 31.35884;103.662375, 31.356218;103.646926, 31.358066;103.633708, 31.349847;103.619598, 31.352298;103.612006, 31.357206;103.601934, 31.348024;103.579963, 31.347878;103.57604, 31.344742;103.576782, 31.318604;103.586191, 31.297433;103.576275, 31.281128;103.57556, 31.268299;103.587558, 31.25376;103.583213, 31.222056;103.58913, 31.214941;103.589688, 31.197509;103.580863, 31.186478;103.571218, 31.181313;103.563604, 31.155401;103.553472, 31.144886;103.548749, 31.129291;103.532238, 31.107053;103.535145, 31.096213;103.527017, 31.085754;103.526647, 31.069357;103.511186, 31.046253;103.523703, 31.035952;103.527402, 31.008623;103.521264, 30.991823;103.525375, 30.980457;103.511867, 30.975576;103.503586, 30.96585;103.491957, 30.962272;103.464806, 30.939519;103.458487, 30.917141;103.460477, 30.901764;103.450191, 30.89085;103.439392, 30.884585;103.434073, 30.886811;103.418481, 30.871755;103.391862, 30.871272;103.369534, 30.857671;103.361074, 30.856796;103.344088, 30.830871;103.335965, 30.831669;103.311637, 30.816732;103.30098, 30.818737;103.291191, 30.835469;103.28172, 30.834461;103.271977, 30.83797;103.264911, 30.848094;103.254658, 30.843997;103.236496, 30.842407;103.219794, 30.84418;103.205582, 30.852042;103.182093, 30.853033;103.172241, 30.8481;103.163525, 30.832153;103.146921, 30.822109;103.140561, 30.807908;103.130478, 30.798576;103.089234, 30.819466;103.079903, 30.820813;103.062058, 30.809729;103.044467, 30.80818;103.029961, 30.800578;103.050121, 30.789693;103.062607, 30.769626;103.079873, 30.758484;103.087786, 30.748518;103.115303, 30.736206;103.11523, 30.724574;103.122428, 30.715638;103.122613, 30.707212;103.13473, 30.695101;103.132381, 30.676528;103.123637, 30.66671;103.121384, 30.65823;103.124334, 30.648898;103.122904, 30.630734;103.113679, 30.617781;103.104696, 30.611443;103.120083, 30.607729;103.134742, 30.61077;103.133438, 30.5997;103.137375, 30.59257;103.143871, 30.588582;103.154406, 30.591591;103.158134, 30.580577;103.166804, 30.571967;103.185183, 30.56889;103.195373, 30.546941;103.189698, 30.53131;103.194525, 30.519718;103.191972, 30.512255;103.181336, 30.504892;103.165652, 30.481688;103.153157, 30.480299;103.136615, 30.461966;103.134856, 30.454866;103.147873, 30.45023;103.145258, 30.444971;103.125131, 30.443435;103.131294, 30.428477;103.122887, 30.385904;103.133051, 30.38041;103.134591, 30.372909;103.097557, 30.332752;103.092142, 30.329748;103.085504, 30.330888;103.068692, 30.311997;103.07506, 30.300529;103.068325, 30.272947;103.07179, 30.26827;103.078022, 30.267208;103.078546, 30.247032;103.084861, 30.236306;103.083172, 30.226573;103.154441, 30.212463;103.162958, 30.217927;103.189237, 30.254503;103.202415, 30.243065;103.214008, 30.24626;103.221819, 30.238792;103.224813, 30.212088;103.238987, 30.221757;103.240289, 30.241348;103.24852, 30.253448;103.265031, 30.256721;103.286464, 30.270363;103.320117, 30.266654;103.326705, 30.25688;103.327592, 30.239034;103.355407, 30.24293;103.360296, 30.238374;103.378764, 30.23333;103.380351, 30.222277;103.375431, 30.212411;103.376921, 30.20566;103.366463, 30.196705;103.371392, 30.187468;103.365535, 30.177328;103.377839, 30.16902;103.375667, 30.15965;103.379116, 30.15421;103.366889, 30.140325;103.375478, 30.135937;103.385358, 30.116551;103.395604, 30.11024;103.396572, 30.104149;103.40391, 30.099735;103.412105, 30.103295;103.430286, 30.121414;103.437442, 30.113761;103.442117, 30.115411;103.445622, 30.125756;103.451649, 30.122031;103.44844, 30.117143;103.454815, 30.104146;103.462407, 30.100642;103.469531, 30.102335;103.476151, 30.111656;103.474626, 30.120383;103.464843, 30.127414;103.45836, 30.128455;103.453443, 30.124641;103.442511, 30.130011;103.451727, 30.130906;103.45637, 30.139276;103.47032, 30.13822;103.47307, 30.142619;103.488532, 30.117681;103.489739, 30.108795;103.492281, 30.109291;103.509042, 30.132881;103.519004, 30.133832;103.522632, 30.144676;103.539395, 30.151951;103.550809, 30.163118;103.547432, 30.186385;103.566466, 30.192085;103.576438, 30.201171;103.584867, 30.203944;103.589767, 30.202287;103.593792, 30.20684;103.603703, 30.208403;103.618083, 30.207456;103.615488, 30.198907;103.622592, 30.199735;103.635686, 30.219687;103.641475, 30.21279;103.659021, 30.205749;103.654704, 30.236627;103.660802, 30.241805;103.686257, 30.245874;103.690201, 30.261042;103.694326, 30.264686;103.688156, 30.271454;103.68871, 30.27761;103.698294, 30.275727;103.702052, 30.279148;103.713115, 30.275999;103.725595, 30.291344;103.743419, 30.291504;103.744353, 30.297995;103.734394, 30.31367;103.744392, 30.315986;103.750441, 30.31183;103.75921, 30.311821;103.759276, 30.323775;103.773334, 30.323726;103.772936, 30.332796;103.777503, 30.33895;103.803082, 30.352642;103.855458, 30.350325;103.878481, 30.358236;103.88859, 30.332191;103.902153, 30.338232;103.919162, 30.334897;103.915908, 30.342378;103.92402, 30.341888;103.919373, 30.345204;103.924859, 30.348327;103.920438, 30.358818;103.921882, 30.36307;103.934588, 30.367983;103.947529, 30.3655;103.941483, 30.354223;103.949686, 30.338798;103.960591, 30.328543;103.96968, 30.325591;103.981893, 30.312331;103.981308, 30.296464;104.003649, 30.271122;104.014246, 30.269927;104.034213, 30.277901;104.038742, 30.27078;104.055213, 30.276689;104.059429, 30.269221;104.069332, 30.271959;104.07577, 30.261074;104.084286, 30.262231;104.08816, 30.254532;104.097215, 30.255193;104.10241, 30.24629;104.116004, 30.242261;104.121277, 30.233531;104.132332, 30.233679;104.155947, 30.250027;104.158706, 30.271618;104.165406, 30.274384;104.164871, 30.282582;104.174301, 30.290533;104.176072, 30.30151;104.185024, 30.316616;104.185064, 30.324398;104.205112, 30.345639;104.203235, 30.357562;104.224966, 30.381132;104.224616, 30.396928;104.234621, 30.403168;104.235562, 30.417957;104.24146, 30.424538;104.256537, 30.42667;104.253854, 30.434159;104.275703, 30.461882;104.266648, 30.465034;104.255905, 30.462983;104.252375, 30.466115;104.257049, 30.472036;104.266879, 30.475308;104.26085, 30.482228;104.264936, 30.48949;104.282, 30.49408;104.29745, 30.503531;104.302232, 30.511135;104.321296, 30.497745;104.338257, 30.499545;104.336173, 30.507009;104.339383, 30.51309;104.329855, 30.516089;104.3336, 30.522399;104.342554, 30.517052;104.349727, 30.503626;104.351682, 30.495127;104.346833, 30.489826;104.348095, 30.486337;104.359606, 30.489833;104.367749, 30.48848;104.374906, 30.495814;104.398725, 30.492804;104.403983, 30.501286;104.402299, 30.510337;104.417759, 30.518004;104.422552, 30.525126;104.421329, 30.529222;104.408352, 30.534106;104.404976, 30.539075;104.408592, 30.542933;104.408942, 30.560701;104.414296, 30.568889;104.408636, 30.582704;104.411523, 30.596934;104.418796, 30.602906;104.426407, 30.603622"
    },
    MenuObj: null,
    CurrentActiveFuncIndex: -1,
    isStatistics: false,
    ScrollBar: null,
    PopArr: [],
    MarkerArr: [],
    MarkerLayer: null,
    MarkerLastSelected: null,
    TextArr: [],
    MarkerSettings: {
        //经纬焦点marker图标路径
        url: "Content/Index/Images/2222.gif",
        //marker图标实际像素大小
        markerSize: {
            w: 440,
            h: 316
        },
        //要交汇在哪个点
        position: {
            x: 104.06258321778,
            y: 30.662272573243
        },
        //经纬线样式
        featureStyle: {
            //颜色
            strokeColor: "yellow",
            fillColor: "yellow",
            fillOpacity: 1,
            //线宽
            strokeWidth: 2,
            pointerEvents: "visiblePainted"
        }
    },

    //自定义图层配置，同步修改TreeNode配置
    CustomLayer: [

        {
            name: 'arcgisTest2',
            treeName: '2016-6-13',
            url: 'http://localhost:6080/arcgis/rest/services/MyMapService666/MapServer/export',
            isBaseLayer: false,
            isVisiable: false
        },
        {
            name: 'arcgisTest3',
            treeName: '2016-5-24',
            url: 'http://localhost:6080/arcgis/rest/services/MyMapService11/MapServer/export',
            isBaseLayer: false,
            isVisiable: false
        },
    ],
    TreeNode: [
			{
			    name: "2016年",
			    open: true,
			    children: [
					{
					    name: "5月",
					    open: true,
					    children: [

                            { name: "2016-5-24", layerName: "arcgisTest3", checked: false }
					    ]
					},
					{
					    name: "6月",
					    open: true,
					    children: [
							{ name: "2016-6-13", layerName: "arcgisTest2", checked: false }
					    ]
					}
			    ]
			}

    ]
};

window.SICHUAN = [
["510100", "成都市"], ["510101", "成都市市辖区"], ["510104", "成都市锦江区"], ["510105", "成都市青羊区"], ["510106", "成都市金牛区"], ["510107", "成都市武侯区"],
["510108", "成都市成华区"], ["510112", "成都市龙泉驿区"], ["510113", "成都市青白江区"], ["510114", "成都市新都区"],
["510115", "成都市温江区"], ["510121", "金堂县"], ["510122", "双流县"], ["510124", "郫县"], ["510129", "大邑县"],
["510131", "蒲江县"], ["510132", "新津县"], ["510181", "都江堰市"], ["510182", "彭州市"], ["510183", "邛崃市"],
["510184", "崇州市"], ["510300", "自贡市"], ["510301", "自贡市市辖区"], ["510302", "自贡市自流井区"],
["510303", "自贡市贡井区"], ["510304", "自贡市大安区"], ["510311", "自贡市沿滩区"], ["510321", "荣县"],
["510322", "富顺县"], ["510400", "攀枝花市"], ["510401", "攀枝花市市辖区"], ["510402", "攀枝花市东区"],
["510403", "攀枝花市西区"], ["510411", "攀枝花市仁和区"], ["510421", "米易县"], ["510422", "盐边县"], ["510500", "泸州市"],
["510501", "泸州市市辖区"], ["510502", "泸州市江阳区"], ["510503", "泸州市纳溪区"], ["510504", "泸州市龙马潭区"], ["510521", "泸县"],
["510522", "合江县"], ["510524", "叙永县"], ["510525", "古蔺县"], ["510600", "德阳市"], ["510601", "德阳市市辖区"],
["510603", "德阳市旌阳区"], ["510623", "中江县"], ["510626", "罗江县"], ["510681", "广汉市"], ["510682", "什邡市"], ["510683", "绵竹市"],
["510700", "绵阳市"], ["510701", "绵阳市市辖区"], ["510703", "绵阳市涪城区"], ["510704", "绵阳市游仙区"], ["510722", "三台县"],
["510723", "盐亭县"], ["510724", "安县"], ["510725", "梓潼县"], ["510726", "北川羌族自治县"], ["510727", "平武县"], ["510781", "江油市"],
["510800", "广元市"], ["510801", "广元市市辖区"], ["510802", "广元市利州区"], ["510811", " 广元市昭化区"], ["510812", "广元市朝天区"],
["510821", "旺苍县"], ["510822", "青川县"], ["510823", "剑阁县"], ["510824", "苍溪县"], ["510900", "遂宁市"], ["510901", "遂宁市市辖区"],
["510903", "遂宁市船山区"], ["510904", "遂宁市安居区"], ["510921", "蓬溪县"], ["510922", "射洪县"], ["510923", "大英县"],
["511000", "内江市"], ["511001", "内江市市辖区"], ["511002", "内江市市中区"], ["511011", "内江市东兴区"], ["511024", "威远县"],
["511025", "资中县"], ["511028", "隆昌县"], ["511100", "乐山市"], ["511101", "乐山市市辖区"], ["511102", "乐山市市中区"],
["511111", "乐山市沙湾区"], ["511112", "乐山市五通桥区"], ["511113", "乐山市金口河区"], ["511123", "犍为县"], ["511124", "井研县"],
["511126", "夹江县"], ["511129", "沐川县"], ["511132", "峨边彝族自治县"], ["511133", "马边彝族自治县"], ["511181", "峨眉山市"],
["511300", "南充市"], ["511301", "南充市市辖区"], ["511302", "南充市顺庆区"], ["511303", "南充市高坪区"], ["511304", "南充市嘉陵区"],
["511321", "南部县"], ["511322", "营山县"], ["511323", "蓬安县"], ["511324", "仪陇县"], ["511325", "西充县"], ["511381", "阆中市"],
["511400", "眉山市"], ["511401", "眉山市市辖区"], ["511402", "眉山市东坡区"], ["511421", "仁寿县"], ["511422", "彭山县"],
["511423", "洪雅县"], ["511424", "丹棱县"], ["511425", "青神县"], ["511500", "宜宾市"], ["511501", "宜宾市市辖区"],
["511502", "宜宾市翠屏区"], ["511521", "宜宾县"], ["511522", "南溪县"], ["511523", "江安县"], ["511524", "长宁县"], ["511525", "高县"],
["511526", "珙县"], ["511527", "筠连县"], ["511528", "兴文县"], ["511529", "屏山县"], ["511600", "广安市"], ["511601", "广安市市辖区"],
["511602", "广安市广安区"], ["511621", "岳池县"], ["511622", "武胜县"], ["511623", "邻水县"], ["511681", "华蓥市"], ["511700", "达州市"],
["511701", "达州市市辖区"], ["511702", "达州市通川区"], ["511721", "达州市达川区"], ["511722", "宣汉县"], ["511723", "开江县"], ["511724", "大竹县"],
["511725", "渠县"], ["511781", "万源市"], ["511800", "雅安市"], ["511801", "雅安市市辖区"], ["511802", "雅安市雨城区"], ["511821", "名山县"],
["511822", "荥经县"], ["511823", "汉源县"], ["511824", "石棉县"], ["511825", "天全县"], ["511826", "芦山县"], ["511827", "宝兴县"],
["511900", "巴中市"], ["511901", "巴中市市辖区"], ["511902", "巴中市巴州区"], ["511903", "巴中市恩阳区"], ["511921", "通江县"], ["511922", "南江县"],
["511923", "平昌县"], ["512000", "资阳市"], ["512001", "资阳市市辖区"], ["512002", "资阳市雁江区"], ["512021", "安岳县"],
["512022", "乐至县"], ["512081", "简阳市"], ["513200", "阿坝藏族羌族自治州"], ["513221", "汶川县"], ["513222", "理县"], ["513223", "茂县"],
["513224", "松潘县"], ["513225", "九寨沟县"], ["513226", "金川县"], ["513227", "小金县"], ["513228", "黑水县"], ["513229", "马尔康县"],
["513230", "壤塘县"], ["513231", "阿坝县"], ["513232", "若尔盖县"], ["513233", "红原县"], ["513300", "甘孜藏族自治州"], ["513321", "康定县"],
["513322", "泸定县"], ["513323", "丹巴县"], ["513324", "九龙县"], ["513325", "雅江县"], ["513326", "道孚县"], ["513327", "炉霍县"],
["513328", "甘孜县"], ["513329", "新龙县"], ["513330", "德格县"], ["513331", "白玉县"], ["513332", "石渠县"], ["513333", "色达县"],
["513334", "理塘县"], ["513335", "巴塘县"], ["513336", "乡城县"], ["513337", "稻城县"], ["513338", "得荣县"], ["513400", "凉山彝族自治州"],
["513401", "西昌市"], ["513422", "木里藏族自治县"], ["513423", "盐源县"], ["513424", "德昌县"], ["513425", "会理县"], ["513426", "会东县"],
["513427", "宁南县"], ["513428", "普格县"], ["513429", "布拖县"], ["513430", "金阳县"], ["513431", "昭觉县"], ["513432", "喜德县"],
["513433", "冕宁县"], ["513434", "越西县"], ["513435", "甘洛县"], ["513436", "美姑县"], ["513437", "雷波县"]
];

window.EnvironmentType = [
    ["F", "涉气：火点，正在焚烧"],
    ["B", "涉气：黑斑，焚烧痕迹"],
    ["C", "涉气：燃煤、排烟问题"],
    ["R", "涉气：施工、扬尘问题"],
    ["S", "涉土问题"],
    ["W", "涉水问题"],
    ["O", "其它问题"]
];

window.EPClassify = [
    {
        mingcheng: "涉气问题",
        details: [
             {//1
                 name: 'B-1黑斑焚烧痕迹',
                 hpsj: '2016-06-11',
                 hps: '成都市',
                 hpx: '成华区',
                 hpz: '龙潭街道',
                 hpxxdd: '四川省成都市成华区龙潭街道',
                 hpwt: 'B',
                 jd: 104.2087633,
                 wd: 30.7103505,
                 num: 'B-1',
                 imgArr: "1.jpg#2.jpg#3.jpg"
             },
    {//2
        name: 'B-2黑斑，焚烧痕迹',
        hpsj: '2016-06-11',
        hps: '成都市',
        hpx: '新都区',
        hpz: '石板滩镇',
        hpxxdd: '四川省成都市新都区石板滩镇友谊村',
        hpwt: 'B',
        jd: 104.2538796,
        wd: 30.6896109,
        num: 'B-2',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    },
    {//3
        name: 'B-3黑斑，焚烧痕迹',
        hpsj: '2016-06-11',
        hps: '成都市',
        hpx: '新都区',
        hpz: '石板滩镇',
        hpxxdd: '四川省成都市新都区石板滩镇友谊村',
        hpwt: 'B',
        jd: 104.2500736,
        wd: 30.6920446,
        num: 'B-3',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//4
        name: 'B-4黑斑，焚烧痕迹',
        hpsj: '2016-06-12',
        hps: '成都市',
        hpx: '新都区',
        hpz: '石板滩镇',
        hpxxdd: '四川省成都市新都区石板滩镇友谊村',
        hpwt: 'B',
        jd: 104.2485982,
        wd: 30.6863952,
        num: 'B-4',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    },
    {//5
        name: 'B-5黑斑，焚烧痕迹',
        hpsj: '2016-06-12',
        hps: '成都市',
        hpx: '新都区',
        hpz: '石板滩镇',
        hpxxdd: '四川省成都市新都区石板滩镇友谊村',
        hpwt: 'B',
        jd: 104.2491118,
        wd: 30.6839661,
        num: 'B-5',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//6
        name: 'B-6黑斑，焚烧痕迹',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '新都区',
        hpz: '石板滩镇',
        hpxxdd: '四川省成都市新都区石板滩镇友谊村',
        hpwt: 'B',
        jd: 104.2454027,
        wd: 30.6893584,
        num: 'B-6',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//7
        name: 'B-7黑斑，焚烧痕迹',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '新都区',
        hpz: '石板滩镇',
        hpxxdd: '四川省成都市新都区石板滩镇友谊村',
        hpwt: 'B',
        jd: 104.2430798,
        wd: 30.6877166,
        num: 'B-7',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//8
        name: 'B-8黑斑，焚烧痕迹',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道光明社区',
        hpwt: 'B',
        jd: 104.224554,
        wd: 30.7008578,
        num: 'B-8',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//9
        name: 'F-1火点正在焚烧',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '新都区',
        hpz: '石板滩镇',
        hpxxdd: '四川省成都市新都区石板滩镇友谊村',
        hpwt: 'F',
        jd: 104.2372405,
        wd: 30.6905014,
        num: 'F-1',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//10
        name: 'F-2火点正在焚烧',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '新都区',
        hpz: '石板滩镇',
        hpxxdd: '四川省成都市新都区石板滩镇解放村',
        hpwt: 'F',
        jd: 104.2347567,
        wd: 30.6900569,
        num: 'F-2',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//11
        name: 'R-1施工、扬尘问题露天沙场',
        hpsj: '2016-06-12',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道平丰社区',
        hpwt: 'R',
        jd: 104.2161834,
        wd: 30.6787145,
        num: 'R-1',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//14
        name: 'R-2施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道院东社区',
        hpwt: 'R',
        jd: 104.2054601,
        wd: 30.7104945,
        num: 'R-1',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//15
        name: 'R-3施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '新都区',
        hpz: '新都镇',
        hpxxdd: '四川省成都市成华区龙潭街道平丰社区 ',
        hpwt: 'R',
        jd: 104.2082002,
        wd: 30.697371,
        num: 'R-3',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//16
        name: 'R-4施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道院东社区',
        hpwt: 'R',
        jd: 104.2047963,
        wd: 30.698148,
        num: 'R-4',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//17
        name: 'R-5施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '新都区',
        hpz: '新都镇',
        hpxxdd: '四川省成都市新都区新都镇桂林村',
        hpwt: 'R',
        jd: 104.1782397,
        wd: 30.7125982,
        num: 'R-5',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//19
        name: 'R-6施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道',
        hpwt: 'R',
        jd: 104.1622987,
        wd: 30.7019189,
        num: 'R-6',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//20
        name: 'R-7施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道',
        hpwt: 'R',
        jd: 104.142592,
        wd: 30.7106347,
        num: 'R-7',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//21
        name: 'R-8施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道',
        hpwt: 'R',
        jd: 104.1856046,
        wd: 30.7208532,
        num: 'R-8',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//22
        name: 'R-9施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '新都区',
        hpz: '石板滩镇',
        hpxxdd: '四川省成都市新都区石板滩镇解放村',
        hpwt: 'R',
        jd: 104.2355367,
        wd: 30.6985611,
        num: 'R-9',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//23
        name: 'R-10施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道',
        hpwt: 'R',
        jd: 104.2355367,
        wd: 30.6929065,
        num: 'R-10',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//24
        name: 'R-11施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道',
        hpwt: 'R',
        jd: 104.2213349,
        wd: 30.6913096,
        num: 'R-11',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }
        ]
    }, {
        mingcheng: "涉土问题",
        details: [
            {//12
                name: 'S-1涉土露天垃圾场',
                hpsj: '2016-06-11',
                hps: '成都市',
                hpx: '成华区',
                hpz: '龙潭街道',
                hpxxdd: '四川省成都市成华区龙潭街道光明社区',
                hpwt: 'S',
                jd: 104.2113153,
                wd: 30.6984246,
                num: 'S-1',
                imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
            }, {//13
                name: 'S-2涉土露天垃圾场',
                hpsj: '2016-06-13',
                hps: '成都市',
                hpx: '成华区',
                hpz: '龙潭街道',
                hpxxdd: '四川省成都市成华区龙潭街道建设社区',
                hpwt: 'S',
                jd: 104.2102412,
                wd: 30.7033966,
                num: 'S-2',
                imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
            }, {//18
                name: 'S-3涉土露天垃圾场',
                hpsj: '2016-06-12',
                hps: '成都市',
                hpx: '成华区',
                hpz: '龙潭街道',
                hpxxdd: '四川省成都市成华区龙潭街道同乐社区',
                hpwt: 'S',
                jd: 104.1690488,
                wd: 30.7114235,
                num: 'S-3',
                imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
            }
        ]
    }, {
        mingcheng: "涉水问题",
        details: [

        ]
    }, {
        mingcheng: "其它问题",
        details: [

        ]
    }
];

window.EProblemEX = [
    {//1
        name: 'B-1黑斑焚烧痕迹',
        hpsj: '2016-06-11',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道',
        hpwt: 'B',
        jd: 104.2087633,
        wd: 30.7103505,
        num: 'B-1',
        imgArr: "1.jpg#2.jpg#3.jpg"
    },
    {//2
        name: 'B-2黑斑，焚烧痕迹',
        hpsj: '2016-06-11',
        hps: '成都市',
        hpx: '新都区',
        hpz: '石板滩镇',
        hpxxdd: '四川省成都市新都区石板滩镇友谊村',
        hpwt: 'B',
        jd: 104.2538796,
        wd: 30.6896109,
        num: 'B-2',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    },
    {//3
        name: 'B-3黑斑，焚烧痕迹',
        hpsj: '2016-06-11',
        hps: '成都市',
        hpx: '新都区',
        hpz: '石板滩镇',
        hpxxdd: '四川省成都市新都区石板滩镇友谊村',
        hpwt: 'B',
        jd: 104.2500736,
        wd: 30.6920446,
        num: 'B-3',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//4
        name: 'B-4黑斑，焚烧痕迹',
        hpsj: '2016-06-12',
        hps: '成都市',
        hpx: '新都区',
        hpz: '石板滩镇',
        hpxxdd: '四川省成都市新都区石板滩镇友谊村',
        hpwt: 'B',
        jd: 104.2485982,
        wd: 30.6863952,
        num: 'B-4',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    },
    {//5
        name: 'B-5黑斑，焚烧痕迹',
        hpsj: '2016-06-12',
        hps: '成都市',
        hpx: '新都区',
        hpz: '石板滩镇',
        hpxxdd: '四川省成都市新都区石板滩镇友谊村',
        hpwt: 'B',
        jd: 104.2491118,
        wd: 30.6839661,
        num: 'B-5',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//6
        name: 'B-6黑斑，焚烧痕迹',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '新都区',
        hpz: '石板滩镇',
        hpxxdd: '四川省成都市新都区石板滩镇友谊村',
        hpwt: 'B',
        jd: 104.2454027,
        wd: 30.6893584,
        num: 'B-6',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//7
        name: 'B-7黑斑，焚烧痕迹',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '新都区',
        hpz: '石板滩镇',
        hpxxdd: '四川省成都市新都区石板滩镇友谊村',
        hpwt: 'B',
        jd: 104.2430798,
        wd: 30.6877166,
        num: 'B-7',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//8
        name: 'B-8黑斑，焚烧痕迹',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道光明社区',
        hpwt: 'B',
        jd: 104.224554,
        wd: 30.7008578,
        num: 'B-8',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//9
        name: 'F-1火点正在焚烧',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '新都区',
        hpz: '石板滩镇',
        hpxxdd: '四川省成都市新都区石板滩镇友谊村',
        hpwt: 'F',
        jd: 104.2372405,
        wd: 30.6905014,
        num: 'F-1',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//10
        name: 'F-2火点正在焚烧',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '新都区',
        hpz: '石板滩镇',
        hpxxdd: '四川省成都市新都区石板滩镇解放村',
        hpwt: 'F',
        jd: 104.2347567,
        wd: 30.6900569,
        num: 'F-2',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//11
        name: 'R-1施工、扬尘问题露天沙场',
        hpsj: '2016-06-12',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道平丰社区',
        hpwt: 'R',
        jd: 104.2161834,
        wd: 30.6787145,
        num: 'R-1',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//12
        name: 'S-1涉土露天垃圾场',
        hpsj: '2016-06-11',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道光明社区',
        hpwt: 'S',
        jd: 104.2113153,
        wd: 30.6984246,
        num: 'S-1',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//13
        name: 'S-2涉土露天垃圾场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道建设社区',
        hpwt: 'S',
        jd: 104.2102412,
        wd: 30.7033966,
        num: 'S-2',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//14
        name: 'R-2施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道院东社区',
        hpwt: 'R',
        jd: 104.2054601,
        wd: 30.7104945,
        num: 'R-1',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//15
        name: 'R-3施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '新都区',
        hpz: '新都镇',
        hpxxdd: '四川省成都市成华区龙潭街道平丰社区 ',
        hpwt: 'R',
        jd: 104.2082002,
        wd: 30.697371,
        num: 'R-3',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//16
        name: 'R-4施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道院东社区',
        hpwt: 'R',
        jd: 104.2047963,
        wd: 30.698148,
        num: 'R-4',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//17
        name: 'R-5施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '新都区',
        hpz: '新都镇',
        hpxxdd: '四川省成都市新都区新都镇桂林村',
        hpwt: 'R',
        jd: 104.1782397,
        wd: 30.7125982,
        num: 'R-5',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//18
        name: 'S-3涉土露天垃圾场',
        hpsj: '2016-06-12',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道同乐社区',
        hpwt: 'S',
        jd: 104.1690488,
        wd: 30.7114235,
        num: 'S-3',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//19
        name: 'R-6施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道',
        hpwt: 'R',
        jd: 104.1622987,
        wd: 30.7019189,
        num: 'R-6',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//20
        name: 'R-7施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道',
        hpwt: 'R',
        jd: 104.142592,
        wd: 30.7106347,
        num: 'R-7',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//21
        name: 'R-8施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道',
        hpwt: 'R',
        jd: 104.1856046,
        wd: 30.7208532,
        num: 'R-8',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//22
        name: 'R-9施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '新都区',
        hpz: '石板滩镇',
        hpxxdd: '四川省成都市新都区石板滩镇解放村',
        hpwt: 'R',
        jd: 104.2355367,
        wd: 30.6985611,
        num: 'R-9',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//23
        name: 'R-10施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道',
        hpwt: 'R',
        jd: 104.2355367,
        wd: 30.6929065,
        num: 'R-10',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }, {//24
        name: 'R-11施工、扬尘问题露天沙场',
        hpsj: '2016-06-13',
        hps: '成都市',
        hpx: '成华区',
        hpz: '龙潭街道',
        hpxxdd: '四川省成都市成华区龙潭街道',
        hpwt: 'R',
        jd: 104.2213349,
        wd: 30.6913096,
        num: 'R-11',
        imgArr: "DSC00073-1.jpg#DSC00073-2.jpg#DSC00073-3.jpg"
    }

];

//510100	成都市	104.06328	30.58212
//510101	成都市市辖区	104.06542	30.62198
//510104	成都市锦江区	104.07	30.66
//510105	成都市青羊区	104.06	30.68
//510106	成都市金牛区	104.05	30.69
//510107	成都市武侯区	104.04	30.65
//510108	成都市成华区	104.10122	30.66
//510112	成都市龙泉驿区	104.26	30.56
//510113	成都市青白江区	104.24	30.89
//510114	成都市新都区	104.16	30.83
//510115	成都市温江区	103.85	30.68
//510121	金堂县	104.42	30.86
//510122	双流县	103.92	30.57
//510124	郫县	103.89	30.79
//510129	大邑县	103.51	30.58
//510131	蒲江县	103.51	30.19
//510132	新津县	103.79	30.41
//510181	都江堰市	103.63	30.99
//510182	彭州市	103.96	30.99
//510183	邛崃市	103.46	30.41
//510184	崇州市	103.67	30.63