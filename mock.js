let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017";

//生成随机手机号
function getRandPhone() {
    let heads = ["134", "138", "139", "150", "151", "152", "157", "158", "159", "170", "189"];
    let phone = heads[Math.floor(Math.random() * heads.length)];
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 8; i++) {
        phone += numbers[Math.floor(Math.random() * numbers.length)];
    }
    return phone;
}

//生成车牌号
function getRandPlate() {
    //地区，用于生成车牌号
    let loc = ["川", "渝", "贵", "陕", "京", "沪", "粤", "津", "赣", "湘", "鄂"];
    //字母，用于生成车牌号
    let chars = ["A", "B", "C", "D"];
    //数字，用于生成车牌号
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let plate = "";
    plate += loc[Math.floor(Math.random() * loc.length)]; //第一位地区简称
    plate += chars[Math.floor(Math.random() * chars.length)]; //第二位字母简称
    //4位数字
    for (let i = 0; i < 4; i++) {
        plate += numbers[Math.floor(Math.random() * numbers.length)];
    }
    return plate;
}

//生成名字
function getRandName() {
    let familyNames = ["赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈",
        "褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许",
        "何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏",
        "陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章",
        "云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦",
        "昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳",
        "酆", "鲍", "史", "唐", "费", "廉", "岑", "薛", "雷", "贺",
        "倪", "汤", "滕", "殷", "罗", "毕", "郝", "邬", "安", "常",
        "乐", "于", "时", "傅", "皮", "卞", "齐", "康", "伍", "余",
        "元", "卜", "顾", "孟", "平", "黄", "和", "穆", "萧", "尹"
    ];
    let givenNames = ["子璇", "淼", "国栋", "夫子", "瑞堂", "甜", "敏", "尚", "国贤", "贺祥", "晨涛",
        "昊轩", "易轩", "益辰", "益帆", "益冉", "瑾春", "瑾昆", "春齐", "杨", "文昊",
        "东东", "雄霖", "浩晨", "熙涵", "溶溶", "冰枫", "欣欣", "宜豪", "欣慧", "建政",
        "美欣", "淑慧", "文轩", "文杰", "欣源", "忠林", "榕润", "欣汝", "慧嘉", "新建",
        "建林", "亦菲", "林", "冰洁", "佳欣", "涵涵", "禹辰", "淳美", "泽惠", "伟洋",
        "涵越", "润丽", "翔", "淑华", "晶莹", "凌晶", "苒溪", "雨涵", "嘉怡", "佳毅",
        "子辰", "佳琪", "紫轩", "瑞辰", "昕蕊", "萌", "明远", "欣宜", "泽远", "欣怡",
        "佳怡", "佳惠", "晨茜", "晨璐", "运昊", "汝鑫", "淑君", "晶滢", "润莎", "榕汕",
        "佳钰", "佳玉", "晓庆", "一鸣", "语晨", "添池", "添昊", "雨泽", "雅晗", "雅涵",
        "清妍", "诗悦", "嘉乐", "晨涵", "天赫", "玥傲", "佳昊", "天昊", "萌萌", "若萌",
        "泽民", "国强", "胜利", "小凡", "碧瑶", "书书", "京雨", "卫东", "小佳", "长江"
    ];
    let name = familyNames[Math.floor(Math.random() * familyNames.length)];
    name += givenNames[Math.floor(Math.random() * givenNames.length)];
    return name;
}

/**生成油耗
*@param base 油耗基准值
*/
function getFuelConsum(base) {
    let trueRange = [base - 2, base + 2]; //假定偏离基准不超过2
    let fuelConsum = Math.random() * (trueRange[1] - trueRange[0]);
    fuelConsum += trueRange[0];
    return Math.round(fuelConsum * 100) / 100; //转成2位小数
}

/**生成设备数据
* @param devNum 设备数量
* @param groupNum 每组设备的数量,同一组设备的档案相同
* @param dataNum 每个设备的数据数量
*/
function genDeviceData(devNum, groupNum, dataNum) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log("Database connected!");
        console.time('db_mock')
        let dbo = db.db("stream");
        for (let i = 0; i < devNum / groupNum; i++) {
            let devDocs = new Array();
            let phone = getRandPhone();
            let plate = getRandPlate();
            let driver = getRandName();
            for (let l = 1; l <= groupNum; l++) {
                //生成档案
                let deviceId = (l + i * groupNum).toString();
                devDocs[l - 1] = { "deviceId": deviceId, "phone": phone, "plate": plate, "driver": driver };
                //设置基准
                let range = [5, 15]; //油耗范围
                let base = range[0] + Math.round(Math.random() * (range[1] - range[0])); //油耗基准值
                let rangeM = [5000, 200000]; //行驶里程范围
                let baseM = rangeM[0] + Math.round(Math.random() * (rangeM[1] - rangeM[0])); //里程基准值
                let rangeT = [5, 100];//温度范围
                let rangeS = [0, 200];//速度范围
                let now = Date.parse(new Date());//1970.1.1至今的毫秒数
                //随机取一个时间作为基准
                let timeBase = Math.round(Math.random() * now);
                //生成数据，每次批量插入100条
                for (let j = 0; j < dataNum / 100; j++) {
                    let docs = new Array();
                    for (let k = 0; k < 100; k++) {
                        let fuelConsum = getFuelConsum(base);
                        let mileage = baseM + j * 100 + k; //每次递增1
                        let temperature = Math.random() * (rangeT[1] - rangeT[0]);
                        temperature = Math.round(temperature * 10) / 10; //转成1位小数
                        let speed = Math.random() * (rangeS[1] - rangeS[0]);
                        speed = Math.round(speed); //转成整数
                        let timestamp = timeBase + 60 * (100 * j + k);//每次递增60秒
                        docs[k] = { "deviceId": deviceId, "fuelConsum": fuelConsum, "mileage": mileage, "temperature": temperature, "speed": speed, "timestamp": timestamp };
                    }
                    dbo.collection("data").insertMany(docs)
                }
            }

            dbo.collection('archive').insertMany(devDocs);
        }
        console.timeEnd('db_mock')
        console.log('finished');
    })
}

//1000个设备，每组10个，每个设备1万条数据
genDeviceData(1000, 10, 10000);