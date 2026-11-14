
function locationOut()
{
    window.location = "/index.html";
}

function jumpToLoginPage(ip)
{
    if (ip){
        window.location = "http://"+ip+"/index.html";
    }else{
        locationOut();
    }
}


function loadJsCss(filename, filetype){
    if (filetype=="js"){
         var fileref=document.createElement('script')    //创建标签
         fileref.setAttribute("type","text/javascript")  //定义属性type的值为text/javascript
         fileref.setAttribute("src", filename)           //文件的地址
    }else if (filetype=="css"){ 
         var fileref=document.createElement("link")
         fileref.setAttribute("rel", "stylesheet")
         fileref.setAttribute("type", "text/css") 
         fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined"){
      document.getElementsByTagName("head")[0].appendChild(fileref)
    }
}

function trafficFormat(byte)
{
    var b = Number(byte);
    
    if (b > 1024 && b < Math.pow(1024,2)){
        var retdata = (b/1024).toFixed(2) + " KB";
    }else if (b >= Math.pow(1024,2) && b < Math.pow(1024,3)) {
        var retdata = (b/Math.pow(1024,2)).toFixed(2) + " MB";
    }else if (b >= Math.pow(1024,3) && b < Math.pow(1024,4)) {
        var retdata = (b/Math.pow(1024,3)).toFixed(2) + " GB";
    }else if (b >= Math.pow(1024,4) && b < Math.pow(1024,5)) {
        var retdata = (b/Math.pow(1024,4)).toFixed(2) + " TB";
    }else if (b >= Math.pow(1024,5)) {
        var retdata = (b/Math.pow(1024,5)).toFixed(2) + " PB";
    }else {
        var retdata = b + " B";
    }
    return retdata;
}

function speedFormat(bit)
{
    var b = Number(bit);
    
    if (b > 1024 && b < 1048576){
        var retdata = (bit/1024).toFixed(2) + " Kb/s";
    }else if (b >= 1048576 && b < 1073741824) {
        var retdata = (b/1048576).toFixed(2) + " Mb/s";
    }else if (b >= 1073741824) {
        var retdata = (b/1073741824).toFixed(2) + " Gb/s";
    }else {
        var retdata = b + " b/s";
    }

    return retdata;
}

function secondsFormat(msd) 
{
    var time = Number(msd);
    var time_str = "";
    if (null != time && "" != time) {
        if (time > 60 && time < 3600) {
            time_str = parseInt(time / 60) + '\xa0' + g_this.$t("minute") + '\xa0' +
                       parseInt(time % 60) + '\xa0' + g_this.$t("second");
        }
        else if (time >= 3600 && time < 86400) {
            time_str = parseInt(time / 3600) + '\xa0' + g_this.$t("hour") +  '\xa0' +
                       parseInt(parseInt(time % 3600) / 60) + '\xa0' + g_this.$t("minute") + '\xa0' +
                       parseInt(time % 60) + '\xa0' + g_this.$t("second");
        } 
        else if (time >= 86400) {
            time_str = parseInt(time / 86400) + g_this.$t("day") + '\xa0' +
                       parseInt(parseInt(time % 86400) / 3600) + '\xa0' + g_this.$t("hour") + '\xa0' +
                       parseInt(parseInt(time % 3600) / 60) + '\xa0' + g_this.$t("minute") + '\xa0' +
                       parseInt(time % 60) + '\xa0' + g_this.$t("second");
        }
        else {
            time_str = parseInt(time) + '\xa0' + g_this.$t("second");
        }
    }
    return time_str;
}

function isJson(obj)
{
    var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
    return isjson;
}

function powerCalculation(m){
    var n = Number(m);
    if (n == 0){
        return -40;
    }else{
        var k = 10 * Math.log10(n/10000);
        if ((k + "").indexOf(".") != -1 && (k + "").split(".")[1].length > 6){
            return k.toFixed(6);
        }else{
            return k;
        }
    }
}

function initAllWanData(wanData){
    var all_wan_info = [];
    for (var i=0; i<wanData.data.length; i++){
        var ipData = wanData.data[i].ipoe;
        var pppData = wanData.data[i].pppoe;
        var wan_index = wanData.data[i].child_node_idx;
        for (var n=0; n<ipData.length; n++){
            var thisData = ipData[n];
            thisData.iporppp = "1";
            thisData.wan_index = wan_index;
            var serverList = thisData.ServiceList;
            thisData.ServiceList = sortServerList(serverList);
            all_wan_info.push(thisData);
        }

        for (var m=0; m<pppData.length; m++){
            var thisData = pppData[m];
            thisData.iporppp = "2";
            thisData.wan_index = wan_index;
            var serverList = thisData.ServiceList;
            thisData.ServiceList = sortServerList(serverList);
            all_wan_info.push(thisData);
        }
    }
    return all_wan_info;
    
}

function initAllVPNData(vpnData){
    var all_vpn_info = [];
    for (var i=0; i<vpnData.data.length; i++){
        var l2tpData = vpnData.data[i].l2tp;
        var pptpData = vpnData.data[i].pptp;
        var vpn_index = vpnData.data[i].child_node_idx;
        for (var n=0; n<l2tpData.length; n++){
            var thisData = l2tpData[n];
            thisData.l2tporpptp = "1";
            thisData.vpn_index = vpn_index;
            all_vpn_info.push(thisData);
        }

        for (var m=0; m<pptpData.length; m++){
            var thisData = pptpData[m];
            thisData.l2tporpptp = "2";
            thisData.vpn_index = vpn_index;
            all_vpn_info.push(thisData);
        }
    }
    return all_vpn_info;
}

function initAllWanNameData(wanData){
    var all_wan_info = [];
    for (var i=0; i<wanData.data.length; i++){
        var ipData = wanData.data[i].ipoe;
        var pppData = wanData.data[i].pppoe;
        var wan_index = wanData.data[i].child_node_idx;
        for (var n=0; n<ipData.length; n++){
            var thisData = ipData[n];
            thisData.iporppp = "1";
            thisData.wan_index = wan_index;
            if (thisData.Enable == "1"){
                all_wan_info.push(thisData);
            }
        }

        for (var m=0; m<pppData.length; m++){
            var thisData = pppData[m];
            thisData.iporppp = "2";
            thisData.wan_index = wan_index;
            if (thisData.Enable == "1"){
                all_wan_info.push(thisData);
            }
        }
    }

    return all_wan_info;
}

function sortServerList(serverList){
    if (serverList.indexOf(",") == -1){
        return serverList;
    }else{
        var serArr = ['TR069', 'VOIP', 'INTERNET'];
        var arr = serverList.split(",");
        var returnStr = "";
        for (var i=0; i<serArr.length; i++){
            for (var j=0; j<arr.length; j++){
                if (arr[j] == serArr[i]){
                    returnStr += serArr[i] + ","
                }
            }
        }
        returnStr = returnStr.substr(0, returnStr.length - 1);

        return returnStr;
    }
}

function getLanPort(){
    var lanPort = [];
    for (var i=1; i<=g_device_data.lan_port_num; i++){
        if (g_wanInterface.split(".")[2] == i){
            continue;
        }
        lanPort.push({
            name: "LAN" + i,
            value: "dev.eth."  + i,
            enable: true
        })
    }
    return lanPort;
}


/**Loading**/
function openLoading(val) {
    var tip= val || 'Loading......'
    loading = g_this.$loading({
        lock: true,
        text: tip,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)',
    });
}
function closeLoading()
{
    setTimeout(function(){
        loading.close();
    }, 200)
}
/**Loading**/
function fh_alert(message){
    g_this.$alert(message, g_this.$t("warning"), {
        dangerouslyUseHTMLString: true,
        type: 'error',
        confirmButtonText: g_this.$t("sure"),
    }).then(function() {
    }).catch(function() {
    });
}

function fh_confirm(message){
    return new Promise(function(resolve, reject){
        g_this.$confirm(message, g_this.$t("tip"), {
            dangerouslyUseHTMLString: true,
            closeOnClickModal: false,
            confirmButtonText: g_this.$t("sure"),
            cancelButtonText: g_this.$t("cancel"),
            type: 'warning',
        }).then(function() {
            resolve(true)
        }).catch(function() {
            reject(false)
        })
    })
}

function fh_poptips(message, title){
    var tips = g_this.$t("tip");
    if (title)
        tips = title;
    g_this.$confirm(message, tips, {
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        showCancelButton: false,
        showConfirmButton: false,
        type: 'warning',
    }).then(function() {
    }).catch(function() {
    })
}
function fh_poptips_disclose(message, title){
    var tips = g_this.$t("tip");
    if (title)
        tips = title;
    g_this.$confirm(message, tips, {
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        showCancelButton: false,
        showConfirmButton: false,
        showClose:false,
        type: 'warning',
    }).then(function() {
    }).catch(function() {
    })
}

function addClassListMethod()
{
    var isClsList = 'classList' in HTMLElement.prototype;
    if (!isClsList) {
        Object.defineProperty(HTMLElement.prototype,'classList',{
            get:function(){
                var _self = this;
                return {
                    add:function(cls){
                        if (!this.contains(cls)){
                            _self.className +=' ' + cls;
                        }
                    },
                    remove:function(cls){
                        if (this.contains(cls)){ 
                            var reg= new RegExp(cls);   
                            _self.className =  _self.className.replace(reg,'');
                        }
                    },
                    contains:function(cls){      
                      var index =  _self.className.indexOf(cls);
                        return  index!=-1 ? true : false;
                    },
                    toggle:function(cls){
                        if (this.contains(cls)){ 
                            this.remove(cls)
                        } else {
                            this.add(cls)
                        }
                    }
                }
            }
        })
    }
}


function isSecurityInputValue(data) { //校验是否为非安全字符
    var secueArraya = ["%0D%0A", "%3C", "%3E"];
    var secueArrayb = [" AND ", " OR ", " PING ", "SELECT ", "<", ">", "+AND+", "+OR+", "++", "--", "`", "JAVASCRIPT", "SET-COOKIE"];
    var i;
    var code = "",
    data = encodeURIComponent(data);
    for (i = 0; i < secueArraya.length; i++) {
        if (data.indexOf(secueArraya[i]) > -1) {
            code = decodeURIComponent(secueArraya[i]);
            code += ", "
        }
    }
    data = decodeURIComponent(data).toUpperCase();
    for (i = 0; i < secueArrayb.length; i++) {
        if (data.indexOf(secueArrayb[i]) > -1 && code.indexOf(secueArrayb[i]) == "-1") {
            code += secueArrayb[i];
            code += ", "
        }
    }
    if (code != ""){
        return code.slice(0,-2);
    }else{
        return "secure";
    }
}

function checkWifiPwdStrength(value)
{
    var mode = 0;
    if (/\d/.test(value)) mode++; //数字
    if (/[a-z]/.test(value)) mode++; //小写
    if (/[A-Z]/.test(value)) mode++; //大写
    if (/\W|_/.test(value)) mode++; //特殊字符

    return mode;
}
function isNonnegative(value)
{
    var check= /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
    if(!check.test(value))
    {
        return false;
    }
    else 
    {
        return true;
    }
}

function judgeIpSameNet(ip1, ip2)
{
    if (!isIPv4Address(ip1) || !isIPv4Address(ip2)){
        return false;
    }
    var ip1Arr = ip1.split(".");
    var ip1Str = ip1Arr[0] + "." + ip1Arr[1] + "." + ip1Arr[2];

    var ip2Arr = ip2.split(".");
    var ip2Str = ip2Arr[0] + "." + ip2Arr[1] + "." + ip2Arr[2];

    if (ip1Str != ip2Str){
        return false;
    }

    return true;
}
function handelCarrier(status,serial,imsi){
    var carrierNumLocked = 0;
    if(status == 1)
    {
        carrierNumLocked = 1;
        var serial_nums = [];
        serial_nums = serial.split(",");
        for(var i=0; i<serial_nums.length; i++)
        {
            if(serial_nums[i].length == 0)
            {
                continue;
            }
            if(serial_nums[i].length <= imsi.length && serial_nums[i] == imsi.substr(0,serial_nums[i].length))
            {
                carrierNumLocked = 0;
                break;
            }
        }
    }
    else
    {
        carrierNumLocked = 0;
    }
    return carrierNumLocked;
}
function getTopoData(data, hostData) {
    var that = this;
    var topoData = [];
    var g_key = 0;
    var g_parent_key = [];
    var g_parentMac = [];
    var i = 0;

    function addDataToDevData(MACAddress) {
        var devData = {};
        devData.MACAddress = MACAddress;
        if (MACAddress.toUpperCase() == g_device_data.br0mac.toUpperCase()) {
            devData.IPAddress = g_device_data.IPInterfaceIPAddress;
            if (g_device_data.model_name == 'LG6121D'){
                devData.HostName  = g_this.$t('deviceInfo.outdoor.name')
            } else if (g_device_data.model_name == 'LG6121H'){
                devData.HostName = g_this.$t("deviceInfo.air.name");
            } else {
                devData.HostName = "5G CPE";
            } 
        } else {
            for (var h = 0; h < hostData.length; h++) {
                if (MACAddress.toUpperCase() == hostData[h].MACAddress.toUpperCase()) {
                    devData.IPAddress = hostData[h].IPAddress;
                    var reg = /^(null|unknown)$/i;
                    if (hostData[h].DevName != "" && !reg.test(hostData[h].DevName)) {
                        devData.HostName = hostData[h].DevName;
                    }else {
                        devData.HostName = hostData[h].HostName == "" ? "Unknown" : hostData[h].HostName;
                    }
                    devData.DeviceType = hostData[h].DeviceType;
                    devData.OnlineTime = hostData[h].OnlineTime;
                    devData.index = hostData[h].child_node_idx;
                    break;
                }
            }
        }
        return devData;
    }

    function getSingleDevData() {
        var devData = addDataToDevData(deviceData.MACAddress); //从HOST节点中取需要的值
        devData.key = g_key;

        //主网关的BackhaulLinkType有时候不为None,故删除相关判段条件
        if (devData.MACAddress.toUpperCase() == g_device_data.br0mac.toUpperCase()) {
            devData.accessType = "controller";
            devData.DeviceType = "controller"
        } else {
            devData.accessType = deviceData.BackhaulLinkType;
            devData.DeviceType = "agent"
        }
        // if (g_parent_key.length > 0) {
        //     devData.parent = g_parent_key[g_parent_key.length - 1];
        // }
        for (var j = 0; j < g_parentMac.length; j++) { //查找父节点
            if (deviceData.ParentMACAddress == g_parentMac[j])
                devData.parent = g_parent_key[j]
        }
       
        topoData.push(devData);
        g_parentMac.push(deviceData.MACAddress);
        g_parent_key.push(g_key);
        g_key++;
    
        var radioArr = [];
        radioArr.push(deviceData.AP_1,deviceData.AP_2,deviceData.AP_3);
        for (var j = 0; j < radioArr.length; j++) {
            var radioData = radioArr[j];
            for (var n = 0; n < radioData.length; n++) {
                var apData = radioData[n];
                for (var m = 0; m < apData.AssociatedDevice.length; m++) {
                    var assDeviceData = apData.AssociatedDevice[m];
                    if (assDeviceData.Active != "1") {
                        continue;
                    }
                    var devData = addDataToDevData(assDeviceData.MACAddress);
                    devData.key = g_key;
                    devData.parent = g_parent_key[g_parent_key.length - 1];
                    
                    devData.accessType = deviceData.Radio[j].OperatingFrequencyBand;
                    topoData.push(devData);
                    g_key++;
                }
            }
        }
        data.splice(i, 1);
        i = 0;
    }

    while (i < data.length) { //MULTIAP DATA
        var deviceData = data[i];
        if (deviceData.Active != "1") {
            data.splice(i, 1);
            continue;
        }
        var flag = false;
        for (var j = 0; j < g_parentMac.length; j++) { //g_parentMac
            if (deviceData.ParentMACAddress == g_parentMac[j])
                flag = true;
        }
        if ((g_parentMac.length == 0 && deviceData.ParentMACAddress == "") 
            || flag) {
            
            getSingleDevData();
            continue;
        }
        i++;
        if (i >= data.length && data.length > 0) {
            g_parent_key.pop();
            g_parentMac.pop();
            i = 0;
        }
    }

    /**删除虚拟主路由及虚拟设备**/
    var returnData = [];
    for (var t = 0; t < topoData.length; t++) {
        if (topoData[t].key == 0) {
            continue;
        }
        // if (!topoData[t].IPAddress) {
        //     continue;
        // }
        if (topoData[t].parent == 0) {
            topoData[t].accessType = "controller";
        }
        returnData.push(topoData[t]);
    }
    return returnData;
}
function fh_tip(message,showCancelButton,showClose,confirmButtonText,cancelText){
    return new Promise(function(resolve, reject){
        g_this.$confirm(message, g_this.$t("tip"), {
            dangerouslyUseHTMLString: true,
            closeOnClickModal: false,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelText ? cancelText : g_this.$t("cancel"),
            type: 'warning',
            showCancelButton:showCancelButton,
            showClose:showClose,
        }).then(function() {
            resolve(true)
        }).catch(function() {
            reject(false)
        })
    })
}

function initMultiWanData(wanData) {
    
    var all_wan_info = [];
    for (var i = 0; i < wanData.data.length; i++) {
        var wanDeviceData = {};
        var wanConnData = wanData.data[i].wanconnection;
        wanDeviceData.wanConnData = [];
        wanDeviceData.wan_device_idx = wanData.data[i].child_node_idx;
        for (var j = 0; j < wanConnData.length; j++) {
            var ipData = wanConnData[j].ipoe;
            var pppData = wanConnData[j].pppoe;
            var wan_index = wanConnData[j].child_node_idx;
            for (var n = 0; n < ipData.length; n++) {
                var thisData = ipData[n];
                thisData.iporppp = "1";
                thisData.wan_index = wan_index;
                var serverList = thisData.ServiceList;
                thisData.ServiceList = sortServerList(serverList);
                wanDeviceData.wanConnData.push(thisData);
            }

            for (var m = 0; m < pppData.length; m++) {
                var thisData = pppData[m];
                thisData.iporppp = "2";
                thisData.wan_index = wan_index;
                var serverList = thisData.ServiceList;
                thisData.ServiceList = sortServerList(serverList);
                wanDeviceData.wanConnData.push(thisData);
            }
        }
      
        all_wan_info.push(wanDeviceData);
    }
    return all_wan_info;
}

function changeCarrierName(carrierName){
    var carrierMap = {
        CMCC: 'carrierName.CMCC',
        CT: 'carrierName.CT',
        UNICOM: 'carrierName.UNICOM',
        CB: 'carrierName.CB',
        CBN: 'carrierName.CBN'    
    };
    var mappedKey = carrierMap[carrierName];
    return mappedKey ? g_this.$t(mappedKey) : carrierName;
}