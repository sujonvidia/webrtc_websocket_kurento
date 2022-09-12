var mywindowUrl = '';
var url888888 = window.location.href;
var arr888888 = url888888.split("/");
mywindowUrl = arr888888[0] + "//" + arr888888[2];
var all_custom_title = {};

var all_conversations = [];
Vue.directive('click-outside', {
    bind: function (el, binding, vnode) {
      this.event = function (event) {
       if (!(el == event.target || el.contains(event.target) || event.target.className === "select2-selection__choice__remove" || event.target.className === "select2-search__field" )) {
          vnode.context[binding.expression](event);
        }
      };
      document.body.addEventListener('click', this.event);
    },
    unbind: function (el) {
      document.body.removeEventListener('click', this.event);
    },
  });

  Vue.use(VueToast, {})

new Vue({
    el:"#file_mainSec",
    data:{
        title:"Hello World!",
        activeTab:'All Files',
        users:user_list,
        user_id:user_id,
        filter_teammates:[],
        all_tags:[],
        filter_tags:[],
        all_file_types:[],
        filter_file_types:[],
        selected_files:[],
        selected_filesAll:false,
        selected_files_urls:[],
        sorting_active:'',
        sorting_active_red:'date',
        files_loader:true,
        image_view:false,
        dropdown:{
            isActiveForTeammates:false,
            isActiveForTags:false,
            isActiveForFileTypes:false,
            isActiveForPages:false,

        },
        files_counter:{
            all_files:0,
            images:0,
            videos:0,
            audios:0,
            docs:0,
            all_links:0,
            personal_files:0
        },
        main_input_val:'',
        filter_dropdown:[],
        files_placeholder:'Search All Files',
        advance_filer:'inactive',
        dropdown_search:'active',
        table_view_cate:'files',
        show_page_size:20,
        show_tlb_data:[],
        all_files:[],
        all_images:[],
        all_audios:[],
        all_videos:[],
        all_docs:[],
        all_links:[],
        all_personal_data:[],
        main_all_files:[],
        main_all_images:[],
        main_all_audios:[],
        main_all_videos:[],
        main_all_docs:[],
        main_all_links:[],
        main_all_personal_data:[],
        filterActive:false,
        filtering_data:{
            search_for:'',
            search_teammates:[],
            search_tags:[],
            search_file_type:[],
            start_date:'',
            end_date:'',
            searchTeammatesText:'',
            searchTagsText:'',
            searchFileTypeText:'',
            filtered_text:'',
        },
        pagination_data:{
            total_page:1,
            current_page:1,
            next_page:1,
            prev_page:1,
            total_data:10,
            pagitext:'',
            go_input:0

        },
        resetAction:false,
        show_backwrap:false,
        backwrap_type:'',
        delete_ready_file_id:'',
        shared_linkKey:'',
        no_link_found:true,
        shared_files:[],
        created_link:'',
        full_link_share:'',
        shareUniq:'',
        for_custom_title:{
            id:'',
            custom_title:'',
            original_name:'',
        },
        forward:{
            limit:10,
            mini:[],
            li:[],
            li_search:[],
            next:false,
            single_forward_file:'',
            single_forward_file_url:'',
        }
        

    },
    mounted:function(){
            this.getMyallfilesandlinks()//method1 will execute at pageload

            let self = this;
            window.addEventListener('keyup', function(event) {
                // If  ESC key was pressed...
                if (event.keyCode === 27) {
                    // try close your dialog
                    self.dropdown.isActiveForPages = false;
                    if(self.backwrap_type == 'forward_files'){
                        if(self.forward.next){
                            self.closeNextForward();
                        }else{
                            self.backwrap_type = '';
                            self.show_backwrap = false;
                        }
                    }else{
                        self.backwrap_type = '';
                        self.show_backwrap = false;
                    }

                    if(self.advance_filer == 'active'){
                        if(self.dropdown.isActiveForFileTypes == false && self.dropdown.isActiveForTeammates == false && self.dropdown.isActiveForTags == false){
                            self.showAdvanceFilter();
                        }else{
                            self.dropdown.isActiveForFileTypes = false;
                            self.dropdown.isActiveForTeammates = false;
                            self.dropdown.isActiveForTags = false;
                        }
                    }
                }
            });
    },
    methods: {
        
        getMyallfilesandlinks(){
            socket.emit('find_all_files',{conversation_id:user_id+'/allConv'}, function(res){
                for(let i of res.my_files){
                    let icon = i.originalname.split('.');
                    if(i.file_type.indexOf('image') > -1){
                        i.icon = file_server+i.location;
                    }else{
                        i.icon = '/images/basicAssets/'+getIconForFile(icon[icon.length - 1])+'.svg';
                    }
                }
                all_conversations = res.all_conv;
                this.table_view_cate = 'files';
                this.$refs.main_search_in.focus();
                this.files_counter.personal_files = '('+ res.my_files.length+')' ;
                this.files_counter.all_links = '('+ res.msg_links.length+')';

                var allCheckedFiles = getAllcheckedFiles(res.files);
                
                this.files_counter.all_files = '('+ allCheckedFiles.allFilesData.length+')';
                this.files_counter.images = '('+allCheckedFiles.allMediaImg.length+')';
                this.files_counter.videos = '('+allCheckedFiles.allMediaVideo.length+')';
                this.files_counter.audios = '('+allCheckedFiles.allMediaAudio.length+')';
                this.files_counter.docs = '('+allCheckedFiles.allMediaOthers.length+')';

                this.all_files = allCheckedFiles.allFilesData;
                this.all_images = allCheckedFiles.allMediaImg;
                this.all_audios = allCheckedFiles.allMediaAudio;
                this.all_videos = allCheckedFiles.allMediaVideo;
                this.all_docs = allCheckedFiles.allMediaOthers;
                this.all_links = getAllcheckedLinks(res.msg_links);
                this.all_personal_data = res.my_files;

                this.main_all_files = allCheckedFiles.allFilesData;
                this.main_all_images = allCheckedFiles.allMediaImg;
                this.main_all_audios = allCheckedFiles.allMediaAudio;
                this.main_all_videos = allCheckedFiles.allMediaVideo;
                this.main_all_docs = allCheckedFiles.allMediaOthers;
                this.main_all_links = getAllcheckedLinks(res.msg_links);
                this.main_all_personal_data = res.my_files;

                this.all_tags = res.all_tags;
                this.filter_tags = [];

                var allFileIds = [];

                for(file in this.main_all_files){
                    allFileIds.push(this.main_all_files[file].key+this.user_id);
                }

                
                // $('.img_action.share_ico').removeClass('active');
                if(allFileIds.length > 0){
                    socket.emit('getallSharedLink',{data:allFileIds},function(res){
                        var data2 = {
                            user_id:user_id,
                            type:'get'
                        }
                        let allCusTitle = {};
                        socket.emit('customTitle',data2,function(res2){
                            if(res2.status){
                                for(link in res2.result){
                                    allCusTitle[res2.result[link].change_id] = res2.result[link].change_title;
                                }
                            }
                            all_custom_title = allCusTitle;
                            if(res.data.length > 0){
                                let all_SharedFile = [];
                                for(file in res.data){
                                    let a = res.data[file].split(user_id);
                                    all_SharedFile.push(a[0])
                                }
                                this.shared_files = all_SharedFile;
                            }

                            let data = [];
                            let file_types = [];
                            for(file in allCheckedFiles.allFilesData){
                                if(file < this.show_page_size){
                                    data.push(getChangesDataforVue(allCheckedFiles.allFilesData[file]));
                                }
                                if(file_types.indexOf(getChangesDataforVue(allCheckedFiles.allFilesData[file]).view_file_type) == -1){
                                    file_types.push(getChangesDataforVue(allCheckedFiles.allFilesData[file]).view_file_type)
                                }
                            }
                            this.show_tlb_data = data;
                            this.all_file_types = file_types;
                            this.filter_file_types = file_types;
                            
                            

                            

                            // pagination script
                            this.pagination_data.total_data = this.all_files.length;
                            this.pagination_Mathod('home');
                            this.files_loader = false;
                        }.bind(this))
                    }.bind(this));
                }
                
            }.bind(this));
        },
        resetAdvanceSearch(){
            this.filtering_data.search_for = '';
            this.filtering_data.searchFileTypeText = '';
            this.filtering_data.search_teammates = [];
            this.filtering_data.search_file_type = [];
            this.filtering_data.search_tags = [];
            this.filtering_data.start_date = '';
            this.filtering_data.end_date = '';
            this.main_input_val = '';
            this.filtering_data.searchTeammatesText = '';
            this.filtering_data.searchTagsText = '';
            this.$refs.popupsearch.focus();
            this.resetAction = true;
            this.FilesFilterFun();

        },
        searTeamKeyup(e,val){
            this.filtering_data.searchTeammatesText = val;
            if(this.filtering_data.searchTeammatesText.length == 0){

                this.filter_teammates = this.getTeammatesForFile();
            }else{
                let data = [];
                let gdata = this.getTeammatesForFile();
                for(u in gdata){
                    if(gdata[u].fullname.toLowerCase().indexOf(val.toLowerCase()) > -1){
                        data.push(gdata[u]);
                    }
                }
                this.filter_teammates = data;
            }

        },
        searFileTypeKeyup(e,val){
            this.filtering_data.searchFileTypeText = val;
            if(this.filtering_data.searchFileTypeText.length == 0){
                this.filter_file_types = this.all_file_types;
            }else{
                let data = [];
                for(u in this.all_file_types){
                    if(this.all_file_types[u].toLowerCase().indexOf(val.toLowerCase()) > -1){
                        data.push(this.all_file_types[u]);
                    }
                }
                this.filter_file_types = data;
            }

        },
        clear_all_search(){
            // for teammates search
            this.filter_teammates = this.getTeammatesForFile();
            this.filtering_data.searchTeammatesText = '';
            this.filtering_data.search_teammates = [];

            //for tag search
            this.filter_tags = this.getOnlyFilesTag();;
            this.filtering_data.searchTagsText = '';
            this.filtering_data.search_tags = [];

            //for file type search
            this.filter_file_types = this.all_file_types;
            this.filtering_data.searchFileTypeText = '';
            this.filtering_data.search_file_type = [];

            //for start & end date
            this.filtering_data.start_date = '';
            this.filtering_data.end_date = '';


        },
        searTagsKeyup(e,val){
            this.filtering_data.searchTagsText = val;
            if(this.filtering_data.searchTagsText.length == 0){
                this.filter_tags = this.getOnlyFilesTag();
            }else{
                let data = [];
                var ta = this.getOnlyFilesTag();
                for(u in t){
                    if(t[u].title.toLowerCase().indexOf(val.toLowerCase()) > -1){
                        data.push(t[u]);
                    }
                }
                this.filter_tags = data;
            }
        },
        clicktabFun(type){
            this.activeTab = type;
            this.files_placeholder = 'Search ' + type;
            this.main_input_val = '';
            this.$refs.main_search_in.focus();
            this.changeTabDataFun();
            this.view_table_data(type);
            this.clear_all_search();
            this.sorting_active = '';
            this.selected_files = [];
            this.selected_files_urls = [];
            this.sorting_active_red = 'date';
        },
        clearMainSearch(){
            this.main_input_val = '';
            this.$refs.main_search_in.focus();
            resetAdvanceSearch();
            this.changeTabDataFun();
            this.view_table_data(this.activeTab);
            this.filtering_data.filtered_text = '';
        },
        changeTabDataFun(){
            if(this.activeTab == 'All Files'){
                this.all_files = this.main_all_files;
            }else if(this.activeTab == 'Images'){
                this.all_images = this.main_all_images;
            }else if(this.activeTab == 'Audios'){
                this.all_audios = this.main_all_audios;
            }else if(this.activeTab == 'Videos'){
                this.all_videos = this.main_all_videos;
            }else if(this.activeTab == 'Docs'){
                this.all_docs = this.main_all_docs;
            }else if(this.activeTab == 'All Links'){
                this.all_links = this.main_all_links;
            }else if(this.activeTab == 'Personal Files'){
                this.all_personal_data = this.main_all_personal_data;
            }
        },
        showAdvanceFilter(){
            
            if(this.advance_filer == 'active'){
                this.$refs.main_search_in.focus();
                this.advance_filer = 'inactive';
            }else{
                this.advance_filer = 'active';
                this.dropdown.isActiveForPages = false;
                setTimeout(() => {
                    this.$refs.popupsearch.focus();
                 }, 10);
            }
        },
        mainSearInput(e,val){
            this.main_input_val = val;
            if(e.keyCode == '13'){
                this.FilesFilterFun();
            }else if(this.main_input_val.length == 0){
                this.resetAdvanceSearch();
                this.clearMainSearch();
            }
            // else{
            //     this.FilesFilterFun(true);
            // }
        },
        mainSearInputFiltered(e,val){
            this.filtering_data.filtered_text = val;
            if(e.keyCode == '13'){
                this.FilesFilterFun();
            }else if(this.filtering_data.filtered_text.length == 0){
                this.resetAdvanceSearch();
                this.clearMainSearch();
            }
        },
        FilesFilterFun(dropdown = false){
            // if(this.main_input_val.length > 0){
                



                if(this.activeTab == 'All Files'){
                    let data = [];
                    for(file in this.main_all_files){
                        
                        let maininputSearch = true;
                        if(this.main_input_val.length > 0){
                            let checktitle = false;
                            let checkextension = false;
                            let checksize = false;
                            let checkdate = false;
                            let checkuploadby = false;
                            
                            let uploadedByname = findObjForUser(this.main_all_files[file].user_id).fullname;
                            var thisdate = moment(this.main_all_files[file].created_at).format('DD-MM-YYYY');
                            if(this.main_all_files[file].originalname.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1){
                                checktitle = true;
                            }

                            let file_extensionName = getChangesDataforVue(this.main_all_files[file]).view_file_type;
                            let fileSizeCon = bytesToSize2(this.main_all_files[file].file_size);
                            if(fileSizeCon.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checksize = true;
                            if(file_extensionName.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkextension = true;

                            if(this.main_all_files[file].file_type.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkextension = true;
                            if(thisdate.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkdate = true;
                            if(uploadedByname.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkuploadby = true;
                            
                            if(checktitle || checkextension || checksize || checkdate || checkuploadby){
                                
                                maininputSearch = true;
                                // data.push(this.main_all_files[file]);
                            }else{
                                maininputSearch = false;
                            }
                        }

                        let teammates = true;
                        let tag = true;
                        let type = true;
                        let dateRanage =true;

                        if(this.filtering_data.search_teammates.length > 0){
                            if(this.filtering_data.search_teammates.indexOf(this.main_all_files[file].user_id) == -1){
                                teammates = false;
                            }
                        }
                        if(this.filtering_data.search_file_type.length > 0){
                            // let ex = this.main_all_files[file].file_type.split('/');
                            let ex = getChangesDataforVue(this.main_all_files[file]).view_file_type;
                            if(this.filtering_data.search_file_type.indexOf(ex) == -1){
                                type = false;
                            }
                        }
                        if(this.filtering_data.search_tags.length > 0){
                            if(this.main_all_files[file].tag_list == null){
                                this.main_all_files[file].tag_list = [];
                            }
    
                            let c = false;
                            for(tag_l in this.main_all_files[file].tag_list){
                                if(this.filtering_data.search_tags.indexOf(this.main_all_files[file].tag_list[tag_l]) > -1){
                                    c = true;
                                }
                            }
                            if(!c){
                                tag = false;
                            }
                        }
                        if(this.filtering_data.start_date != '' && this.filtering_data.end_date != ''){
                            // console.log(moment(val,"DD-MM-YYYY").format('DD-MM-YYYY'))
                           var startdate =  moment(this.filtering_data.start_date,"DD-MM-YYYY").unix();
                           var enddate = moment(this.filtering_data.end_date,"DD-MM-YYYY").unix();
                           var filedate = moment(this.main_all_files[file].created_at).unix();
                           if(filedate > startdate && filedate < enddate){
                            dateRanage = true;
                           }else{
                            dateRanage = false
                           }
                        }


                        if(maininputSearch && teammates && tag && type && dateRanage){
                            data.push(this.main_all_files[file]);
                        }



                    }
                    if(dropdown === true){
                        this.filter_dropdown = data;
                    }else{
                        this.all_files = data;
                        this.view_table_data('All Files');
                    }
                }else if(this.activeTab == 'Images'){
                    let data = [];
                    for(file in this.main_all_images){
                        
                        let maininputSearch = true;
                        if(this.main_input_val.length > 0){
                            let checktitle = false;
                            let checkextension = false;
                            let checksize = false;
                            let checkdate = false;
                            let checkuploadby = false;
                            let uploadedByname = findObjForUser(this.main_all_images[file].user_id).fullname;
                            var thisdate = moment(this.main_all_images[file].created_at).format('DD-MM-YYYY');
                            if(this.main_all_images[file].originalname.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1){
                                checktitle = true;
                            }

                            let file_extensionName = getChangesDataforVue(this.main_all_images[file]).view_file_type;
                            let fileSizeCon = bytesToSize2(this.main_all_images[file].file_size);
                            if(fileSizeCon.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checksize = true;
                            if(file_extensionName.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkextension = true;

                            if(this.main_all_images[file].file_type.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkextension = true;
                            if(thisdate.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkdate = true;
                            if(uploadedByname.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkuploadby = true;
                            
                            if(checktitle || checkextension || checksize || checkdate || checkuploadby){
                                
                                maininputSearch = true;
                                // data.push(this.main_all_images[file]);
                            }else{
                                maininputSearch = false;
                            }
                        }

                        let teammates = true;
                        let tag = true;
                        let type = true;
                        let dateRanage =true;

                        if(this.filtering_data.search_teammates.length > 0){
                            if(this.filtering_data.search_teammates.indexOf(this.main_all_images[file].user_id) == -1){
                                teammates = false;
                            }
                        }
                        if(this.filtering_data.search_file_type.length > 0){
                            // let ex = this.main_all_images[file].file_type.split('/');
                            // ex = ex[ex.length - 1];
                            let ex = getChangesDataforVue(this.main_all_images[file]).view_file_type;
                            if(this.filtering_data.search_file_type.indexOf(ex) == -1){
                                type = false;
                            }
                        }
                        if(this.filtering_data.search_tags.length > 0){
                            if(this.main_all_images[file].tag_list == null){
                                this.main_all_images[file].tag_list = [];
                            }
    
                            let c = false;
                            for(tag_l in this.main_all_images[file].tag_list){
                                if(this.filtering_data.search_tags.indexOf(this.main_all_images[file].tag_list[tag_l]) > -1){
                                    c = true;
                                }
                            }
                            if(!c){
                                tag = false;
                            }
                        }
                        if(this.filtering_data.start_date != '' && this.filtering_data.end_date != ''){
                            // console.log(moment(val,"DD-MM-YYYY").format('DD-MM-YYYY'))
                           var startdate =  moment(this.filtering_data.start_date,"DD-MM-YYYY").unix();
                           var enddate = moment(this.filtering_data.end_date,"DD-MM-YYYY").unix();
                           var filedate = moment(this.main_all_images[file].created_at).unix();
                           if(filedate > startdate && filedate < enddate){
                            dateRanage = true;
                           }else{
                            dateRanage = false
                           }
                        }



                        if(maininputSearch && teammates && tag && type && dateRanage){
                            data.push(this.main_all_images[file]);
                        }



                    }
                    if(dropdown === true){
                        this.filter_dropdown = data;
                    }else{
                        this.all_images = data;
                        this.view_table_data('Images');
                    }
                    
                }else if(this.activeTab == 'Audios'){
                    let data = [];
                    for(file in this.main_all_audios){
                        
                        let maininputSearch = true;
                        if(this.main_input_val.length > 0){
                            let checktitle = false;
                            let checkextension = false;
                            let checksize = false;
                            let checkdate = false;
                            let checkuploadby = false;
                            let uploadedByname = findObjForUser(this.main_all_audios[file].user_id).fullname;
                            var thisdate = moment(this.main_all_audios[file].created_at).format('DD-MM-YYYY');
                            if(this.main_all_audios[file].originalname.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1){
                                checktitle = true;
                            }

                            let file_extensionName = getChangesDataforVue(this.main_all_audios[file]).view_file_type;
                            let fileSizeCon = bytesToSize2(this.main_all_audios[file].file_size);
                            if(fileSizeCon.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checksize = true;
                            if(file_extensionName.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkextension = true;

                            if(this.main_all_audios[file].file_type.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkextension = true;
                            if(thisdate.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkdate = true;
                            if(uploadedByname.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkuploadby = true;
                            
                            if(checktitle || checkextension || checksize || checkdate || checkuploadby){
                                
                                maininputSearch = true;
                                // data.push(this.main_all_audios[file]);
                            }else{
                                maininputSearch = false;
                            }
                        }

                        let teammates = true;
                        let tag = true;
                        let type = true;
                        let dateRanage =true;

                        if(this.filtering_data.search_teammates.length > 0){
                            if(this.filtering_data.search_teammates.indexOf(this.main_all_audios[file].user_id) == -1){
                                teammates = false;
                            }
                        }
                        if(this.filtering_data.search_file_type.length > 0){
                            let ex = getChangesDataforVue(this.main_all_audios[file]).view_file_type;
                            if(this.filtering_data.search_file_type.indexOf(ex) == -1){
                                type = false;
                            }
                        }
                        if(this.filtering_data.search_tags.length > 0){
                            if(this.main_all_audios[file].tag_list == null){
                                this.main_all_audios[file].tag_list = [];
                            }
    
                            let c = false;
                            for(tag_l in this.main_all_audios[file].tag_list){
                                if(this.filtering_data.search_tags.indexOf(this.main_all_audios[file].tag_list[tag_l]) > -1){
                                    c = true;
                                }
                            }
                            if(!c){
                                tag = false;
                            }
                        }
                        if(this.filtering_data.start_date != '' && this.filtering_data.end_date != ''){
                            // console.log(moment(val,"DD-MM-YYYY").format('DD-MM-YYYY'))
                           var startdate =  moment(this.filtering_data.start_date,"DD-MM-YYYY").unix();
                           var enddate = moment(this.filtering_data.end_date,"DD-MM-YYYY").unix();
                           var filedate = moment(this.main_all_audios[file].created_at).unix();
                           if(filedate > startdate && filedate < enddate){
                            dateRanage = true;
                           }else{
                            dateRanage = false
                           }
                        }



                        if(maininputSearch && teammates && tag && type && dateRanage){
                            data.push(this.main_all_audios[file]);
                        }



                    }
                    if(dropdown === true){
                        this.filter_dropdown = data;
                    }else{
                        this.all_audios = data;
                        this.view_table_data('Audios');
                    }
                }else if(this.activeTab == 'Videos'){
                    let data = [];
                    for(file in this.main_all_videos){
                        
                        let maininputSearch = true;
                        if(this.main_input_val.length > 0){
                            let checktitle = false;
                            let checkextension = false;
                            let checksize = false;
                            let checkdate = false;
                            let checkuploadby = false;
                            let uploadedByname = findObjForUser(this.main_all_videos[file].user_id).fullname;
                            var thisdate = moment(this.main_all_videos[file].created_at).format('DD-MM-YYYY');
                            if(this.main_all_videos[file].originalname.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1){
                                checktitle = true;
                            }

                            let file_extensionName = getChangesDataforVue(this.main_all_videos[file]).view_file_type;
                            let fileSizeCon = bytesToSize2(this.main_all_videos[file].file_size);
                            if(fileSizeCon.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checksize = true;
                            if(file_extensionName.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkextension = true;

                            if(this.main_all_videos[file].file_type.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkextension = true;
                            if(thisdate.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkdate = true;
                            if(uploadedByname.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkuploadby = true;
                            
                            if(checktitle || checkextension || checksize || checkdate || checkuploadby){
                                
                                maininputSearch = true;
                                // data.push(this.main_all_videos[file]);
                            }else{
                                maininputSearch = false;
                            }
                        }

                        let teammates = true;
                        let tag = true;
                        let type = true;
                        let dateRanage =true;

                        if(this.filtering_data.search_teammates.length > 0){
                            if(this.filtering_data.search_teammates.indexOf(this.main_all_videos[file].user_id) == -1){
                                teammates = false;
                            }
                        }
                        if(this.filtering_data.search_file_type.length > 0){
                            // let ex = this.main_all_videos[file].file_type.split('/');
                            // ex = ex[ex.length - 1];
                            let ex = getChangesDataforVue(this.main_all_videos[file]).view_file_type;
                            if(this.filtering_data.search_file_type.indexOf(ex) == -1){
                                type = false;
                            }
                        }
                        if(this.filtering_data.search_tags.length > 0){
                            if(this.main_all_videos[file].tag_list == null){
                                this.main_all_videos[file].tag_list = [];
                            }
    
                            let c = false;
                            for(tag_l in this.main_all_videos[file].tag_list){
                                if(this.filtering_data.search_tags.indexOf(this.main_all_videos[file].tag_list[tag_l]) > -1){
                                    c = true;
                                }
                            }
                            if(!c){
                                tag = false;
                            }
                        }
                        if(this.filtering_data.start_date != '' && this.filtering_data.end_date != ''){
                            // console.log(moment(val,"DD-MM-YYYY").format('DD-MM-YYYY'))
                           var startdate =  moment(this.filtering_data.start_date,"DD-MM-YYYY").unix();
                           var enddate = moment(this.filtering_data.end_date,"DD-MM-YYYY").unix();
                           var filedate = moment(this.main_all_videos[file].created_at).unix();
                           if(filedate > startdate && filedate < enddate){
                            dateRanage = true;
                           }else{
                            dateRanage = false
                           }
                        }



                        if(maininputSearch && teammates && tag && type && dateRanage){
                            data.push(this.main_all_videos[file]);
                        }



                    }
                    if(dropdown === true){
                        this.filter_dropdown = data;
                    }else{
                        this.all_videos = data;
                        this.view_table_data('Videos');
                    }
                }else if(this.activeTab == 'Docs'){
                    let data = [];
                    for(file in this.main_all_docs){
                        
                        let maininputSearch = true;
                        if(this.main_input_val.length > 0){
                            let checktitle = false;
                            let checkextension = false;
                            let checksize = false;
                            let checkdate = false;
                            let checkuploadby = false;
                            let uploadedByname = findObjForUser(this.main_all_docs[file].user_id).fullname;
                            var thisdate = moment(this.main_all_docs[file].created_at).format('DD-MM-YYYY');
                            if(this.main_all_docs[file].originalname.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1){
                                checktitle = true;
                            }

                            let file_extensionName = getChangesDataforVue(this.main_all_docs[file]).view_file_type;
                            let fileSizeCon = bytesToSize2(this.main_all_docs[file].file_size);
                            if(fileSizeCon.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checksize = true;
                            if(file_extensionName.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkextension = true;

                            if(this.main_all_docs[file].file_type.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkextension = true;
                            if(thisdate.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkdate = true;
                            if(uploadedByname.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkuploadby = true;
                            
                            if(checktitle || checkextension || checksize || checkdate || checkuploadby){
                                
                                maininputSearch = true;
                                // data.push(this.main_all_docs[file]);
                            }else{
                                maininputSearch = false;
                            }
                        }

                        let teammates = true;
                        let tag = true;
                        let type = true;
                        let dateRanage =true;

                        if(this.filtering_data.search_teammates.length > 0){
                            if(this.filtering_data.search_teammates.indexOf(this.main_all_docs[file].user_id) == -1){
                                teammates = false;
                            }
                        }
                        if(this.filtering_data.search_file_type.length > 0){
                            // let ex = this.main_all_docs[file].file_type.split('/');
                            // ex = ex[ex.length - 1];
                            let ex = getChangesDataforVue(this.main_all_docs[file]).view_file_type;
                            if(this.filtering_data.search_file_type.indexOf(ex) == -1){
                                type = false;
                            }
                        }
                        if(this.filtering_data.search_tags.length > 0){
                            if(this.main_all_docs[file].tag_list == null){
                                this.main_all_docs[file].tag_list = [];
                            }
    
                            let c = false;
                            for(tag_l in this.main_all_docs[file].tag_list){
                                if(this.filtering_data.search_tags.indexOf(this.main_all_docs[file].tag_list[tag_l]) > -1){
                                    c = true;
                                }
                            }
                            if(!c){
                                tag = false;
                            }
                        }
                        if(this.filtering_data.start_date != '' && this.filtering_data.end_date != ''){
                            // console.log(moment(val,"DD-MM-YYYY").format('DD-MM-YYYY'))
                           var startdate =  moment(this.filtering_data.start_date,"DD-MM-YYYY").unix();
                           var enddate = moment(this.filtering_data.end_date,"DD-MM-YYYY").unix();
                           var filedate = moment(this.main_all_docs[file].created_at).unix();
                           if(filedate > startdate && filedate < enddate){
                            dateRanage = true;
                           }else{
                            dateRanage = false
                           }
                        }



                        if(maininputSearch && teammates && tag && type && dateRanage){
                            data.push(this.main_all_docs[file]);
                        }



                    }
                    if(dropdown === true){
                        this.filter_dropdown = data;
                    }else{
                        this.all_docs = data;
                        this.view_table_data('Docs');
                    }
                }else if(this.activeTab == 'All Links'){
                    let data = [];
                    let maininputSearch = true;
                    for(file in this.main_all_links){
                        if(this.main_input_val.length > 0){

                            let checktitle = false;
                            let checkurl = false;
                            let checkdate = false;
                            let checkuploadby = false;
                            let uploadedByname = findObjForUser(this.main_all_links[file].user_id).fullname;
                            var thisdate = moment(this.main_all_links[file].created_at).format('DD-MM-YYYY');
    
    
                            if(uploadedByname == undefined || uploadedByname == '' ) uploadedByname = 'null';
                            if(this.main_all_links[file].url == null) this.main_all_links[file].url = 'null';
                            if(this.main_all_links[file].title == null) this.main_all_links[file].title = 'null';
                            if(this.main_all_links[file].title.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checktitle = true;
                                
                            if(this.main_all_links[file].url.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkurl = true;
                                
                            if(thisdate.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkdate = true;
    
                            if(uploadedByname.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkuploadby = true;
    
                            if(checktitle || checkurl || checkdate || checkuploadby){
                                maininputSearch = true;
                                // data.push(this.main_all_links[file]);
                            }else{
                                maininputSearch = false;
                            }
                        }
                        let dateRanage = true;
                        if(this.filtering_data.start_date != '' && this.filtering_data.end_date != ''){
                            // console.log(moment(val,"DD-MM-YYYY").format('DD-MM-YYYY'))
                           var startdate =  moment(this.filtering_data.start_date,"DD-MM-YYYY").unix();
                           var enddate = moment(this.filtering_data.end_date,"DD-MM-YYYY").unix();
                           var filedate = moment(this.main_all_links[file].created_at).unix();
                           if(filedate > startdate && filedate < enddate){
                            dateRanage = true;
                           }else{
                            dateRanage = false
                           }
                        }
                        if(maininputSearch && dateRanage){
                            data.push(this.main_all_links[file]);
                        }

                    }
                    if(dropdown === true){
                        this.filter_dropdown = data;
                    }else{
                        this.all_links = data;
                        this.view_table_data('All Links');
                    }
                    
                }else if(this.activeTab == 'Personal Files'){
                    let data = [];
                    for(file in this.main_all_personal_data){
                        
                        let maininputSearch = true;
                        if(this.main_input_val.length > 0){
                            let checktitle = false;
                            let checkextension = false;
                            let checksize = false;
                            let checkdate = false;
                            let checkuploadby = false;
                            let uploadedByname = findObjForUser(this.main_all_personal_data[file].user_id).fullname;
                            var thisdate = moment(this.main_all_personal_data[file].created_at).format('DD-MM-YYYY');
                            if(this.main_all_personal_data[file].originalname.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1){
                                checktitle = true;
                            }

                            let file_extensionName = getChangesDataforVue(this.main_all_personal_data[file]).view_file_type;
                            let fileSizeCon = bytesToSize2(this.main_all_personal_data[file].file_size);
                            if(fileSizeCon.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checksize = true;
                            if(file_extensionName.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkextension = true;

                            if(this.main_all_personal_data[file].file_type.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkextension = true;
                            if(thisdate.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkdate = true;
                            if(uploadedByname.toLowerCase().indexOf(this.main_input_val.toLowerCase()) > -1) checkuploadby = true;
                            
                            if(checktitle || checkextension || checksize || checkdate || checkuploadby){
                                
                                maininputSearch = true;
                                // data.push(this.main_all_personal_data[file]);
                            }else{
                                maininputSearch = false;
                            }
                        }

                        let teammates = true;
                        let tag = true;
                        let type = true;
                        let dateRanage =true;

                        if(this.filtering_data.search_teammates.length > 0){
                            if(this.filtering_data.search_teammates.indexOf(this.main_all_personal_data[file].user_id) == -1){
                                teammates = false;
                            }
                        }
                        if(this.filtering_data.search_file_type.length > 0){
                            // let ex = this.main_all_personal_data[file].file_type.split('/');
                            // ex = ex[ex.length - 1];
                            let ex = getChangesDataforVue(this.main_all_personal_data[file]).view_file_type;
                            if(this.filtering_data.search_file_type.indexOf(ex) == -1){
                                type = false;
                            }
                        }
                        if(this.filtering_data.search_tags.length > 0){
                            if(this.main_all_personal_data[file].tag_list == null){
                                this.main_all_personal_data[file].tag_list = [];
                            }
    
                            let c = false;
                            for(tag_l in this.main_all_personal_data[file].tag_list){
                                if(this.filtering_data.search_tags.indexOf(this.main_all_personal_data[file].tag_list[tag_l]) > -1){
                                    c = true;
                                }
                            }
                            if(!c){
                                tag = false;
                            }
                        }
                        if(this.filtering_data.start_date != '' && this.filtering_data.end_date != ''){
                            // console.log(moment(val,"DD-MM-YYYY").format('DD-MM-YYYY'))
                           var startdate =  moment(this.filtering_data.start_date,"DD-MM-YYYY").unix();
                           var enddate = moment(this.filtering_data.end_date,"DD-MM-YYYY").unix();
                           var filedate = moment(this.main_all_personal_data[file].created_at).unix();
                           if(filedate > startdate && filedate < enddate){
                            dateRanage = true;
                           }else{
                            dateRanage = false
                           }
                        }



                        if(maininputSearch && teammates && tag && type && dateRanage){
                            data.push(this.main_all_personal_data[file]);
                        }



                    }
                    if(dropdown === true){
                        this.filter_dropdown = data;
                    }else{
                        this.all_personal_data = data;
                        this.view_table_data('Personal Files');
                    }
                }
            // }else{
            //     this.clearMainSearch();
            // }
            if(dropdown === true){
                this.dropdown_search = 'active';
            }else{
                this.dropdown_search = 'inactive';
                this.filter_dropdown = [];
                this.$refs.main_search_in.focus();
                if(!this.resetAction){
    
                    this.advance_filer = 'inactive';
                    
                }else{
                    this.resetAction = false;
                }
            }
            // Search for: Deck | Uploaded by: Elaine McCreary / Amer / Sadeq | Tag: jkjkljk | Date: 21-Feb-2021 - 14-Apr-2021
            let filterd_text = '';
                console.log(1066,this.main_input_val)
                if(this.main_input_val !== ''){
                    filterd_text = 'Search for: '+this.main_input_val+ ' | ';
                }
                if(this.filtering_data.search_teammates.length > 0){
                    let username  = 'Uploaded by: ';
                    for(user in this.filtering_data.search_teammates ){
                        username += findObjForUser(this.filtering_data.search_teammates[user]).fullname;
                        if(user == (this.filtering_data.search_teammates.length - 1)){
                            username += ' ';
                        }else{
                            username += ' / ';
                        }
                    }
                    filterd_text += username + ' | ';
                }
                if(this.table_view_cate == 'files'){
                    if(this.filtering_data.search_file_type.length > 0){
                        let username  = 'Tag: ';
                        for(user in this.filtering_data.search_tags ){
                            username += findObjFortag(this.filtering_data.search_tags[user],this.all_tags).title;
                            if(user == (this.filtering_data.search_tags.length - 1)){
                                username += ' ';
                            }else{
                                username += ' / ';
                            }
                        }
                        filterd_text += username + ' | ';
                    }

                    if(this.filtering_data.search_file_type.length > 0){
                        let username  = 'File type: ';
                        for(user in this.filtering_data.search_file_type ){
                            username += this.filtering_data.search_file_type[user]
                            if(user == (this.filtering_data.search_file_type.length - 1)){
                                username += ' ';
                            }else{
                                username += ' / ';
                            }
                        }
                        filterd_text += username + ' | ' ;
                    }
                    
                } 

                if(this.filtering_data.start_date != '' && this.filtering_data.end_date != ''){
                    filterd_text += 'Date: '+this.filtering_data.start_date+' to '+ this.filtering_data.end_date;
                }
            this.filtering_data.filtered_text = filterd_text;
        },
        nextPage(){
            this.pagination_Mathod('next')
            
        },
        prevPage(){
            this.pagination_Mathod('prev')
        },
        goKeyupfun(e,val){
            val = Number(val);
            if(isInt(val) && (val <= this.pagination_data.total_page) ){
                this.pagination_data.go_input = val;
            }else{
                this.pagination_data.go_input = 0;
            }
            if(e.keyCode == 13){
                this.pagination_Mathod('go');
            }
        },
        goPage(){
            this.pagination_Mathod('go');

        },
        pagination_Mathod(type){
            if(type == 'next'){
                var myNextFiles_start = ((this.show_page_size * this.pagination_data.next_page) - this.show_page_size) + 1;
            }else if(type == 'go'){
                if(this.pagination_data.go_input == 0){
                    this.pagination_data.go_input = 1;
                }
                var myNextFiles_start = ((this.show_page_size * this.pagination_data.go_input) - this.show_page_size) + 1;
                this.dropdown.isActiveForPages = false;
            }else if(type == 'prev'){
                var myNextFiles_start = ((this.show_page_size * this.pagination_data.prev_page) - this.show_page_size) + 1;
            }
            if(type !== 'home'){
                if(this.activeTab == 'All Files'){
                    let data = [];
                    for(file in this.all_files){
                        if((file > myNextFiles_start) && (file <= myNextFiles_start+this.show_page_size)){
                            // data.push(this.all_files[file]);
                            data.push(getChangesDataforVue(this.all_files[file]));
                        }
                    }
                    this.show_tlb_data = data;
                    // pagination script
                    this.pagination_data.total_data = this.all_files.length;
                }else if(this.activeTab == 'Images'){
                    let data = [];
                    for(file in this.all_images){
                        if((file > myNextFiles_start) && (file <= myNextFiles_start+this.show_page_size)){
                            data.push(getChangesDataforVue(this.all_images[file]));
                        }
                    }
                    this.show_tlb_data = data;
                    // pagination script
                    this.pagination_data.total_data = this.all_images.length;
                }else if(this.activeTab == 'Audios'){
                    let data = [];
                    for(file in this.all_audios){
                        if((file > myNextFiles_start) && (file <= myNextFiles_start+this.show_page_size)){
                            data.push(getChangesDataforVue(this.all_audios[file]));
                        }
                    }
                    this.show_tlb_data = data;
                    // pagination script
                    this.pagination_data.total_data = this.all_audios.length;
                }else if(this.activeTab == 'Videos'){
                    let data = [];
                    for(file in this.all_videos){
                        if((file > myNextFiles_start) && (file <= myNextFiles_start+this.show_page_size)){
                            data.push(getChangesDataforVue(this.all_videos[file]));
                        }
                    }
                    this.show_tlb_data = data;
                    // pagination script
                    this.pagination_data.total_data = this.all_videos.length;
                }else if(this.activeTab == 'Docs'){
                    let data = [];
                    for(file in this.all_docs){
                        if((file > myNextFiles_start) && (file <= myNextFiles_start+this.show_page_size)){
                            data.push(getChangesDataforVue(this.all_docs[file]));
                        }
                    }
                    this.show_tlb_data = data;
                    // pagination script
                    this.pagination_data.total_data = this.all_docs.length;
                }else if(this.activeTab == 'All Links'){
                    let data = [];
                    for(file in this.all_links){
                        if((file > myNextFiles_start) && (file <= myNextFiles_start+this.show_page_size)){
                            data.push(getChangesDataforVueLinks(this.all_links[file]));
                        }
                    }
                    this.show_tlb_data = data;
                    // pagination script
                    this.pagination_data.total_data = this.all_links.length;
                }else if(this.activeTab == 'Personal Files'){
                    let data = [];
                    for(file in this.all_personal_data){
                        if((file > myNextFiles_start) && (file <= myNextFiles_start+this.show_page_size)){
                            data.push(getChangesDataforVue(this.all_personal_data[file]));
                        }
                    }
                    this.show_tlb_data = data;
                    // pagination script
                    this.pagination_data.total_data = this.all_personal_data.length;
                }
            }
            var n = this.pagination_data.total_data / this.show_page_size
            if(isFloat(n)){

                this.pagination_data.total_page = Math.ceil(n);
            }else{
                this.pagination_data.total_page = n;
            }
            if(type == 'next'){
                this.pagination_data.current_page = this.pagination_data.current_page + 1;
            }else if(type == 'home'){
                this.pagination_data.current_page = 1;
            }else if(type == 'go'){
                this.pagination_data.current_page = this.pagination_data.go_input;
            }else if(type == 'prev'){
                this.pagination_data.current_page = this.pagination_data.current_page - 1;
            }
            if(this.pagination_data.total_page > this.pagination_data.current_page){
                this.pagination_data.next_page = (this.pagination_data.current_page + 1)
            }else{
                this.pagination_data.next_page = 0;
            }
            if(this.pagination_data.total_page >= this.pagination_data.current_page){
                this.pagination_data.prev_page = (this.pagination_data.current_page - 1)
            }else{
                this.pagination_data.prev_page = 0;
            }
            this.pagination_data.pagitext = this.pagination_data.current_page + ' / ' + this.pagination_data.total_page; 
        },
        view_table_data(type){
            if(type == 'All Files'){
                this.table_view_cate = 'files';
                let data = [];
                let file_types = [];
                for(file in this.all_files){
                    if(file < this.show_page_size){
                        data.push(getChangesDataforVue(this.all_files[file]));
                    }
                }
                for(file in this.main_all_files){
                    if(file_types.indexOf(getChangesDataforVue(this.main_all_files[file]).view_file_type) == -1){
                        file_types.push(getChangesDataforVue(this.main_all_files[file]).view_file_type)
                    }
                }
                this.show_tlb_data = data;
                this.all_file_types = file_types;
                this.filter_file_types = file_types;
                // pagination script
                this.pagination_data.total_data = this.all_files.length;
            }else if(type == 'Images'){
                this.table_view_cate = 'files';
                let data = [];
                let file_types = [];
                for(file in this.all_images){
                    if(file < this.show_page_size){
                        data.push(getChangesDataforVue(this.all_images[file]));
                    }
                    if(file_types.indexOf(getChangesDataforVue(this.all_images[file]).view_file_type) == -1){
                        file_types.push(getChangesDataforVue(this.all_images[file]).view_file_type)
                    }
                }
                this.show_tlb_data = data;
                this.all_file_types = file_types;
                this.filter_file_types = file_types;
                // pagination script
                this.pagination_data.total_data = this.all_images.length;
            }else if(type == 'Audios'){
                this.table_view_cate = 'files';
                let data = [];
                let file_types = [];
                for(file in this.all_audios){
                    if(file < this.show_page_size){
                        data.push(getChangesDataforVue(this.all_audios[file]));
                    }
                    if(file_types.indexOf(getChangesDataforVue(this.all_audios[file]).view_file_type) == -1){
                        file_types.push(getChangesDataforVue(this.all_audios[file]).view_file_type)
                    }
                }
                this.show_tlb_data = data;
                this.all_file_types = file_types;
                this.filter_file_types = file_types;
                // pagination script
                this.pagination_data.total_data = this.all_audios.length;
            }else if(type == 'Videos'){
                this.table_view_cate = 'files';
                let data = [];
                let file_types = [];
                for(file in this.all_videos){
                    if(file < this.show_page_size){
                        data.push(getChangesDataforVue(this.all_videos[file]));
                    }
                    if(file_types.indexOf(getChangesDataforVue(this.all_videos[file]).view_file_type) == -1){
                        file_types.push(getChangesDataforVue(this.all_videos[file]).view_file_type)
                    }
                }
                this.show_tlb_data = data;
                this.all_file_types = file_types;
                this.filter_file_types = file_types;
                // pagination script
                this.pagination_data.total_data = this.all_videos.length;
            }else if(type == 'Docs'){
                this.table_view_cate = 'files';
                let data = [];
                let file_types = [];
                for(file in this.all_docs){
                    if(file < this.show_page_size){
                        data.push(getChangesDataforVue(this.all_docs[file]));
                    }
                    if(file_types.indexOf(getChangesDataforVue(this.all_docs[file]).view_file_type) == -1){
                        file_types.push(getChangesDataforVue(this.all_docs[file]).view_file_type)
                    }
                }
                this.show_tlb_data = data;
                this.all_file_types = file_types;
                this.filter_file_types = file_types;
                // pagination script
                this.pagination_data.total_data = this.all_docs.length;
            }else if(type == 'All Links'){
                this.table_view_cate = 'links';
                let data = [];
                for(file in this.all_links){
                    if(file < this.show_page_size){
                        data.push(getChangesDataforVueLinks(this.all_links[file]));
                    }
                }
                this.show_tlb_data = data;
                this.all_file_types = [];
                this.filter_file_types = [];
                // pagination script
                this.pagination_data.total_data = this.all_links.length;
            }else if(type == 'Personal Files'){
                this.table_view_cate = 'files';
                let data = [];
                let file_types = [];
                for(file in this.all_personal_data){
                    if(file < this.show_page_size){
                        data.push(getChangesDataforVue(this.all_personal_data[file]));
                    }
                    if(file_types.indexOf(getChangesDataforVue(this.all_personal_data[file]).view_file_type) == -1){
                        file_types.push(getChangesDataforVue(this.all_personal_data[file]).view_file_type)
                    }
                }
                this.show_tlb_data = data;
                this.all_file_types = file_types;
                this.filter_file_types = file_types;
                // pagination script
                this.pagination_data.total_data = this.all_personal_data.length;
            }
            this.pagination_Mathod('home');
        },
        selectTemmates(e){
            let value = e.target.getAttribute('data-value');
            if(this.filtering_data.search_teammates.indexOf(value) == -1){
                this.filtering_data.search_teammates.push(value);
                if(this.filtering_data.search_teammates.length == this.users.length){
                    this.dropdown.isActiveForTeammates = false;
                }
            }else{
                removeA(this.filtering_data.search_teammates,value);
            }
            this.$refs.teammate_input.focus();
        },
        selectTagFilter(e){
            let value = e.target.getAttribute('data-value');
            if(this.filtering_data.search_tags.indexOf(value) == -1){
                this.filtering_data.search_tags.push(value);
                if(this.filtering_data.search_tags.length == this.all_tags.length){
                    this.dropdown.isActiveForTags = false;
                }
            }else{
                removeA(this.filtering_data.search_tags,value);
            }
            this.$refs.tags_search_input.focus();
            
        },
        selectFileType(e){
            
            let value = e.target.getAttribute('data-value');
            if(this.filtering_data.search_file_type.indexOf(value) == -1){
                this.filtering_data.search_file_type.push(value);
            }else{
                removeA(this.filtering_data.search_file_type,value);
            }
            this.$refs.file_type_input.focus();
        },
        showTeammates(){
            this.dropdown.isActiveForTags = false;
            this.dropdown.isActiveForFileTypes = false;
            this.dropdown.isActiveForPages = false;
            this.dropdown.isActiveForTeammates = true; 
            this.filter_teammates = this.getTeammatesForFile();
        },
        hideTeammates() {
            this.dropdown.isActiveForTeammates = false;
            this.dropdown.isActiveForTags = false;
            this.dropdown.isActiveForFileTypes = false;
        },   
        hideAdvanceFilter(e) {
            if(this.advance_filer !== 'active'){
                this.$refs.main_search_in.focus();
            }
            if($(e.target).parents('.flatpickr-calendar').length == 0 ){
                if(e.target.tagName !== 'BODY'){
                    this.advance_filer = 'inactive';
                }
            }
        },   
        showTagsDrop(){
            this.dropdown.isActiveForTeammates = false;
            this.dropdown.isActiveForFileTypes = false;
            this.dropdown.isActiveForPages = false;
            this.dropdown.isActiveForTags = true; 
            this.filter_tags = this.getOnlyFilesTag();


        },
        hideTagsDrop() {
            this.dropdown.isActiveForTags = false;
            this.dropdown.isActiveForTeammates = false;
            this.dropdown.isActiveForFileTypes = false;
        },   
        showFileType(){
            this.dropdown.isActiveForTeammates = false;
            this.dropdown.isActiveForTags = false; 
            this.dropdown.isActiveForFileTypes = true; 
        },
        hideFileType() {
            this.dropdown.isActiveForTags = false;
            this.dropdown.isActiveForTeammates = false;
            this.dropdown.isActiveForFileTypes = false;
        },
        showPages(){
            if(this.dropdown.isActiveForPages){
                this.dropdown.isActiveForPages = false;
            }else{

                this.dropdown.isActiveForPages = true;

                setTimeout(function(){
                    this.$refs.go_btn_input.focus();
                }.bind(this),10);
            }
        },
        hidePages() {
            this.dropdown.isActiveForPages = false;
        },
        filterStartDate(e,val){
            this.filtering_data.start_date = val;
            if(this.filtering_data.end_date != ''){
                if(moment(val,"DD-MM-YYYY").format('DD-MM-YYYY') > moment(this.filtering_data.end_date,"DD-MM-YYYY").format('DD-MM-YYYY') ){
                        this.filtering_data.end_date = '';
                }
            }
            console.log(moment(val,"DD-MM-YYYY").format('DD-MM-YYYY'))
        },
        filterEndDate(e,val){
            this.filtering_data.end_date = val;
            if(this.filtering_data.start_date != ''){
                if(moment(this.filtering_data.start_date,"DD-MM-YYYY").format('DD-MM-YYYY') > moment(this.filtering_data.end_date,"DD-MM-YYYY").format('DD-MM-YYYY') ){
                        // this.filtering_data.start_date = '';
                }
            }
        },
        vueSorting(type){
            let order = 'desc';
            this.sorting_active_red = type;
            if(this.sorting_active == type){
                this.sorting_active = '';
                order = 'desc';
            }else{
                this.sorting_active = type;
                order = 'asc';
            }
            var compare = 'view_originalname';
            switch(type) {
                case 'file_name':
                    compare = 'view_originalname';
                  break;
                case 'file_extension':
                    compare = 'view_file_type';
                  break;
                case 'date':
                    compare = 'created_at';
                  break;
                case 'file_size':
                    compare = 'file_size';
                  break;
                case 'uploaded_by':
                    compare = 'view_sender_name';
                  break;
                case 'room_name':
                    compare = 'view_conv_name';
                  break;
                case 'link_title':
                    compare = 'title';
                  break;
                case 'url':
                    compare = 'url';
                  break;
                default:
                    compare = 'view_originalname';
                } 
                // if(compare == 'url' || compare == 'link_title'){

                // }else{
                    this.all_links  = this.all_links.sort(compareValues(compare, order));
                    this.main_all_links  = this.main_all_links.sort(compareValues(compare, order));
                    this.all_files  = this.all_files.sort(compareValues(compare, order));
                    this.all_images  = this.all_images.sort(compareValues(compare, order));
                    this.all_audios  = this.all_audios.sort(compareValues(compare, order));
                    this.all_videos  = this.all_videos.sort(compareValues(compare, order));
                    this.all_docs  = this.all_docs.sort(compareValues(compare, order));
                    this.all_personal_data  = this.all_personal_data.sort(compareValues(compare, order));
                    this.main_all_files  = this.main_all_files.sort(compareValues(compare, order));
                    this.main_all_images  = this.main_all_images.sort(compareValues(compare, order));
                    this.main_all_audios  = this.main_all_audios.sort(compareValues(compare, order));
                    this.main_all_videos  = this.main_all_videos.sort(compareValues(compare, order));
                    this.main_all_docs  = this.main_all_docs.sort(compareValues(compare, order));
                    this.main_all_personal_data  = this.main_all_personal_data.sort(compareValues(compare, order));

                // }
                this.pagination_data.go_input = this.pagination_data.current_page;
                this.pagination_Mathod('go');
                // this.show_tlb_data =  this.show_tlb_data.sort(compareValues(compare, order));
            },
        optionShowing(e){
            this.show_page_size = Number(e.target.value);
            this.FilesFilterFun();
            this.dropdown_search = 'inactive';
            this.filter_dropdown = [];

        },
        selectfileFun(e){
            // console.log
            if(e == 'all'){
                if(this.selected_filesAll){
                    this.selected_filesAll = false;
    
                    for(var d of this.show_tlb_data){
                        // console.log(d)
                        removeA(this.selected_files,d.id);
                    }

                }else{
                    this.selected_filesAll = true;
    
                    for(var d of this.show_tlb_data){
                        // console.log(d)
                        this.selected_files.push(d.id)
                    }
                }

            }else{
                let val = e.target.getAttribute('data-id');
                let val2 = e.target.getAttribute('full_url');
                if(this.selected_files.indexOf(val) > -1){
                    removeA(this.selected_files,val);
                    removeA(this.selected_files_urls,val2);
                    this.selected_filesAll = false;
                }else{
                    this.selected_files.push(val);
                    this.selected_files_urls.push(val2);
                }
            }
        },
        downloadFiles(){
            downloadFilesMany(this.selected_files_urls)
            this.selected_files = [];
            this.selected_files_urls = [];
            
        },
        clearVueFun(type){
            if(type == 'selected_files'){
                this.selected_files = [];
                this.selected_files_urls = [];
            }
        },
        singleFileDownload(e){
            var filename = e.target.getAttribute('file-name');
            var url = e.target.getAttribute('data-href');
            
            downloaOneFile(url,filename)
        },
        getTeammatesForFile(){
            var d = [];
            if(this.activeTab == 'All Files'){
                for(f in this.main_all_files){
                    let u = this.main_all_files[f].user_id
                    if(d.indexOf(u) == -1){
                        d.push(u);
                    }
                }
                
            }else if(this.activeTab == 'Images'){
                for(f in this.main_all_images){
                    let u = this.main_all_images[f].user_id
                    if(d.indexOf(u) == -1){
                        d.push(u);
                    }
                }
            }else if(this.activeTab == 'Audios'){
                for(f in this.main_all_audios){
                    let u = this.main_all_audios[f].user_id
                    if(d.indexOf(u) == -1){
                        d.push(u);
                    }
                }
            }else if(this.activeTab == 'Videos'){
                for(f in this.main_all_videos){
                    let u = this.main_all_videos[f].user_id
                    if(d.indexOf(u) == -1){
                        d.push(u);
                    }
                }
            }else if(this.activeTab == 'Docs'){
                for(f in this.main_all_docs){
                    let u = this.main_all_docs[f].user_id
                    if(d.indexOf(u) == -1){
                        d.push(u);
                    }
                }
            }else if(this.activeTab == 'All Links'){
                for(f in this.main_all_links){
                    let u = this.main_all_links[f].user_id
                    if(d.indexOf(u) == -1){
                        d.push(u);
                    }
                }
            }else if(this.activeTab == 'Personal Files'){
                for(f in this.main_all_personal_data){
                    let u = this.main_all_personal_data[f].user_id
                    if(d.indexOf(u) == -1){
                        d.push(u);
                    }
                }
            }
            let r = [];
            for(u in this.users){
                if(d.indexOf(this.users[u].id) > -1){
                    r.push(this.users[u]);
                }
            }
            return r;
        },
        getOnlyFilesTag(){
            var d = [];
            if(this.activeTab == 'All Files'){
                for(f in this.main_all_files){
                    let u = this.main_all_files[f].tag_list;
                    if(u == null) u = [];

                    for(t in u){
                        if(d.indexOf(u[t]) == -1){
                            d.push(u[t]);
                        }
                    }
                }
                
            }else if(this.activeTab == 'Images'){
                for(f in this.main_all_images){
                    let u = this.main_all_images[f].tag_list
                    if(u == null) u = [];

                    for(t in u){
                        if(d.indexOf(u[t]) == -1){
                            d.push(u[t]);
                        }
                    }
                }
            }else if(this.activeTab == 'Audios'){
                for(f in this.main_all_audios){
                    let u = this.main_all_audios[f].tag_list;
                    if(u == null) u = [];

                    for(t in u){
                        if(d.indexOf(u[t]) == -1){
                            d.push(u[t]);
                        }
                    }
                }
            }else if(this.activeTab == 'Videos'){
                for(f in this.main_all_videos){
                    let u = this.main_all_videos[f].tag_list;
                    if(u == null) u = [];

                    for(t in u){
                        if(d.indexOf(u[t]) == -1){
                            d.push(u[t]);
                        }
                    }
                }
            }else if(this.activeTab == 'Docs'){
                for(f in this.main_all_docs){
                    let u = this.main_all_docs[f].tag_list;
                    if(u == null) u = [];

                    for(t in u){
                        if(d.indexOf(u[t]) == -1){
                            d.push(u[t]);
                        }
                    }
                }
            }else if(this.activeTab == 'Personal Files'){
                for(f in this.main_all_personal_data){
                    let u = this.main_all_personal_data[f].tag_list;
                    if(u == null) u = [];

                    for(t in u){
                        if(d.indexOf(u[t]) == -1){
                            d.push(u[t]);
                        }
                    }
                }
            }
            let r = [];
            for(u in this.all_tags){
                if(d.indexOf(this.all_tags[u].tag_id) > -1){
                    r.push(this.all_tags[u]);
                }
            }
            return r;
        },
        cleardate(type){
            if(type == 'start'){
                this.filtering_data.start_date = '';
            }else{
                this.filtering_data.end_date = '';
            }
        },
        triggerFun(refbtn){
            this.$refs.filter_startDate.click()
        },
        showFiles(file_id){
            this.image_view = true;
            if(this.activeTab == 'Images'){
                showImageSlider(this.main_all_images,file_id);
            }else if(this.activeTab == 'Personal Files'){
                var allImages = [];
                var thisData = null;
                for(f in this.main_all_personal_data){
                    if(this.main_all_personal_data[f].id == file_id){
                        thisData = this.main_all_personal_data[f];
                    }
                    if(this.main_all_personal_data[f].file_type.indexOf('image') > -1){
                        allImages.push(this.main_all_personal_data[f]);
                    }
                }
                if(thisData.file_type.indexOf('image') > -1){
                    showImageSlider(allImages,file_id);
                }else{
                    var filename = thisData.originalname;
                    var url = file_server+thisData.location;
                    downloaOneFile(url,filename);
                }
            }else{
                var allImages = [];
                var thisData = null;
                for(f in this.main_all_files){
                    if(this.main_all_files[f].id == file_id){
                        thisData = this.main_all_files[f];
                    }
                    if(this.main_all_files[f].file_type.indexOf('image') > -1){
                        allImages.push(this.main_all_files[f]);
                    }
                }
                if(thisData.file_type.indexOf('image') > -1){
                    showImageSlider(allImages,file_id);
                }else{
                    var filename = thisData.originalname;
                    var url = file_server+thisData.location;
                    downloaOneFile(url,filename);
                }

            }
        },
        deleteFile(){

            for(file in this.main_all_files){
                if(this.main_all_files[file].id == this.delete_ready_file_id){

                    var msgid = this.main_all_files[file].msg_id;
                    var location = [this.main_all_files[file].location];
                    var type = this.main_all_files[file].file_type.split('/');
                    type = type[type.length - 2];
                    switch (type) {
                        case "image":
                            var files = { "imgfile": location };
                            break;
                        case "video":
                            var files = { "videofile": location };
                            break;
                        case "audio":
                            var files = { "audiofile": location };
                            break;
                        default :
                            var files = { "otherfile": location };
                            break;
                    }
        
                    socket.emit("delete_attach", { msgid, attach_files: files, need_id: true, type: type }, (res) => {
                        // console.log(1615, res);
                        if (res.status) {
                            var filename_for_unlink = location[0];
                            var bucket_name = filename_for_unlink.substring(0, filename_for_unlink.indexOf("/"));
                            var attch_list = JSON.stringify([filename_for_unlink.substring(filename_for_unlink.indexOf("/") + 1)]);
                            $.ajax({
                                url: "/s3Local/deleteObjects",
                                type: "POST",
                                data: { bucket_name, attch_list },
                                dataType: 'json',
                                beforeSend: function () {
                                    console.log(1683, bucket_name, attch_list);
                                },
                                success: function (res) {
                                    console.log(location[0],$('tr[data-location="'+location[0]+'"]'))
                                    $('tr[data-location="'+location[0]+'"]').remove();
                                    console.log("Unlink successfully", res);
                                },
                                error: function (e) {
                                    console.log("Error in unlink: ", e);
                                }
                            });
                        }
                    });
                    this.$delete(this.main_all_files, file);
                    break;
                }
            }
            for(file in this.all_files){
                if(this.all_files[file].id == this.delete_ready_file_id){
                    this.$delete(this.all_files, file);
                    break;
                }
            }
            for(file in this.all_images){
                if(this.all_images[file].id == this.delete_ready_file_id){
                    this.$delete(this.all_images, file);
                    break;
                }
            }
            for(file in this.all_audios){
                if(this.all_audios[file].id == this.delete_ready_file_id){
                    this.$delete(this.all_audios, file);
                    break;
                }
            }
            for(file in this.all_videos){
                if(this.all_videos[file].id == this.delete_ready_file_id){
                    this.$delete(this.all_videos, file);
                    break;
                }
            }
            for(file in this.all_docs){
                if(this.all_docs[file].id == this.delete_ready_file_id){
                    this.$delete(this.all_docs, file);
                    break;
                }
            }
            for(file in this.all_personal_data){
                if(this.all_personal_data[file].id == this.delete_ready_file_id){
                    this.$delete(this.all_personal_data, file);
                    break;
                }
            }
            for(file in this.main_all_images){
                if(this.main_all_images[file].id == this.delete_ready_file_id){
                    this.$delete(this.main_all_images, file);
                    break;
                }
            }
            for(file in this.main_all_audios){
                if(this.main_all_audios[file].id == this.delete_ready_file_id){
                    this.$delete(this.main_all_audios, file);
                    break;
                }
            }
            for(file in this.main_all_videos){
                if(this.main_all_videos[file].id == this.delete_ready_file_id){
                    this.$delete(this.main_all_videos, file);
                    break;
                }
            }
            for(file in this.main_all_docs){
                if(this.main_all_docs[file].id == this.delete_ready_file_id){
                    this.$delete(this.main_all_docs, file);
                    break;
                }
            }
            for(file in this.main_all_personal_data){
                if(this.main_all_personal_data[file].id == this.delete_ready_file_id){
                    this.$delete(this.main_all_personal_data, file);
                    break;
                }
            }
            for(file in this.show_tlb_data){
                if(this.show_tlb_data[file].id == this.delete_ready_file_id){
                    this.$delete(this.show_tlb_data, file);
                    break;
                }
            }
            var allCheckedFiles = getAllcheckedFiles(this.main_all_files);
            this.files_counter.all_files = '('+ allCheckedFiles.allFilesData.length+')';
            this.files_counter.images = '('+allCheckedFiles.allMediaImg.length+')';
            this.files_counter.videos = '('+allCheckedFiles.allMediaVideo.length+')';
            this.files_counter.audios = '('+allCheckedFiles.allMediaAudio.length+')';
            this.files_counter.docs = '('+allCheckedFiles.allMediaOthers.length+')';


            this.show_backwrap = false;
            this.backwrap_type = '';
            this.delete_ready_file_id = '';
        },
        showPop(e,type){
            this.show_backwrap = true;
            this.backwrap_type = type;
            if(type == 'delete_file'){
                this.delete_ready_file_id = e.target.getAttribute('file-id');
            }else if(type == 'share_link'){
                this.shared_linkKey = e.target.getAttribute('file-id');
                var value = '';
                if(this.activeTab == 'All Links'){
                    this.full_link_share = this.shared_linkKey;
                    this.no_link_found = false;
                    this.created_link =  this.shared_linkKey;
                    this.$refs.shareable_link.focus();
                    document.execCommand('selectAll', false, null);
                    document.execCommand("copy");
                    this.shareUniq = '';

                }else{

                    for(file in this.main_all_files){
                        if(this.main_all_files[file].key == this.shared_linkKey){
                            value = file_server + this.main_all_files[file].location;
                        }
                    }
                    this.full_link_share = value;
                    
    
                    if(this.shared_files.indexOf(this.shared_linkKey) > -1){
                        this.no_link_found = false;
                        socket.emit('SetURLshorten',{link:value,type:'single',user_id:user_id},function(res){
                            this.shareUniq = res.data;
                           this.created_link =  mywindowUrl+'/url/'+res.data;
                           setTimeout(function(){
                                this.$refs.shareable_link.focus();
                                document.execCommand('selectAll', false, null);
                                document.execCommand("copy");
                            }.bind(this),10)
                        }.bind(this));
                    }else{
                        this.no_link_found = true;
                    }
                }

            }else if(type == 'custom_title'){
                this.for_custom_title.id = e.target.getAttribute('data-id');
                if(e.target.getAttribute('custom-title') != 'null' && e.target.getAttribute('custom-title') != 'No Title'){
                    this.for_custom_title.custom_title = e.target.getAttribute('custom-title');
                }
                this.for_custom_title.original_name = e.target.getAttribute('originalname');
                var originalname = this.for_custom_title.original_name.split('.');
                    originalname = originalname[0];
                if(originalname == this.for_custom_title.custom_title){
                    this.for_custom_title.custom_title = '';
                }
                setTimeout(function(){

                    this.$refs.custom_title.focus();
                }.bind(this),10)
                   
            }
        },
        saveCustomTitle(type){
            if(type == 'save'){
                var data = {
                    change_id:this.for_custom_title.id,
                    change_title:this.$refs.custom_title.value,
                    user_id:user_id,
                    type:'file',
                    original_name:this.for_custom_title.original_name
                }
                socket.emit('customTitle',data,function(res){
                    if(res.status){
                        all_custom_title[this.for_custom_title.id] = this.$refs.custom_title.value;
                        for(file in this.show_tlb_data){
                            if(this.activeTab == 'All Links'){
                                if(this.show_tlb_data[file].url_id == this.for_custom_title.id){
                                    this.show_tlb_data[file]['title'] = all_custom_title[this.for_custom_title.id];
                                    this.show_tlb_data[file]['originalname'] = this.for_custom_title.original_name;
                                    this.show_tlb_data[file]['view_custom_title'] = this.$refs.custom_title.value; 
                                }
                            }else{
                                var originalname = this.for_custom_title.original_name;
                                // var originalname = this.for_custom_title.original_name.split('.');
                                //     originalname = originalname[0];
                                if(this.show_tlb_data[file].id == this.for_custom_title.id){
                                    this.show_tlb_data[file]['view_originalname'] = all_custom_title[this.for_custom_title.id] + ' ('+originalname+')';
                                    this.show_tlb_data[file]['view_custom_title'] = this.$refs.custom_title.value; 
                                }
                            }
                        }
                        this.show_backwrap = false;
                        this.backwrap_type = '';
                        this.for_custom_title.id = '';
                        this.for_custom_title.custom_title = '';
                        this.for_custom_title.original_name = '';
    
                    }
    
                }.bind(this))
            }else{
                
                var data = {
                    change_id:this.for_custom_title.id,
                    change_title:this.for_custom_title.original_name,
                    user_id:user_id,
                    type:'file',
                    original_name:this.for_custom_title.original_name
                }
                socket.emit('customTitle',data,function(res){
                    if(res.status){
                        all_custom_title[this.for_custom_title.id] = this.for_custom_title.original_name;
                        
                        for(file in this.show_tlb_data){
                            if(this.activeTab == 'All Links'){
                                if(this.show_tlb_data[file].url_id == this.for_custom_title.id){
                                    this.show_tlb_data[file]['title'] = (this.for_custom_title.original_name == 'null'? 'No Title':this.for_custom_title.original_name);
                                    this.show_tlb_data[file]['originalname'] = this.for_custom_title.original_name;
                                    this.show_tlb_data[file]['view_custom_title'] = (this.for_custom_title.original_name == 'null'? 'No Title':this.for_custom_title.original_name);
                                }
                            }else{
                                var originalname = this.for_custom_title.original_name;
                                // var originalname = this.for_custom_title.original_name.split('.');
                                //     originalname = originalname[0];
                                all_custom_title[this.for_custom_title.id] = '';
                                if(this.show_tlb_data[file].id == this.for_custom_title.id){
                                    this.show_tlb_data[file]['view_originalname'] = originalname
                                    this.show_tlb_data[file]['view_custom_title'] = originalname
                                }
                            }
                        }
                        this.show_backwrap = false;
                        this.backwrap_type = '';
                        this.for_custom_title.id = '';
                        this.for_custom_title.custom_title = '';
                        this.for_custom_title.original_name = '';
    
                    }
    
                }.bind(this))
            }
        },
        createNewLink(){
            socket.emit('SetURLshorten',{link:this.full_link_share,type:'single',user_id:user_id,create:true},function(res){
                this.shareUniq = res.data;
                this.shared_files.push(this.shared_linkKey);
                this.created_link =  mywindowUrl+'/url/'+res.data;
                this.no_link_found = false;
                setTimeout(function(){
                    this.$refs.shareable_link.focus();
                    document.execCommand('selectAll', false, null);
                    document.execCommand("copy");
                }.bind(this),10)
                
            }.bind(this));
        },
        copyLink(){
            setTimeout(function(){
                this.$refs.shareable_link.focus();
                document.execCommand('selectAll', false, null);
                document.execCommand("copy");
            }.bind(this),10)
        },
        selectAllSearch(){
            this.$refs.main_search_in.focus();
            document.execCommand('selectAll', false, null);
        },
        removeLink(){
            this.no_link_found = true;
            removeA(this.shared_files,this.shared_linkKey);
            socket.emit('removeShareLink',{id:this.shareUniq});
            this.shareUniq = '';
        },
        closePop(e,type){
            this.show_backwrap = false;
            this.backwrap_type = '';
            if(type == 'delete_file'){
                this.delete_ready_file_id = '';
            }else if(type == 'share_link'){
                this.no_link_found = true;
                this.shared_linkKey ='';
                this.created_link = '';
                this.shareUniq = '';

            }else if(type == 'custom_title'){
                this.for_custom_title.id = '';
                this.for_custom_title.custom_title = '';
                this.for_custom_title.original_name = '';
                   
            }else if(type == 'forward_files'){
                this.backwrap_type = '';
                this.forward.single_forward_file = '';
            }
        },
        changePage(number){
            this.pagination_data.go_input = Number(number);
            this.goPage();
            this.dropdown.isActiveForPages = false;

        },
        forwardFiles(){
            this.backwrap_type = 'forward_files';
            this.forward.limit = 10;
            this.forward.mini = [];
            this.forward.li = [];
            this.forward.next = false;
            for(c in all_conversations){
                let conv = {title:findConvName(all_conversations[c].conversation_id), conversation_id:all_conversations[c].conversation_id, img:file_server + findConvImg(all_conversations[c].conversation_id)}
               if(conv.title != undefined && conv.conversation_id != undefined && findConvImg(all_conversations[c].conversation_id) != undefined && findConvImg(all_conversations[c].conversation_id) != false) {
                    this.forward.li.push(conv);
               }
                
            }
            setTimeout(function(){
                this.$refs.searchForward.value = '';
                this.$refs.searchForward.focus();
                this.forward.li_search = [];
            }.bind(this),100)

        },
        forwardSingleFile(e){
            let val = e.target.getAttribute('data-id');
            let val2 = e.target.getAttribute('full_url');
            // if(this.selected_files.indexOf(val) > -1){
            //     // removeA(this.selected_files,val);
            //     // removeA(this.selected_files_urls,val2);
            // }else{
            //     this.selected_files.push(val);
            //     this.selected_files_urls.push(val2);
            // }
            this.forward.single_forward_file = val;
            this.forward.single_forward_file_url = val2;
            this.forwardFiles();
        },
        clickForMini(e){
            var id = e.target.getAttribute('data-val');
            if(this.forward.limit > 0){
                for(c in all_conversations){
                    if(id == all_conversations[c].conversation_id){
                        this.forward.mini.push(all_conversations[c].conversation_id);
                    }
                }
                this.forward.limit-- ;
            }
            this.$refs.searchForward.value = '';
            this.$refs.searchForward.focus();
            this.forward.li_search = [];
        },
        clickRemoveForMini(e){
            var id = e.target.getAttribute('data-val');
            removeA(this.forward.mini,id)
            this.forward.limit++;
            this.$refs.searchForward.focus();
        },
        forwardFilesSubmit(){
            // this.selected_files.push(val);
            // this.selected_files_urls.push(val2);
            var allFilesInfo = [];
            if(this.forward.single_forward_file !== ''){
                allFilesInfo = getFilesInfo(this.main_all_files,[this.forward.single_forward_file]);
            }else{
               allFilesInfo = getFilesInfo(this.main_all_files,this.selected_files);
            }
            this.forward.single_forward_file = '';
            var comments = 'No Comments';
            if(this.$refs.textareaForForward.value != ''){
                comments = this.$refs.textareaForForward.value;
            }
            socket.emit('forwardFiles',{files:allFilesInfo,conversations:this.forward.mini,user_id:user_id,comments:comments,company_id:company_id},function(res){
                if(res.status){
                    this.backwrap_type = '';
                    for(d in res.msgAndConv){
                        for(c in all_conversations){
                            if(res.msgAndConv[d].conversation_id.toString() == all_conversations[c].conversation_id.toString()){
                                let data = {
                                    msg_id:res.msgAndConv[d].msg_id,
                                    conv:all_conversations[c]
                                } 
                                this.clearVueFun('selected_files');
                                
                                socket.emit('broadcast_for_msg_send',data);
                            }
                        }
                    }
                    Vue.$toast.success('Message Forwarded.', {
                        // override the global option
                        position: 'bottom-right'
                    })
                }
            }.bind(this));

        },
        forwardNext(){
            this.forward.next = true;
            setTimeout(function(){
                this.$refs.textareaForForward.focus();
            }.bind(this),100)

        },
        closeNextForward(){
            this.forward.next = false;
            setTimeout(function(){
                this.$refs.searchForward.focus();
            }.bind(this),100)
        },
        searchBackwrapLi(e){
            let val = e.target.value;
            let conv = [];
            if(val.length > 0){

                for(c in this.forward.li){
                   if(this.forward.li[c].title != undefined){

                       if(this.forward.li[c].title.toLowerCase().indexOf(val.toLowerCase()) == -1){
                           conv.push(this.forward.li[c].conversation_id);
                       }
                   }
                }
                this.forward.li_search =  conv;
            }else{
                this.forward.li_search = [];
            }
        }
        
    },
});


var showImageSlider = (file_array,file_id)=>{
    $('#mediaFilePreview').show();
    
    $.each(file_array, function (k, v) {
        if(v.id == file_id){
            var changeText = $('.image-popup-header>h2');
            var repdiv = false;
            $(changeText).html('<img class="back-to-media-tab" onclick="backToMediaTab()" src="/images/basicAssets/BackArrow.svg" alt=""> Images');
            var curimg = file_server+v.location;

            var imgsn = findObjForUser(v.user_id).fullname;
            var img = findObjForUser(v.user_id).img;
            var msgBody = '';
            // var original_name = $(event.target).attr('data-originalname');
            var original_name = v.originalname;
    
            // console.log('11829');
            $('#mediaFilePreview').show();
            $('.media-file-popup').hide();
            $('.image-popup-slider').show();
            $('.images-slider-footer').html("");
            $('.show-picture-comment>p').html("");
        }
        // console.log("allthisdateimg", v);
        var src = file_server+v.location;
        var name = findObjForUser(v.user_id).fullname;
        var img = findObjForUser(v.user_id).img;;
        var msgBody = 'No message';
        var original_name = v.originalname;
        let indivisualImgSize = v.file_size
        // console.log("indivisualImgSize", indivisualImgSize);
        var html = '<div class="slider-footer-all-images" onclick="activethisimg(\'' + src + '\', \'' + name + '\', \'' + img + '\', \'' + msgBody + '\', \''+ original_name +'\', \''+ indivisualImgSize +'\')">';
        html += '<img src="' + src + '" data-msg="'+msgBody+'" alt="">';
        html += '</div>';
        $('.images-slider-footer').append(html);
        if(v.id == file_id){
            if (file_array.length == 1) {
                $('.slider-left-arrow').hide();
                $('.slider-right-arrow').hide();
                $('.images-slider-footer').hide();
            } else {
                $('.slider-left-arrow').show();
                $('.slider-right-arrow').show();
                $('.images-slider-footer').show();
            }
    
            call_panzoom();
            activethisimg(curimg, imgsn, img, msgBody,original_name, Math.floor(Number(v.file_size ) / 1024)+'KB');
        }
    });
	
			
}
var mouse_click_start = "";
var mouse_click_end = "";
function call_panzoom(){
	$(".image-popup-slider").css({"left":"0", "top":"0"});
	$(".fileSliderBackWrap .images-slide-body").css({"display":"block"});
	var parentdiv = $(".images-slide-body");
	var $pan = $("#panzoom").panzoom({
		zoom: Number($("#zoomer").val()),
		$zoomIn: $("#zoom-in"),
		$zoomOut: $("#zoom-out"),
		$zoomRange: $("#zoomer"),
		$reset: $("#reset"),
		startTransform: 'scale(1)',
		maxScale: 2,
		minScale: 1,
		increment: 0.1,
		contain: 'inside',
		cursor: 'zoom-in',
		animate: true
	});

	$pan.parent().on('mousewheel.focal DOMMouseScroll.focal onmousewheel.focal', function( e ) {
		e.preventDefault();
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		// var delta = e.delta || e.originalEvent.wheelDelta;
		var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
		$pan.panzoom('zoom', zoomOut, {
			increment: 0.1,
			focal: e
		});
	});

	$pan.on("mousedown pointerdown MSPointerDown", function(e){
		mouse_click_start = Number(new Date());
		$(".images-slide-body>img").css("cursor", "grab");
	});

	$pan.on("touchend pointerup MSPointerUp", function(e){
		mouse_click_end = Number(new Date());
	});
    $("#zoomer").css("pointer-events", "none");
    setTimeout(function(){
        reset_panzoom();
    },10)
}
function reset_panzoom()
{
	$("#reset").trigger("click");
}

function zoom_in_out(){
	// console.log(mouse_click_end - mouse_click_start);
	if(mouse_click_end - mouse_click_start < 200){
		if($('body').hasClass('altKey')){
			$("#zoom-out").trigger("click");
			$(".images-slide-body>img").css("cursor", "zoom-out");
		}
		else{
			$("#zoom-in").trigger("click");
			$(".images-slide-body>img").css("cursor", "zoom-in");
		}
	}
	$(".images-slide-body>img").css("cursor", "zoom-in");
}
var activethisimg = (curimg, imgsn, img, msgBody,original_name, imgSize) => {
	// console.log("imgSize2", imgSize);
	// console.log(curimg);
	var name = curimg.split('/');
	var unixt = Number(name[name.length-1].substring(name[name.length-1].lastIndexOf('%') + 1, name[name.length-1].lastIndexOf('.')));
	if(! unixt > 0)
		unixt = Number(name[name.length-1].substring(name[name.length-1].lastIndexOf('@') + 1, name[name.length-1].lastIndexOf('.')));
	$('.image-popup-slider').find('.currentimg').attr('src', curimg);
	$('.image-popup-slider').find('.shared-by-user-photo>img').attr('src', file_server +'profile-pic/Photos/' + img);
	$('.image-popup-slider').find('.shared-by-user-photo').remove();
	var newsplitimg = curimg.split('/');
	var imgorginalnamesplit = newsplitimg[newsplitimg.length - 1].split('@');
	var thisimgext = imgorginalnamesplit[imgorginalnamesplit.length - 1].split('.');
	thisimgext = thisimgext[thisimgext.length - 1];
	imgorginalnamesplit[imgorginalnamesplit.length - 1] = '.'+thisimgext;
	imgorginalnamesplit = imgorginalnamesplit.join('');

	$('.image-popup-slider').find('.shared-by-user-details>h3').html(original_name + " (" + imgSize + ")");

	$('.image-popup-slider').find('.shared-by-user-details>p').html('Uploaded by '+ imgsn +' on ' + moment(unixt).format('MMMM Do YYYY @ h:mm a'));
	$('.image-popup-slider').find('.show-picture-comment>p').html(msgBody);
	$('.image-popup-slider').find('.slide-image-download').attr('data-href', curimg);
	$('.image-popup-slider').find('.slide-image-download').attr('file-name', original_name);
	$('.image-popup-slider').find('.slide-image-share').attr('data-value', curimg);
	$('.slider-footer-all-images img').removeClass('active');
	$.each($('.slider-footer-all-images img'), function (k, v) {
		if ($(v).attr('src') == curimg)
			$(v).addClass('active');
	});
	// reset_zoom();
	call_panzoom();
};
// slider left arrow a click = sla
var slaclick = () => {
	var pref_el = $('img.active').closest('.slider-footer-all-images').prev();
	if (pref_el.length) {
		$(pref_el).click();
	}
	else {
		$('.slider-footer-all-images').last().trigger('click');
	}
	// reset_zoom();
	reset_panzoom();
};
// slider right arrow a click = sra
var sraclick = () => {
	var next_el = $('img.active').closest('.slider-footer-all-images').next();
	if (next_el.length){
		$(next_el).click();
	}else{
		$('.slider-footer-all-images').first().trigger('click');
	}
	reset_panzoom();
};






var downloadStatus = true;

function downloadFilesMany(urls) {
		downloadStatus = true;
        var zip = new JSZip();
        var count = 0;
        var zipFilename = "freeli_files.zip";
        
        
        zipFilename = "files-"+moment().format('DD-MM-YYYY-hh:mm A')+".zip";

        $('#createZipHolder').show();
        var newid = 'zip'+moment().unix();
        var design = '<div id="'+newid+'" class="filesZipcon" par="0%"><div class="fileName">'+zipFilename+'</div></div>';
        $('#createZipHolder').append(design);
        urls.forEach(function(url){
            var filename = url.split('/');
            filename = filename[filename.length - 1];
            // loading a file and add it in a zip file
            JSZipUtils.getBinaryContent(url, function (err, data) {
                if(err) {
                    throw err; // or handle the error
                }
                // var img = zip.folder("images");

                zip.file(filename, data, {binary:true,base64: true});
                count++;
                if (count == urls.length) {
                    zip.generateAsync({type:'blob'},function updateCallback(metadata){
                        $('#'+newid).attr('par',Math.floor(metadata.percent) + " %");

                    }).then(function(content) {
                        $('#'+newid).addClass('complete');
                        $('#'+newid).remove();
                        if($('#createZipHolder').find('.filesZipcon').length == 0){
                            $('#createZipHolder').hide(); 
                        }
                        if(downloadStatus){

                            saveAs(content, zipFilename);
                        }
                    });
                }
            });
        });

}

function downloaOneFile (url, filename){
    $("#fixedzipdlid").remove();
    $('#createZipHolder').show();
    var design = '<div id="fixedzipdlid" class="filesZipcon" par="0%"><div class="fileName">'+filename+'</div></div>';
    $('#createZipHolder').append(design);

    saveAs(url, filename);
}

function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
  
      
      var varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      var varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];

      if(key == 'file_size'){
        var varA = (typeof a[key] === 'string')
        ? Number(a[key]): Number(a[key]);
        var varB = (typeof b[key] === 'string')
        ? Number(b[key]) : Number(b[key]);
      }
  
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

var findConvName =(conversation_id)=>{
    var returnname = '';
    for(conv in all_conversations){
        if(conversation_id == all_conversations[conv].conversation_id){
            if(all_conversations[conv].single == 'yes'){
                for(u in all_conversations[conv].participants){
                    if(user_id != all_conversations[conv].participants[u]){
                        returnname = findObjForUser(all_conversations[conv].participants[u]).fullname;
                    }
                }
            }else{
                returnname = all_conversations[conv].title
            }
        }
    }
    if(returnname == ''){
        // returnname = findObjForUser(user_id).fullname;
        returnname = false;
    }
    return returnname;

}
var findConvImg =(conversation_id)=>{
    var returnname = '';
    for(conv in all_conversations){
        if(conversation_id == all_conversations[conv].conversation_id){
            if(all_conversations[conv].single == 'yes'){
                for(u in all_conversations[conv].participants){
                    if(user_id != all_conversations[conv].participants[u]){
                        returnname = 'profile-pic/Photos/'+findObjForUser(all_conversations[conv].participants[u]).img;
                    }
                }
            }else{
                returnname = 'room-images-uploads/Photos/'+all_conversations[conv].conv_img
            }
        }
    }
    if(returnname == ''){
        // returnname = 'profile-pic/Photos/'+findObjForUser(user_id).img;
        returnname = false;
    }
    return returnname;

}
var getChangesDataforVue = (data)=>{
    var t = data.originalname.split('.')
    var file_type = data.file_type.split('/');
    // data['view_originalname'] = t[0];
    data['view_originalname'] = data.originalname;
    data['view_file_type'] = file_type[file_type.length - 1];
    if(data['view_file_type'].indexOf('vnd') > -1){
        data['view_file_type'] = 'apk';
    }
    data['view_file_size'] = bytesToSize2(Number(data.file_size));
    data['view_created_at'] = moment(data.created_at).format('DD-MMM-YYYY');
    data['view_sender_name'] = findObjForUser(data.user_id).fullname;
    data['view_conv_name'] = findConvName(data.conversation_id);
    data['view_full_original_name'] = data['view_originalname']
    // data['view_full_original_name'] = data['view_originalname'] + '.'+data['view_file_type'];
    data['full_url'] = file_server+data.location;
    
    if(all_custom_title[data.id] != undefined){
        if(all_custom_title[data.id] !== data['originalname']){

            data['view_originalname'] = all_custom_title[data.id] + ' ('+data['view_originalname']+')';
            data['view_custom_title'] = all_custom_title[data.id];
        }else{
            data['view_custom_title'] = 'null';
        }
    }else{
        data['view_custom_title'] = 'null';
    }
    return data;
}
var getChangesDataforVueLinks = (data)=>{
    data['view_created_at'] = moment(data.created_at).format('DD-MMM-YYYY');
    data['view_sender_name'] = findObjForUser(data.user_id).fullname;
    data['view_conv_name'] = findConvName(data.conversation_id);
    data['originalname'] = data['title'];
    data['title'] = (data['title'] == 'null' ? 'No Title':data['title']);
    if(all_custom_title[data.url_id] != undefined){
        if(all_custom_title[data.url_id] !== data['originalname']){
            
            data['title'] = all_custom_title[data.url_id];
            data['view_custom_title'] = all_custom_title[data.url_id];
        }else{
            data['view_custom_title'] = 'null';
        }
    }else{
        data['view_custom_title'] = 'null';
    }
    return data;
}


var getAllcheckedFiles = (files)=>{
    var allFilesName = [];
    var allFilesData = [];
    var allMediaImg = [];
    var allMediaAudio = [];
    var allMediaVideo = [];
    var allMediaOthers = [];
    for(v in files){
        let icon = files[v].originalname.split('.');
        if(files[v].file_type.indexOf('image') > -1){
            files[v].icon = file_server+files[v].location;
        }else{
            files[v].icon = '/images/basicAssets/'+getIconForFile(icon[icon.length - 1])+'.svg';
        }
        if(allFilesName.indexOf(files[v].originalname) == -1){
            allFilesName.push(files[v].originalname);
            if(files[v].mention_user == null){
                files[v].mention_user = [];
            }
    
            var thisFileShow = true;
            var secret = true;
            // console.log(v.secret_user,v.secret_user == null,v.secret_user === 'null')
            if (files[v].secret_user !== null) {
                if (files[v].secret_user.indexOf(user_id) == -1) {
                    secret = false;
                }
            }
            if(files[v].user_id !== user_id && secret){
                if(files[v].is_delete == 0){
                    if (has_permission(user_id, 1602)){
                        if(has_permission(user_id,1601)){
                            if(files[v].mention_user.indexOf(user_id) != -1){
                                thisFileShow = true;
                            }else{
                                thisFileShow = false;
                            }
                        }
                    }else if(has_permission(user_id,1603)){
                        if (moment(files[v].created_at).unix() > moment(findObjForUser(user_id).createdat).unix()){
                            if (has_permission(user_id, 1601)) {
                                if (files[v].mention_user.indexOf(user_id) != -1) {
                                    thisFileShow = true;
                                } else {
                                    thisFileShow = false;
                                }
                            }
                        }else{
                            thisFileShow = false;
                        }
                    }
                }else{
                    thisFileShow = false;
                }
            }
            if(thisFileShow){
                if(files[v].file_type !== null){
                    allFilesData.push(getChangesDataforVue(files[v]));
                    if(files[v].file_type.indexOf('image/') > -1)
                        allMediaImg.push(getChangesDataforVue(files[v]));
                    else if(files[v].file_type.indexOf('audio/') > -1)
                        allMediaAudio.push(getChangesDataforVue(files[v]));
                    else if(files[v].file_type.indexOf('video') > -1)
                        allMediaVideo.push(getChangesDataforVue(files[v]));
                    else
                        allMediaOthers.push(getChangesDataforVue(files[v]));
                }
            }
        }
    }
    return {allFilesData,allMediaImg,allMediaAudio,allMediaVideo,allMediaOthers};
}

function getIconForFile(file_ext){
    switch (file_ext) {
        case 'ai':
        case 'mp3':
        case 'mp4':
        case 'mkv':
        case 'avi':
        case 'wmv':
        case 'm4v':
        case 'mpg':
        case 'doc':
        case 'docx':
        case 'indd':
        case 'js':
        case 'sql':
        case 'pdf':
        case 'ppt':
        case 'pptx':
        case 'psd':
        case 'svg':
        case 'xls':
        case 'xlsx':
        case 'zip':
        case 'rar':
            return file_ext;
            break;
        default:
            return 'other';
    }
}
var getAllcheckedLinks = (links)=>{
    var re = [];
    for(l in links){
        let d = getChangesDataforVueLinks(links[l]);
        re.push(d);
    }
    return re;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}
function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function bytesToSize2(bytes) {
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes == 0) return '0 Byte';
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	var size = Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
	return size;
}


function viewShreImgPop(e,elm){
	e.preventDefault();
	e.stopImmediatePropagation();
	$('#sharelinkGreenMsg').hide();
	if($('#threadReplyPopUp').is(':visible')){
		$('#shareLinkPop').attr('thread-view',true);
		// if(window.name !='calling') 
		if (typeof callCleanupLogic !== 'function' && window.name !== 'calling') $('#threadReplyPopUp').hide();
	}else{
		$('#shareLinkPop').attr('thread-view',false);
	}

	var value = $(elm).attr('data-value');
	if($('#mediaLinksTab').hasClass('active')){
		$('#shareLinkPop').find('.from_group').show();
		$('#shareLinkPop').css('display','flex');
		$('#shareLink').html(value);
		$('#shareLink').focus();
		$('#shareLink').select();
		$('#shareLinkPop .UnsharedClass').remove();
	}else{
		socket.emit('SetURLshorten',{link:value,type:'single',user_id:user_id},function(res){
			// console.log(18712,res)
			if(res.old){
				$(elm).addClass('active')
				value = mywindowUrl+'/url/'+res.data;
				$('#shareLinkPop').css('display','flex');
				$('#shareLink').html(value);
				$('#shareLink').attr('data-val',value);
				$('#shareLink').focus();
				$('#shareLink').select();
				$('#shareLinkPop .UnsharedClass').remove();
				$('#actionShareBtn').text('Copy link');
				$('#shareLinkPop').find('.hayven_Modal_endSection .btn_group').prepend('<button class="buttonAction UnsharedClass" style="background: var(--PrimaryC);margin-right: 8px;" onclick="unsharedLink(\''+res.data+'\')" autocomplete="off">Remove link</button>')
			}else{
				$(elm).removeClass('active');
				$('#actionShareBtn').text('Create link');
				$('#shareLinkPop').css('display','flex');
				$('#shareLink').html('');
				$('#shareLink').attr('data-val',value);
				$('#shareLinkPop .UnsharedClass').remove();
				
			}
		});
	}
}

function copyShareLink(elm){
	var value = $('#shareLink').attr('data-val');
	if($(elm).text() == 'Create link'){
		socket.emit('SetURLshorten',{link:value,type:'single',user_id:user_id,create:true},function(res){
			value = mywindowUrl+'/url/'+res.data;
				$('#shareLinkPop').css('display','flex');
				$('#shareLink').html(value);
				$('#shareLink').attr('data-val',value);
				$('#shareLink').focus();
				$('#shareLink').select();
				$('#shareLinkPop .UnsharedClass').remove();
				$('#actionShareBtn').text('Copy link');
				$('#shareLinkPop').find('.hayven_Modal_endSection .btn_group').prepend('<button class="buttonAction UnsharedClass" style="background: var(--PrimaryC);margin-right: 8px;" onclick="unsharedLink(\''+res.data+'\')" autocomplete="off">Remove link</button>');
				$('#shareLink').select();
				document.execCommand("copy");
				$('#sharelinkGreenMsg').show();
				activeShareIconLink();
		});
	}else{
		$('#shareLink').select();
		document.execCommand("copy");
		$('#sharelinkGreenMsg').show();
		activeShareIconLink();
		// closeModal('shareLinkPop');
	}
}

function unsharedLink(shortid){
	// closeModal('shareLinkPop');
	socket.emit('removeShareLink',{id:shortid});
	$('#shareLinkPop').find('.UnsharedClass').remove();
	$('#actionShareBtn').text('Create link');
	$('#sharelinkGreenMsg').hide();
	$('#shareLink').html('');
	$('.img_action.share_ico').removeClass('active');
	activeShareIconLink();
	
}

function closeModal(id){
	$('#'+id).hide();
	$('.hayven_Modal_Container').removeAttr('style').removeClass('ui-draggable');
	$('#'+id).attr('data-esc',false);
	if(id == 'notificationPopup'){
		$('.radioItem.selected').removeClass('selected');
		$("input[type='radio'][name='muteNotification'][value='30M']").closest('label').trigger('click');
		$('#notificationPopup').attr('data-mute-id', "");
		$('#muteDeleteButton').hide();
	}else if(id == 'groupAdminArea'){
		$("#roomIdDiv").attr('data-rfu',"");
	}else if(id == 'msgUrlPreview'){
		$('#msgUrlPreview .url_title').html('');
		$('#msgUrlPreview .ulr_img').html('');
		$('#msgUrlPreview .url_desc').html('');
	}else if(id == 'informationPopup'){
		$('.input_field[data-set="true"]').removeAttr('data-set');
		$('.task_ewh_field input[data-set="true"]').removeAttr('data-set');
	} else if(id == 'roleChangerPopup'){
		$("#adminSettingBackWrap").hide();
	}else if(id == 'downloadPreviewPopup'){
		if($('#downloadPreviewPopup').attr('thread-view') == 'true'){
			$('#threadReplyPopUp').show();
		}
		$('.downloadPreviewBody').removeAttr('style').removeClass('ui-draggable').removeClass('ui-draggable-handle');
	}else if(id == 'shareLinkPop'){
		if($('#shareLinkPop').attr('thread-view') == 'true'){
			$('#threadReplyPopUp').show();
		}
		$('.hayven_Modal_Container').removeAttr('style').removeClass('ui-draggable');
	}else if(id == 'updateMessageTag'){
		if($('#updateMessageTag').attr('thread-view') == 'true'){
			$('#threadReplyPopUp').show();
		}
		$('.hayven_Modal_Container').removeAttr('style').removeClass('ui-draggable').removeClass('ui-draggable-handle');
	}else if(id == 'changePwdPopup'){
		$('#old_password').val('');
		$('#new_password').val('');
		$('#con_password').val('');
	}else if (id == 'warningsPopupConversation') {
		$('.warningPopupBody').removeAttr('style').removeClass('ui-draggable').removeClass('ui-draggable-handle');
	}else if (id == 'createDirConv'){
		$('.hayven_Modal_Container').removeAttr('style').removeClass('ui-draggable');
	}else if (id == 'shareMessagePopUp'){
		$('.hayven_Modal_Container').removeAttr('style').removeClass('ui-draggable');
	}else if (id == 'clearMessages'){
		$('.hayven_Modal_Container').removeAttr('style').removeClass('ui-draggable');
	}else if (id == 'warningPopup'){
		$('.hayven_Modal_Container').removeAttr('style').removeClass('ui-draggable');
	}else if (id == 'changePwdPopup'){
		$('.changePwdPopupBody').removeAttr('style').removeClass('ui-draggable').removeClass('ui-draggable-handle');
	}else if (id == 'editCustomTitle'){
		$('.hayven_Modal_Container').removeAttr('style').removeClass('ui-draggable');
	}else if (id == 'updateMemberPopup'){
		$('.hayven_Modal_Container').removeAttr('style').removeClass('ui-draggable');
	}else if (id == 'warningPopupForCallMsg'){
		$('.hayven_Modal_Container').removeAttr('style').removeClass('ui-draggable');
	}
    $('.drag_handlr').removeClass('ui-draggable-handle');
}

function findObjFortag(tag_id,all_tag){
    for(tag in all_tag){
        if(all_tag[tag].tag_id == tag_id){
            return all_tag[tag];
        }
    }
}