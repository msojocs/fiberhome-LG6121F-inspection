define(["vue", "vue-i18n", "/lang/"+g_device_data.userLang+"/management_res.js"], function(Vue, VueI18n, lang){
    var messages = {};
    messages[g_device_data.userLang] = lang;
    var i18n = new VueI18n({
      locale: g_device_data.userLang,
      messages: messages
    })
    var view = '\
    <div>\
        <div class="page_title">\
            <div class="head_line">{{$t(\'managemant.localUp.title\')}}</div>\
        </div>\
        <div class="page_content">\
            <el-form size="large" :label-position="g_this.label_position" class="form_fiex_box">\
                <el-form-item>\
                    <div class="content_img" v-if="g_device_data.model_name == \'LG6121D\'"><img src="../static/image/upgrade_outdoor.png"></div>\
                    <div class="content_img" v-else><img src="../static/image/image_upgrade.png"></div>\
                    <div class="content_span"><span>{{$t(\'managemant.localUp.tip\')}}</span></div>\
                    <el-upload ref="upload" \
                        :action="actionURL" \
                        :headers="headers" \
                        :on-success="updateSuccess" \
                        :on-error="updateFailed" \
                        :on-remove="removeFile" \
                        :before-upload="checkFile" \
                        :on-change="fileChange" \
                        :limit="1" \
                        :multiple="false" \
                        :file-list="fileList" \
                        :auto-upload="false"> \
                        <el-button type="primary" @click="removeFile">{{$t(\'File.Select\')}}</el-button>\
                    </el-upload>\
                    <el-button class="loaclUP_button" type="primary" @click="onApply" :disabled="fileList.length==\'0\'">{{$t(\'File.Upload\')}}</el-button>\
                </el-form-item>\
            </el-form>\
            <el-dialog \
                :title="$t(\'upload_hint\')" \
                :visible.sync="dialogVisible" \
                :close-on-click-modal="false"\
                :close-on-press-escape="false"\
                :show-close="false" \
                width="30%"> \
                <span v-html="upTips"></span>\
                <span slot="footer" class="dialog-footer">\
                    <el-button size="medium" v-if="showButton" type="primary" @click="dialogVisible = false">{{$t("upload_confirm")}}</el-button>\
                </span>\
            </el-dialog>\
        </div>\
    </div>'
    return Vue.extend({
        i18n: i18n,
        message: lang,
        template: view,
        data: function(){
            return {
                fileList: [],
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'Content-Type': 'multipart/form-data'
                },
                upTips: "",
                dialogVisible: false,
                showButton: false,
                actionURL: requestupurl + "?action=upgradeimage&_=" + Math.random(),
                timeout: null,
            }
        },
        created: function(){
           
        },
        beforeDestroy:function () {
            clearTimeout(this.timeout)
        },
        methods:{
            onApply: function(){
                if (this.fileList.length =='0') {
                    return false;
                }
                $get("get_heartbeat");
                var that = this;
                getToken().then(function(data){
                    that.headers["FH-Upgrade-Api-Token"] = data.data.sessionid;
                    that.$refs.upload.submit();
                })
            },
            updateSuccess: function(data){
                var that = this;

                if (data.success == "true"){
                    that.upTips = that.$t("upload_reboot");
                    var cmdObj_1 = {
                        key: "RECORD_MESSAGE_WEB"
                    };
                    var cmdObj = {
                        key: "REBOOT_WEB"
                    };

                    $post("do_cmd_web", cmdObj_1).then(function(response){
                        // if(response.success == "true"){
                            $post("do_cmd_web", cmdObj).then(function(response){
                                that.timeout = setTimeout(function(){
                                    jumpToLoginPage();
                                }, 10000);
                            })
                        // }
                    })						
                }else{
                    that.upTips = that.$t("upload_failed");
                }
                this.showButton = true;
                this.$refs.upload.clearFiles()  //清空文件
            },
            updateFailed: function(data){
                this.upTips = this.$t("upload_failed");
                this.dialogVisible = true;
                this.showButton = true;
            },
            fileChange: function(file, fileList){
                if(this.fileList.length === 0)
                    this.fileList.push(fileList[0]);
            },
            removeFile: function(file, fileList){
                this.fileList = [];
            },
            checkFile: function(file){
                if (file.size/1024/1024 > 1024){
                    fh_alert(this.$t("upload_image_over1G"));
                    return false;
                } else {
                    this.upTips = this.$t("uploading");
                    this.dialogVisible = true;
                    this.showButton = false;
                }
            }
        }
    })
})