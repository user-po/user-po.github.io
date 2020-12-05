axios.defaults.baseURL="http://106.15.73.226:8080/api/";
var formatJson = function (json) {
   var outStr = '',     //转换后的json字符串
       padIdx = 0,         //换行后是否增减PADDING的标识
       space = '    ';   //4个空格符
   if (typeof json !== 'string') {
       json = JSON.stringify(json);
   }
 
   json = json.replace(/([\{\}\[\]])/g, '\r\n$1\r\n')          
               .replace(/(\,)/g, '$1\r\n')
               .replace(/(\r\n\r\n)/g, '\r\n'); 
  (json.split('\r\n')).forEach(function (node, index) {
       var indent = 0,
           padding = '';
       if (node.match(/[\{\[]/)){
         indent = 1;
       }else if (node.match(/[\}\]]/)){
         padIdx = padIdx !== 0 ? --padIdx : padIdx;
       }else{
         indent = 0;
       }    
       for (var i = 0; i < padIdx; i++){
         padding += space;
       }    
       outStr += padding + node + '\r\n';
       padIdx += indent;
   });
   return outStr;
};
//本小插件支持移动端哦
let url='';
let params={};

			//这里是初始化
$('.filter-box').selectFilter({
				callBack : function (val){
					//返回选择的值
					if(val==='sceneryTourTime'){
                  $('#uid').hide(1000);
                  $('#city').hide(1000);
                  $('#sName').show(1000);
                  url='sceneryTourTime';
                  params={sceneryName:$('#sName').val()}
               }else if(val==='citySceneryTourTime'){
                  $('#sName').hide(1000);
                  $('#uid').show(1000);
                  $('#city').show(1000);
                  url='citySceneryTourTime';
                  params={UserId:$('#uid').val(),City:$('#city').val()}
               }else if(val==='passengerFlow'){
                  $('#uid').hide(1000);
                  $('#city').hide(1000);
                  $('#sName').hide(1000);
                  url='passengerFlow'
                  params={}
               }
				}
			});
 $('#btn').click(()=>{
      //1.收集表单数据
      //2.向后台发送数据
      //https://api.apiopen.top/getJoke
      let result=[];
  
      axios({
        method: 'post',
        url: url,
        data:params
         
      }).then((res)=>{
           //3.将后台返回的数据渲染
          
         
           var resultJson = formatJson(res.data);
         
           document.getElementById('text').innerHTML = resultJson;
      });
    
     
     
   })

