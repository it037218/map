function getRadian(angle){
	if(angle==0){
		return 0;
	}
	return 2*Math.PI/360*angle;
}
function getAngle(radian){
	if(radian==0){
		return 0;
	}
	return radian/(2*Math.PI/360);
}
//经纬度转换为墨卡托，单位 米
function latLng2WebMercator(lng, lat) {
	var mercator={x:0,y:0};
    var x = handle_x(lng);
    // var y = Math.log(Math.tan((90+lat)*Math.PI/360))/(Math.PI/180);
    // y = y *20037508.34/180;
	var y = handle_y(lat)
    mercator.x = x;
    mercator.y = y;
    return mercator;
}
function handle_x(x) {
    return (x / 180.0) * 20037508.34;
}
function handle_y(y) {
    if (y > 85.05112) {
        y = 85.05112;
    }

    if (y < -85.05112) {
        y = -85.05112;
    }

    y = (Math.PI / 180.0) * y;
    var tmp = Math.PI / 4.0 + y / 2.0;
    return 20037508.34 * Math.log(Math.tan(tmp)) / Math.PI;
}

//墨卡托转经纬度，单位 米
function webMercator2LngLat(mx, my) {
     var lonlat={x:0,y:0};
    var x = mx/20037508.34*180;
    var y = my/20037508.34*180;
    y= 180/Math.PI*(2*Math.atan(Math.exp(y*Math.PI/180))-Math.PI/2);
    lonlat.x = x;
    lonlat.y = y;
    return lonlat;
}
//经纬度转换为度
function ChangeToDu(d,f){
	var f = parseFloat(f);
	var du = parseFloat(f/60) + parseFloat(d);
	return du;
}
//经纬度转换为度分秒
function ChangeToDFM(du){
	var str1 = String(du).split(".");
	var du1 = str1[0];
	var tp = "0."+str1[1];
	var tp = String(tp*60);		//这里进行了强制类型转换
	tp=parseFloat(parseFloat(tp).toFixed(2));
	return du1+"°"+tp+"'";
}
