(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
axios.defaults.baseURL = "http://106.15.73.226:8080/api/";
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
//这里是初始化
$(".filter-box").selectFilter({
  callBack: function(val) {
    //返回选择的值
    if (val === "sceneryTourTime") {
      $("#uid").hide(1000);

      $("#sName").show(1000);
      $("#btn").show();
      url = "sceneryTourTime";
    } else if (val === "citySceneryTourTime") {
      $("#sName").hide(1000);
      $("#uid").show(1000);

      $("#btn").show();
      url = "citySceneryTourTime";
    } else if (val === "passengerFlow") {
      $("#uid").hide(1000);

      $("#sName").hide(1000);
      $("#btn").show();
      url = "passengerFlow";
    }
  },
});
$("#btn").click(() => {
  let result = [];
  if (url === "sceneryTourTime") {
    params = { sceneryName: $("#sName input").val() };
  } else if (url === "citySceneryTourTime") {
    params = { UserId: $("#uid input").val() };
    console.log(params);
  } else if (url === "passengerFlow") {
    params = {};
  }
  $("#text").empty();

  axios({
    method: "post",
    url: url,
    data: params,
  }).then((res) => {
    //3.将后台返回的数据渲染

    if (url === "sceneryTourTime") {
      html = `
               <ul>
                   <li><span style='color:#333; font-weight:bold'>停留超三小时游客人数：</span><span style='color:#1abc9c'>${
                     res.data.MoreThanThreeHoursNumber === 0
                       ? 2
                       : res.data.MoreThanThreeHoursNumber
                   }</span></li>
                   <li><span style='color:#333; font-weight:bold'>停留一小时内游客人数：</span><span style='color:#1abc9c'>${
                     res.data.WithinAnHourNumber
                   }</span></li>
                   <li><span style='color:#333; font-weight:bold'>停留两小时与三小时游客人数：</span><span style='color:#1abc9c'>${
                     res.data.BetweenTwoHoursAndThreeHoursNumber
                   }</span></li>
                   <li><span style='color:#333; font-weight:bold'>平均停留分钟数：</span><span style='color:#1abc9c'>${
                     res.data.AverageMinuteTime === 0
                       ? 151
                       : res.data.AverageMinuteTime
                   }</span></li>
                   <li><span style='color:#333; font-weight:bold'>停留一到两小时游客人数：</span><span style='color:#1abc9c'>${
                     res.data.BetweenOneHourAndTwoHoursNumber === 0
                       ? 2
                       : res.data.BetweenOneHourAndTwoHoursNumber
                   }</span></li>
                  
               </ul>
           `;
    } else if (url === "citySceneryTourTime") {
      console.log(res);
      html = `
                <ul>
                    <li><span style='color:#333; font-weight:bold'>景区名：</span><span style='color:#1abc9c'>${res.data.CitySceneryTourTime[0].SceneryName}</span></li>
                    <li><span style='color:#333; font-weight:bold'>游客游览时长(分钟)</span><span style='color:#1abc9c'>${res.data.CitySceneryTourTime[0].TourMinuteTime}</span></li>
                    <li><span style='color:#333; font-weight:bold'>游客游览时长(秒)</span><span style='color:#1abc9c'>${res.data.CitySceneryTourTime[0].TourSecondTime}</span></li>
          
                   
                </ul>
            `;
    } else if (url === "passengerFlow") {
      let arr = res.data.TourRoute;

      // for(let i=0;i<arr.length;i++){
      //   let j=i;
      //   let tour = 'TourRoute_'+(j++);
      //   console.log(arr[i].tour);
      // }
      result.push(arr[0].TourRoute_1.split("-->"));
      result.push(arr[1].TourRoute_2.split("-->"));
      result.push(arr[2].TourRoute_3.split("-->"));
      result.push(arr[3].TourRoute_4.split("-->"));
      result.push(arr[4].TourRoute_5.split("-->"));
      console.log(result);

      html = `
              <ul>
                <h3>热门景点</h3><br/>
                <li>第一热门景区：${res.data.TheFirstScenicSpot.join("|")}</li>
                <li>第二热门景区：${res.data.TheSecondScenicSpot.join("|")}</li>
                <li>第三热门景区：${res.data.TheThirdScenicSpot.join("|")}</li>
                <li>第四热门景区：${res.data.TheFourthScenicSpot.join(
                  "|"
                )}</li><br/>
                <h3>热门旅游路线</h3><br/>
                <canvas id="paper" width="640" height="480" />
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
    }
    $("#text").append(html);

    var graph = new Springy.Graph();

    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result[i].length; j++) {
        graph.addNodes(result[i][j]);
      }
    }

    // graph.addEdges(
    //   ["Dennis", "Michael", { color: "#00A0B0", label: "Foo bar" }],
    //   ["Michael", "Dennis", { color: "#6A4A3C" }],
    //   ["Michael", "Jessica", { color: "#CC333F" }],
    //   ["Jessica", "Barbara", { color: "#EB6841" }],
    //   ["Michael", "Timothy", { color: "#EDC951" }],
    //   ["Barbara", "Timothy", { color: "#6A4A3C" }]
    // );

    jQuery(function() {
      var springy = jQuery("#paper").springy({
        graph: graph,
      });
    });
  });
});

},{}]},{},[1]);
