var SubtaskClone = {
        flexSize:this.flexSize,
        id: this.id,
        cellcomponent:this.cellcomponent,
        draw : function(){
            let design =  '<div class="pulse-component" id="addnewSub">';
                design +='      <div id="NameCell'+this.id+'" class="cell-component name-cell heading">';
                design +='          <div class="name-cell-component">';
                design +='              <div class="pulse-left-indicator can-edit " style="background-color: rgb(87, 155, 252); color: rgb(87, 155, 252);">';
                design +='              </div>';
                design +='              <input type="text" class="name-text" id="create_subtask" data-title="" onblur="checkSubonBlur(event)" onkeyup="addNewSubtask(event)" placeholder=\'+ Add a subtask\' data-placeholder=\'+ Add a subtask\' onclick="checkSubtask(event)" />';
                design +='          </div>';
                design +='      </div>';
                for(var i = 2; i<= this.cellcomponent; i++ ){
                    design +='  <div class="cell-component" style="display:'+(this.checkAvailability(i) ? 'none':'block')+';flex-basis: 120px;background: #ffffff;">';
                        design +='  </div>';
                }
                design +='</div>';
            return design;
        },
        varience: function(){
            let design =  '<div class="pulse-component" id="varienceRow" style="margin-top:2px;">';
                design +='      <div id="aNameCell'+this.id+'" class="cell-component name-cell heading" style="background-color: #ffffff;border-bottom: none; ">';
                design +='          <div class="name-cell-component">';
                design +='          </div>';
                design +='      </div>';
                for(var i = 2; i<= this.cellcomponent; i++ ){
                    design +='  <div class="cell-component" style="border-bottom: none; display:'+(this.checkAvailability(i) ? 'none':'block')+';flex-basis: 120px;background-color: #ffffff;font-size:13px;">';
                    design +='  </div>';
                }
                design +='</div>';
            return design;
        },
        checkAvailability : function(val){
            if(val == 2){
                return true;
            }else if(val == 3){
                return true;
            }else if(val == 9){
                return true;
            }else if(val == 10){
                return true;
            }else if(val == 11){
                return true;
            }else if(val == 12){
                return true;
            }else if(val == 13){
                return true;
            }else if(val == 14){
                return true;
            }else if(val == 15){
                return true;
            }else if(val == 16){
                return true;
            }else{
                return false;
            }
        }
};