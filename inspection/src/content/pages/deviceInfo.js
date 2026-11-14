define(["vue", "vue-i18n", "/lang/"+g_device_data.userLang+"/deviceInfo_res.js"], function(Vue, VueI18n, lang){
    var messages = {}
    messages[g_device_data.userLang] = lang;
    var i18n = new VueI18n({
        locale: g_device_data.userLang,
        messages: messages
    });
    var view = '\
    <div>\
    <div class="page_title">\
        <div class="head_line">{{$t("deviceInfo.CPE.title")}}</div>\
    </div>\
    <div class="page_content">\
            <el-form ref="elForm" :model="formData" size="large" :label-position="g_this.label_position" label-width="45%">\
            <el-form-item class="fh-item-text" :label="$t(\'deviceInfo.ProductName\')">\
                <span>{{formData.ProductName}}</span>\
            </el-form-item>\
            <el-form-item class="fh-item-text" :label="$t(\'deviceInfo.SerialNumber\')">\
                <span>{{formData.SerialNumber}}</span>\
            </el-form-item>\
            <el-form-item class="fh-item-text" :label="$t(\'deviceInfo.SoftwareVersion\')">\
                <span>{{formData.SoftwareVersion}}</span>\
            </el-form-item>\
            <el-form-item class="fh-item-text" :label="$t(\'deviceInfo.HardwareVersion\')">\
                <span>{{formData.HardwareVersion}}</span>\
            </el-form-item>\
            <el-form-item class="fh-item-text" :label="$t(\'deviceInfo.uptime\')">\
                <span>{{formData.uptime}}</span>\
            </el-form-item>\
            <el-form-item class="fh-item-text" :label="$t(\'deviceInfo.lan_ipv4.IPInterfaceIPAddress\')">\
                <span>{{formData.IPInterfaceIPAddress}}</span>\
            </el-form-item>\
            <el-form-item class="fh-item-text" :label="$t(\'deviceInfo.cpu.usage\')" v-if="g_device_data.user != \'1\'">\
                <span>{{formData.CPUUsage}}</span>\
            </el-form-item>\
            <el-form-item class="fh-item-text" :label="$t(\'deviceInfo.memory.usage\')" v-if="g_device_data.user != \'1\'">\
                <span>{{formData.MemoryUsage}}</span>\
            </el-form-item>\
            <el-form-item class="fh-item-text" :label="$t(\'deviceInfo.ModelName\')">\
                <span>{{formData.ModelName}}</span>\
            </el-form-item>\
            <el-form-item class="fh-item-text" :label="$t(\'deviceInfo.Modem5GTemperature\')" v-if="g_device_data.operator_name != \'OMN_OMANTEL\' && g_device_data.operator_name != \'PLDT\' && g_device_data.operator_name != \'DITO\'">\
                <span>{{formData.Modem5GTemperature}}</span>\
            </el-form-item>\
            <el-form-item class="fh-item-text" :label="$t(\'deviceInfo.mobileSoftversion\')" v-if="g_device_data.user != \'1\'">\
                <span class="beyondWrap">{{formData.mobileSoftversion}}</span>\
            </el-form-item>\
            <el-form-item class="fh-item-text" :label="$t(\'deviceInfo.manufacturer\')" v-if="g_device_data.user != \'1\'">\
                <span>{{formData.manufacturer}}</span>\
            </el-form-item>\
        </el-form>\
    </div>\
    </div>';
    return Vue.extend({
        i18n: i18n,
        message: lang,
        template: view,
        data: function() {
            return {
                formData: {
                    ProductName:"5G CPE",
                    SerialNumber: "",
                    SoftwareVersion:"",
                    HardwareVersion:"",
                    uptime:"",
                    IPInterfaceIPAddress:"",
                    CPUUsage:"",
                    MemoryUsage:"",
                    ModelName: "",
                    Modem5GTemperature: "",
                    mobileSoftversion:"",
                    manufacturer: "Fiberhome"
                }
            }
        },
        computed: {},
        watch: {
        },
        created: function() {
            openLoading();
            this.getdata();
            var that = this;
            this.interval = setInterval(function() {
                that.getdata(); // methods中请求数据的方法
            }, 5000);
            if (that.$G_DEVICE_DATA.operator_name == "LEISHEN")
            {
                that.formData.manufacturer = that.$t('deviceInfo.manufacturer.leishen')
            }
            if (g_device_data.model_name == 'LG6121D'){
                that.formData.ProductName = that.$t('deviceInfo.outdoor.name')
            } else if (g_device_data.model_name == 'LG6121H'){
                that.formData.ProductName = this.$t("deviceInfo.air.name");
            } else {
                that.formData.ProductName = "5G CPE";
            } 
        },
        beforeDestroy:function () {
            clearInterval(this.interval);
        },
        methods: {
            getdata:function(){
                var that = this;
                var getDeviceInfoObj = {
                    SerialNumber: x_DeviceInfo_obj + x_DeviceInfo_SerialNumber,
                    SoftwareVersion: x_DeviceInfo_obj + x_DeviceInfo_SoftwareVersion,
                    HardwareVersion: x_DeviceInfo_obj + x_DeviceInfo_HardwareVersion,
                    IPInterfaceIPAddress: x_LANHostConfigManagement_obj + x_LANHost_IPInterface_1 + x_LANHost_IPInterfaceIPAddress,
                    CPUUsage: x_DeviceInfo_obj + x_DeviceInfo_CPUUsage,
                    MemoryTotal: x_DeviceInfo_obj + x_DeviceInfo_Memory_Total,
                    MemoryFree: x_DeviceInfo_obj + x_DeviceInfo_Memory_Free,
                    ModelName: x_DeviceInfo_obj + x_DeviceInfo_ModelName,
                    mobileSoftversion: x_DeviceInfo_obj + x_DeviceInfo_mobileSoftversion,
                    Modem5GTemperature: x_Temperature_obj + x_Modem5GTemperature
                };
                $post("get_value_by_xmlnode", getDeviceInfoObj).then(function(response){
                    that.formData.SerialNumber = response.SerialNumber;
                    that.formData.SoftwareVersion = response.SoftwareVersion;
                    that.formData.HardwareVersion = response.HardwareVersion;
                    that.formData.IPInterfaceIPAddress = response.IPInterfaceIPAddress;
                    that.formData.CPUUsage = (response.CPUUsage - 0).toFixed(2) + "%";
                    that.formData.MemoryUsage = ((response.MemoryTotal - response.MemoryFree)/ response.MemoryTotal * 100).toFixed(2) + "%";
                    that.formData.ModelName = response.ModelName; 
                    that.formData.mobileSoftversion = response.mobileSoftversion;
                    that.formData.Modem5GTemperature = (response.Modem5GTemperature / 1000).toFixed(1) + " ℃";


                    var getcmd = {
                        key: "UPTIME"
                    };
                    $post("get_cmd_result_web", getcmd).then(function(data){
                        that.formData.uptime = secondsFormat(data.result);
                    })
                    closeLoading();
                });
            }
        }
    })

})