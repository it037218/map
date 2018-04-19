var fullscreenEle=$("#fullscreen");
var fullscreennotEle=$("#fullscreennot");
var closewindowEle=$("#closewindow");
var situationBoxEle=$(".situationBox");
var nowinfoEle=$(".nowinfo");
var testpointEle=$(".testpoint");
var testpoint2Ele=$(".testpoint2");
	
var baseInfo=[];	//原点信息
var position={};
var baseMer;
var distance;

var targetMer={};
var target,targetD;
var ox,oy;
var aType=1;
		
window.onload = function() {
    bindAllBtn();
	situationTracker();
}

function bindAllBtn(){
	//全屏
	fullscreenEle.on("click",function(){
		document.documentElement.webkitRequestFullscreen();
	});
	//退出全屏
	fullscreennotEle.on("click",function(){
		document.webkitCancelFullScreen();
	});
	//关闭窗口
	closewindowEle.on("click",function(){
		window.close();
	});
}
var cX=500,cY=490;	//初始化中心点位置
var cR=475;			//初始化半径大小

var examList=eval({"q":[
		{"id":"55","baselog":"0","baselogp":"0","baselogtype":"1","baselat":"0","baselatp":"0","baselattype":"1","radius":"3","controlmode":"1","logtype":"1","log":"18","logp":"6","lattype":"1","lat":"18","latp":"6","tposition":"0","trange":"0","trangeunit":"1","speedmode":"1","course":"12","coursespeed":"12","coursespeedunit":"1","targetmode":"wst","targetattr":"1","targethight":"600"},
		{"id":"38","baselog":"12","baselogp":"0","baselogtype":"1","baselat":"2","baselatp":"0","baselattype":"1","radius":"2","controlmode":"1","logtype":"1","log":"12","logp":"33","lattype":"1","lat":"2","latp":"0.07","tposition":"0","trange":"0","trangeunit":"1","speedmode":"1","course":"1","coursespeed":"1","coursespeedunit":"1","targetmode":"wst","targetattr":"1","targethight":"0"},
		{"id":"28","baselog":"0","baselogp":"0","baselogtype":"1","baselat":"0","baselatp":"0","baselattype":"1","radius":"2","controlmode":"1","logtype":"1","log":"0","logp":"0","lattype":"1","lat":"0","latp":"0","tposition":"0","trange":"0","trangeunit":"1","speedmode":"1","course":"1","coursespeed":"2","coursespeedunit":"2","targetmode":"airt","targetattr":"1","targethight":"10000"}
		]});
examList=examList['q'];
console.log(examList);

var nowTid=0;

//监听鼠标在态势中的位置
function situationTracker(){
	
	//获取父窗口中的半径信息，确认东经和西经、北纬和南纬
	baseinfo=examList[nowTid];
	
	var x,y;
	situationBoxEle.on("mousemove",function(e){
		//console.log(e.pageX+"  "+e.pageY);
		//计算角度和距离
		
		x=e.pageX;	//鼠标点横向坐标
		y=e.pageY;	//鼠标点纵向坐标
		
		
		//在坐标轴右侧
		
		if(x>cX){
			//在坐标轴右下
			if(y>cY){
				aType=1;
			}	
			//在坐标轴右上
			else{
				aType=2;
			}
		}
		//在坐标轴左侧
		else{
			ox=cX-x;
			//在坐标轴左下
			if(y>cY){
				aType=3;
			}
			//在坐标轴左上
			else{
				aType=4;
			}
		}
		//中心到鼠标点的横向，纵向距离
		ox=Math.abs(x-cX);
		oy=Math.abs(y-cY);
		
		//计算距离
		var d=Math.sqrt(ox*ox+oy*oy);
		if (d>cR){
			return false;
		}
		//计算角
		var a=getAngle(Math.asin(oy/d));
		a=parseFloat(a.toFixed(2));
		switch(aType){
			case 1:
				a=90+a;
				break;
			case 2:
				a=90-a;
				break;
			case 3:
				a=270-a;
				break;
			case 4:
				a=270+a;
				break;
		}
		if(isNaN(a)){
			a=0;
		}
		//计算地图表面的距离
		var radius=examList[nowTid].radius;

		distance=radius/cR;
		var distanceO=parseFloat(distance.toFixed(3));
		
		//转换原点经纬度为坐标
		var baselat,baselatp,baselog,baselogp;
		
		baselat=examList[nowTid].baselat;
		baselatp=examList[nowTid].baselatp;
		baselog=examList[nowTid].baselog;
		baselogp=examList[nowTid].baselogp;
		var baselatd,baselogd;
		baselatd=ChangeToDu(baselat,baselatp);
		baselogd=ChangeToDu(baselog,baselogp);
		baseMer=latLng2WebMercator(baselogd,baselatd);
		//console.log(baseMer);
		//计算目标位置的墨卡托坐标
		//var targetMer={};
		//targetMer.x=baseMer.x+distance*1000*Math.cos(getRadian(a));
		//targetMer.y=baseMer.y+distance*1000*Math.sin(getRadian(a));
		
		//在坐标轴右侧
		targetMer.x=baseMer.x+distance*1000*ox;
		targetMer.y=baseMer.y+distance*1000*oy;
		
		//var target;
		target=webMercator2LngLat(targetMer.x,targetMer.y);
		targetD=[];
		targetD.x=target.x;
		targetD.y=target.y;
		target.x=ChangeToDFM(target.x);
		target.y=ChangeToDFM(target.y);
		//经度
		if(examList[nowTid].baselogtype==1){
			var baselogtype="S";
		}
		else{
			var baselogtype="N";
		}

		//纬度
		if(examList[nowTid].baselattype==1){
			var baselattype="E";
		}
		else{
			var baselattype="W";
		}
		position.x=target.x;
		position.y=target.y;
		position.a=a;
		position.d=distance;
		var out="<p>经纬度："+baselogtype+target.y+"  "+baselattype+target.x+"  距离："+distanceO+"km 方位："+parseFloat(a.toFixed(2))+"°  鼠标位置： x："+x+"  y："+y+"</p>";
		nowinfoEle.html(out);
		
		console.log("");
		
		//反向计算一波
		dTargetMer=latLng2WebMercator(target.x,target.y);
		
		
		
	});
	situationBoxEle.on("click",function(){
		testpointEle.css({"left":x,"top":y});
        changePosition(position);
	});
}
//在态势屏幕上选择
function situationClick(){
    choosePoint(x,y);
}

//在态势屏幕上添加新目标	vx经度米、vy纬度米
function addToTargetWindow(vx,vy){
	//把基本点转换为米
	//转换原点经纬度为坐标
	console.log(vx,vy);
	//计算地图表面的距离
	var radius=radius[examList[nowTid].radius];
	var pxperm=(radius*1000)/cR;
	
	//计算距离差（米） 距离差转换为像素 获取最终像素点位置
	var rx=cX+((vx-baseMer.x)/ox/1000);
	var ry=cY+((vy-baseMer.y)/oy/1000);
	

	testpoint2Ele.css({"left":ry,"top":rx});
}

//计算两点之间的距离
function changePosition(position) {

}
function choosePoint() {

}

