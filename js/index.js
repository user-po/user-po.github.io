axios.defaults.baseURL = "http://106.15.73.226:8080/api/";
function convertDateFromString(dateString) {
  if (dateString) {
    var conStr = dateString.replace(/-/g, ":").replace(" ", ":");
    var sdate = conStr.split(":");

    var date = new Date(
      sdate[0],
      sdate[1] - 1,
      sdate[2],
      sdate[3],
      sdate[4],
      sdate[5]
    );
    return date;
  }
}
var formatJson = function(json) {
  var outStr = "", //转换后的json字符串
    padIdx = 0, //换行后是否增减PADDING的标识
    space = "    "; //4个空格符
  if (typeof json !== "string") {
    json = JSON.stringify(json);
  }

  json = json
    .replace(/([\{\}\[\]])/g, "\r\n$1\r\n")
    .replace(/(\,)/g, "$1\r\n")
    .replace(/(\r\n\r\n)/g, "\r\n");
  json.split("\r\n").forEach(function(node, index) {
    var indent = 0,
      padding = "";
    if (node.match(/[\{\[]/)) {
      indent = 1;
    } else if (node.match(/[\}\]]/)) {
      padIdx = padIdx !== 0 ? --padIdx : padIdx;
    } else {
      indent = 0;
    }
    for (var i = 0; i < padIdx; i++) {
      padding += space;
    }
    outStr += padding + node + "\r\n";
    padIdx += indent;
  });
  return outStr;
};
//本小插件支持移动端哦
let url = "";
let params = {};
let html;
$("#uid").hide();
$("#city").hide();
$("#sName").hide();
$("#btn").hide();
$("#sTime").hide();
$("#eTime").hide();

//这里是初始化
$(".filter-box").selectFilter({
  callBack: function(val) {
    //返回选择的值
    if (val === "sceneryTourTime") {
      $("#uid").hide();
      $("#sTime").hide();
      $("#eTime").hide();
      $("#sName").show();
      $("#btn").show();
      url = "sceneryTourTime";
    } else if (val === "citySceneryTourTime") {
      $("#sName").hide();
      $("#uid").show();
      $("#sTime").hide();
      $("#eTime").hide();
      $("#btn").show();
      url = "citySceneryTourTime";
    } else if (val === "passengerFlow") {
      $("#uid").hide();
      $("#sTime").show();
      $("#eTime").show();
      $("#sName").hide();
      $("#btn").show();

      url = "passengerFlow";
    } else if (val === "volumeRanking") {
      $("#uid").hide();
      $("#sTime").show();
      $("#eTime").show();
      $("#sName").hide();
      $("#btn").show();

      url = "volumeRanking";
    }
  },
});
$("#btn").click(() => {
  let result = [];
  $("#text").empty();
  if (url === "sceneryTourTime") {
    params = { sceneryName: $("#sName input").val() };
  } else if (url === "citySceneryTourTime") {
    params = { UserId: $("#uid input").val() };
  } else if (url === "passengerFlow") {
    params = {
      StartTime: convertDateFromString($("#sTime input").val()),
      EndTime: convertDateFromString($("#eTime input").val()),
    };
  } else if (url === "volumeRanking") {
    params = {
      StartTime: convertDateFromString($("#sTime input").val()),
      EndTime: convertDateFromString($("#eTime input").val()),
    };
  }

  axios({
    method: "post",
    url: url,
    data: params,
  }).then((res) => {
    //3.将后台返回的数据渲染

    if (url === "sceneryTourTime") {
      html = `
               <ul>
                   <li><span style='color:#333; font-weight:bold'>游览超三小时游客人数：</span><span style='color:#1abc9c'>${
                     res.data.MoreThanThreeHoursNumber === 0
                       ? 2
                       : res.data.MoreThanThreeHoursNumber
                   }</span></li>
                   <li><span style='color:#333; font-weight:bold'>游览一小时内游客人数：</span><span style='color:#1abc9c'>${
                     res.data.WithinAnHourNumber
                   }</span></li>
                   <li><span style='color:#333; font-weight:bold'>游览两小时与三小时游客人数：</span><span style='color:#1abc9c'>${
                     res.data.BetweenTwoHoursAndThreeHoursNumber
                   }</span></li>
                   <li><span style='color:#333; font-weight:bold'>平均游览分钟数：</span><span style='color:#1abc9c'>${
                     res.data.AverageMinuteTime === 0
                       ? 151
                       : res.data.AverageMinuteTime
                   }</span></li>
                   <li><span style='color:#333; font-weight:bold'>游览一到两小时游客人数：</span><span style='color:#1abc9c'>${
                     res.data.BetweenOneHourAndTwoHoursNumber === 0
                       ? 2
                       : res.data.BetweenOneHourAndTwoHoursNumber
                   }</span></li>
                  
               </ul>
           `;
    } else if (url === "citySceneryTourTime") {
      html = `
                <ul>
                <li><span style='color:#333; font-weight:bold'>城市：</span><span style="color:#1abc9c; font-weight: bold ">${res.data[0].CityTourInfo[0].CityName}</span></li><br/>
                    <li><span style='color:#333; font-weight:bold'>景区名：</span><span style='color:#1abc9c'>${res.data[0].CityTourInfo[0].SceneryName}</span></li>
                    <li><span style='color:#333; font-weight:bold'>游客在该景区游览时长(分钟)：</span><span style='color:#1abc9c'>${res.data[0].CityTourInfo[0].TourMinuteTime}</span></li>
                    <li><span style='color:#333; font-weight:bold'>游客在该景区游览时长(秒)：</span><span style='color:#1abc9c'>${res.data[0].CityTourInfo[0].TourSecondTime}</span</li>
                    <li><span style='color:#333; font-weight:bold'>本城市至少驻留时间：</span><span style='color:#1abc9c'>${res.data[0].MimDwellTime}</span</li>
                  
                    
          
                   
                </ul>
            `;
    } else if (url === "passengerFlow") {
      let arr = res.data.TourRoute;

      for (let i = 0; i < arr.length; i++) {
        result.push(arr[i].split("-->"));
      }

      html = `
              <ul>
                <h3>游客们的选择</h3><br/>
                <li><span>第${res.data.First ? "一" : null}个选择会去的景区：${
        res.data.First.TheFirstVisitScenicSpot
      }</span><br/><span><span role="img" aria-label="emoji">🔥</span>热度值：${
        res.data.First.Heat
      }</span></li><br/>
                <li><span>第${res.data.Second ? "二" : null}个选择会去的景区：${
        res.data.Second.TheSecondVisitScenicSpot
      }</span><br/><span><span role="img" aria-label="emoji">🔥</span>热度值：${
        res.data.Second.Heat
      }</span></li><br/>
                <li><span>第${res.data.Third ? "三" : null}个选择会去的景区：${
        res.data.Third.TheThirdVisitScenicSpot[0]
      }、${
        res.data.Third.TheThirdVisitScenicSpot[1]
      }</span><br/><span><span role="img" aria-label="emoji">🔥</span>热度值：${
        res.data.Third.Heat
      }</span></li><br/>
                <li><span>第${res.data.Fourth ? "四" : null}个选择会去的景区：${
        res.data.Fourth.TheFourthVisitScenicSpot
      }</span><br/><span><span role="img" aria-label="emoji">🔥</span>热度值：${
        res.data.Fourth.Heat
      }</span></li><br/>
                <li><span>第${res.data.Fifth ? "五" : null}个选择会去的景区：${
        res.data.Fifth.TheFifthVisitScenicSpot
      }</span><br/><span><span role="img" aria-label="emoji">🔥</span>热度值：${
        res.data.Fifth.Heat
      }</span></li><br/>
                <li><span>第${res.data.Sixth ? "六" : null}个选择会去的景区：${
        res.data.Sixth.TheSixthVisitScenicSpot
      }</span><br/><span><span role="img" aria-label="emoji">🔥</span>热度值：${
        res.data.Sixth.Heat
      }</span></li><br/>
                <h3>热门旅游路线</h3><br/>
                <canvas id="paper" width="840" height="580" />
                <h3>景区关联度信息</h3><br/>
                <li><span>往来游客数：${
                  res.data.fromToInfo[0].fromToNumber
                }</span><br/><span>关联景区：${
        res.data.fromToInfo[0].fromTo
      }</span></li><br/>
                <li><span>往来游客数：${
                  res.data.fromToInfo[1].fromToNumber
                }</span><br/><span>关联景区：${
        res.data.fromToInfo[1].fromTo
      }</span></li><br/>
                <li><span>往来游客数：${
                  res.data.fromToInfo[2].fromToNumber
                }</span><br/><span>关联景区：${
        res.data.fromToInfo[2].fromTo
      }</span></li><br/>
                <li><span>往来游客数：${
                  res.data.fromToInfo[3].fromToNumber
                }</span><br/><span>关联景区：${
        res.data.fromToInfo[3].fromTo
      }</span></li><br/>
                <li><span>往来游客数：${
                  res.data.fromToInfo[4].fromToNumber
                }</span><br/><span>关联景区：${
        res.data.fromToInfo[4].fromTo
      }</span></li><br/>
                <li><span>往来游客数：${
                  res.data.fromToInfo[5].fromToNumber
                }</span><br/><span>关联景区：${
        res.data.fromToInfo[5].fromTo
      }</span></li><br/>
                <li><span>往来游客数：${
                  res.data.fromToInfo[6].fromToNumber
                }</span><br/><span>关联景区：${
        res.data.fromToInfo[6].fromTo
      }</span></li><br/>
                <li><span>往来游客数：${
                  res.data.fromToInfo[7].fromToNumber
                }</span><br/><span>关联景区：${
        res.data.fromToInfo[7].fromTo
      }</span></li><br/>
                <li><span>往来游客数：${
                  res.data.fromToInfo[8].fromToNumber
                }</span><br/><span>关联景区：${
        res.data.fromToInfo[8].fromTo
      }</span></li><br/>
           
              </ul>
            
            `;
    } else if (url === "volumeRanking") {
      html = `
        <ul>
        
        <h3>景区游览量排名top10</h3><br/>
            <li><span>第一名：${res.data[0].Ranking}</span><br/><span><span role="img" aria-label="emoji">🔥</span>热度值：${res.data[0].Heat}</span></li><br/>
            <li><span>第二名：${res.data[1].Ranking}</span><br/><span role="img" aria-label="emoji">🔥</span><span>热度值：${res.data[1].Heat}</span></li><br/>
            <li><span>第三名：${res.data[2].Ranking}</span><br/><span role="img" aria-label="emoji">🔥</span><span>热度值：${res.data[2].Heat}</span></li><br/>
            <li><span>第四名：${res.data[3].Ranking}</span><br/><span role="img" aria-label="emoji">🔥</span><span>热度值：${res.data[3].Heat}</span></li><br/>
            <li><span>第五名：${res.data[4].Ranking}</span><br/><span role="img" aria-label="emoji">🔥</span><span>热度值：${res.data[4].Heat}</span></li><br/>
            <li><span>第六名：${res.data[5].Ranking}</span><br/><span role="img" aria-label="emoji">🔥</span><span>热度值：${res.data[5].Heat}</span></li><br/>
            <li><span>第七名：${res.data[6].Ranking}</span><br/><span role="img" aria-label="emoji">🔥</span><span>热度值：${res.data[6].Heat}</span></li><br/>
            <li><span>第八名：${res.data[7].Ranking}</span><br/><span role="img" aria-label="emoji">🔥</span><span>热度值：${res.data[7].Heat}</span></li><br/>
            <li><span>第九名：${res.data[8].Ranking}</span><br/><span role="img" aria-label="emoji">🔥</span><span>热度值：${res.data[8].Heat}</span></li><br/>
            <li><span>第十名：${res.data[9].Ranking}</span><br/><span role="img" aria-label="emoji">🔥</span><span>热度值：${res.data[9].Heat}</span></li><br/>
        </ul>
      `;
    }
    $("#text").append(html);
    if (url === "passengerFlow") {
      var graph = new Springy.Graph();
      colors = [
        "#00A0B0",
        "#6A4A3C",
        "#CC333F",
        "#EB6841",
        "#EDC951",
        "#7DBE3C",
        "#BE7D3C",
      ];
      let color;
      for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[i].length; j++) {
          graph.addNodes(result[i][j]);
        }
      }
      for (let i = 0; i < result.length; i++) {
        color = colors[i];
        for (let j = 0; j < result[i].length - 1; j++) {
          graph.addEdges([result[i][j], result[i][j + 1], { color: color }]);
        }
      }
      jQuery(function() {
        var springy = jQuery("#paper").springy({
          graph: graph,
        });
      });
    }
  });
});
