define(["exports",
        "vue",
        "vue-router",
        "vue-i18n",
        "ELEMENT",
        "header/headerComp",
        "menu/menuComp",
        "main_res",
        "footer/footerComp",
        "router",],function(
          exports,
          Vue,
          vueRouter,
          VueI18n,
          element,
          headerComp,
          menuComp,
          lang,
          footerComp,
          r){

    element.install(Vue);
    Vue.use(vueRouter);
    Vue.use(VueI18n);
    Vue.prototype.$G_DEVICE_DATA = g_device_data;
    window.G_DEVICE_DATA = g_device_data;

    var messages = {};
    messages[g_device_data.userLang] = lang;
    //console.log(messages);
    var i18n = new VueI18n({
        locale: g_device_data.userLang,
        messages: messages
    })

    var app = new Vue({
        el:'#app',
        i18n: i18n,
        data:function(){
            g_this = this;
            return {
                screenWidth: document.body.clientWidth,
                label_position: "right",
                open_close_class: "icon-fh-more"
            }
        },
        created: function(){
            g_this = this;
            document.onkeydown = function(e) {
                var key = window.event.keyCode;
                if (key == 13) {  //阻止enter
                    e.preventDefault();
                }
            }
            if(g_device_data.PINCodeEnable == "1" || g_device_data.RemainingTimes == "0"){
                this.$router.push('/mobileNetwork/pinManagement');
            }
            if(g_device_data.operator_name == "PLDT"){
                loadJsCss("../static/css/element_pldt.css", "css");
                loadJsCss("../static/css/styles_pldt.css", "css");
            }else{
                loadJsCss("../static/css/element.css", "css");
                loadJsCss("../static/css/styles.css", "css");
            }
        },
        components:{
         	"myheader":headerComp.default,
            "mymenu":menuComp.default,
            "myfooter":footerComp.default,
        },
        mounted:function() {
            var that = this;
            window.onresize = function() {
                that.screenWidth = document.body.clientWidth;
            }
        },
        watch:{
            "screenWidth": {
                handler: function(newW, oldW) {
                    if (oldW){
                        if (newW >= 992 && oldW < 992) {
                            document.getElementById("app").classList.remove("fh-menu-hide");
                            g_this.open_close_class = "icon-fh-close";
                        }
                        if (newW < 992 && oldW >= 992) {
                            document.getElementById("app").classList.add("fh-menu-hide");
                            g_this.open_close_class = "icon-fh-more";
                        }
                    }else{
                        if (newW >= 992) {
                            document.getElementById("app").classList.remove("fh-menu-hide");
                            g_this.open_close_class = "icon-fh-close";
                        }else {
                            document.getElementById("app").classList.add("fh-menu-hide");
                            g_this.open_close_class = "icon-fh-more";
                        }
                    }

                    if (newW < 550) {
                        this.label_position = "top";
                    } else {
                        this.label_position = "right";
                    }
                },
                immediate: true
            }
        },
        methods: {
            hide_menu: function(){
                document.getElementById("app").classList.add("fh-menu-hide");
                g_this.open_close_class = "icon-fh-more";
            } 
        },
	    router:r
    });

    exports.default = app;
    Object.freeze(g_device_data);
})