define(["vue", "vue-i18n", "/lang/"+g_device_data.userLang+"/management_res.js"], function(Vue, VueI18n, lang){
    var messages = {}
    messages[g_device_data.userLang] = lang;
    var i18n = new VueI18n({
        locale: g_device_data.userLang,
        messages: messages
    });
    var view = '\
    <div>\
        <div class="page_title">\
            <div class="head_line">{{$t(\'debugInfo.title\')}}</div>\
            <div class="title_tips" style="color:red" v-show="pwderror">{{$t(\'developer.noenter\')}}</div>\
            <div class="title_tips" style="color:red" v-show="formData.debugInfo_enable && !pwderror">{{$t(\'developer.useInfo\')}}</div>\
        </div>\
        <div class="page_content">\
            <el-form ref="elForm" :model="formData" size="large" :rules="checkData" label-width="42%" :label-position="g_this.label_position">\
                <el-form-item :label="$t(\'debugInfo.enable\')">\
                    <el-switch v-model="formData.debugInfo_enable" @change="onApplyEnable" :disabled="pwderror"></el-switch>\
                </el-form-item>\
                <el-form-item  prop="debugInfoVal" v-if="formData.debugInfo_enable">\
                <el-radio-group v-model="formData.debugInfoVal" @change="onApply" style="width:300px;line-height: 1;" :disabled="pwderror">\
                    <el-radio label="1" style="padding-right:30px">LAN</el-radio>\
                    <el-radio label="2" style="padding-right:30px">USB</el-radio>\
                </el-radio-group>\
                </el-form-item>\
            </el-form>\
        </div>\
        <el-dialog :title="$t(\'developer.title\')"\
            :close-on-click-modal="false"\
            :close-on-press-escape="false"\
            :show-close="false"\
            :visible.sync="Visible_flag"\
            class="developerDialog"\
            style="overflow-y:auto">\
            <div class="title_tips" style="color:red">{{$t(\'developer.tips\')}}</div>\
            <el-form ref="developerForm" :model="developerForm" :rules="checkData" size="large" label-position="top">\
                <el-form-item :label="$t(\'developer.password\')" prop="password">\
                    <el-input v-model="developerForm.password" maxLength="32" clearable show-password  class="developerInput"></el-input>\
                </el-form-item>\
                <div class="mandatory">{{$t(\'management.mandatory\')}}</div>\
            </el-form>\
            <div slot="footer">\
                <el-button @click="developerCancel">{{$t(\'developer.cancel\')}}</el-button>\
                <el-button type="primary" @click="developerApply">{{$t(\'developer.apply\')}}</el-button>\
            </div>\
        </el-dialog>\
    </div>';
    return Vue.extend({
        i18n: i18n,
        message: lang,
        template: view,
        data: function() {
            var that = this;
            return {
                storage_developer: null,
                dialogTable: true,
                pwderror: false,
                developerForm:{
                    password: "",
                },
                formData: {
                    debugInfo_enable: false,
                    debugInfoVal: "1",
                },
                checkData: {
                    password: [
                        {required: true, message: that.$t("developer.passwordtip"), trigger: 'blur'},
                        {
                            validator: function(rule, value, callback) {
                                if (isSecurityInputValue(value) != "secure"){
                                    callback(new Error(that.$t('pwd_security_tip_start') + isSecurityInputValue(value) + that.$t('pwd_security_tip_end')));   
                                }
                                else{
                                    callback()
                                }
                            },
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        computed: {
            Visible_flag:{
                get: function(){
                    if ((g_device_data.operator_name != "OMN_OMANTEL" && g_device_data.operator_name != "PLDT" && g_device_data.operator_name != "DITO") && this.dialogTable && this.storage_developer == 0){
                        return true;
                    } else {
                        return false;
                    }
                },
                set: function(val){
                }
            }
        },
        watch: {},
        created: function() {
            openLoading();
            this.getdata();
        },
        mounted: function() {},
        methods: {
            getdata: function(){
                var that = this;
            
                var getObj = {
                    debugInfoEnable: x_ELT_Output_obj
                };
            
                $post("get_value_by_xmlnode", getObj).then(function(data){
                    //console.log(data);
                    $get("get_developer_mode", null).then(function(response){
                        if (response.developer_flag != undefined){
                            that.storage_developer = response.developer_flag;
                        }
                    })
                    that.formData.debugInfo_enable = data.debugInfoEnable == "0" ? false : true;
                    that.formData.debugInfoVal = data.debugInfoEnable;
            
                    closeLoading();
                })
            },
            onApply: function() {
                if (this.pwderror) {
                    return false;
                }
                var setData = {
                    url: x_ELT_Output_obj,
                    value: this.formData.debugInfo_enable ? this.formData.debugInfoVal : "0",
                };
                openLoading();
                var that = this;
                $post("set_single_by_xmlnode", setData).then(function(response){
                    //console.log(response)
                    that.getdata()
                    closeLoading();
                })
            },
            onApplyEnable: function(){
                if (this.pwderror) {
                    return false;
                }
                var setData = {
                    url: x_ELT_Output_obj,
                    value: this.formData.debugInfo_enable ? "1" : "0",
                };

                openLoading();
                var that = this;
                $post("set_single_by_xmlnode", setData).then(function(response){
                    //console.log(response)
                    that.getdata()
                    closeLoading();
                })
            },
            developerApply: function () {
                var that = this;
                this.$refs['developerForm'].validate(function (valid) {
                    if (valid) {
                        openLoading();
                        that.submit();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            submit: function(){
                var that = this;
                var setdata = {
                    user: g_device_data.user,
                    password: that.developerForm.password,
                };
                $post("enter_developer",setdata).then(function(response){
                    //console.log(response);
                    closeLoading();
                    that.dialogTable = false;
                    if(response.success == "true")
                    {
                        that.$notify({
                            message: that.$t('developer.pwd_correct'),
                            type: 'success'
                        });
                        that.pwderror = false;
                    }
                    else
                    {
                        that.$notify({
                            message: that.$t('developer.pwd_incorrect'),
                            type: 'error'
                        });
                        that.pwderror = true;
                    }
                })
            },
            developerCancel: function(){
                var that = this;
                that.dialogTable = false;
                that.pwderror = true;
            }
        }
    })
})