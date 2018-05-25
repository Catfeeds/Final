/*
 fileName: map.js
 description: process AMap function and manage Tourist areas
 */

// variables for AMap
var map = null; // AMap pointer
var googleLayer;
var state = 'new';
// selected position
var leftBottom = [116.391541, 39.913155];
var rightTop = [116.402635, 39.92223931];

// current position
var currentLocation = [];

// flag for MouseTool
var isFirst = true;
var base_url = "";
//list for Attraction Mark
var markList = [];
var markerId = 100;

var district, polygons = [], citycode;

var citySelect, districtSelect, areaSelect;

var opts;
var imageLayer = null;
var mapMarker = null;
var mapMarker1 = null;
var dragging = false;
var dragging1 = false;
var cornerLocation = [];
var zoom_data;

/* function: initMap
 description: Init AMap using center position and add AMap.MouseTool plugin
 param: center // center position of current map view
 */
function initMap(center) {
    zoom_data = parseInt($("#map_zoom_data").val());
    if ($("#map_zoom_data").val() == undefined) zoom_data = 13;
    map = new AMap.Map('custom-map-container', {
        resizeEnable: true,
        zoom: zoom_data,
        center: center//地图中心点
    });
    citySelect = document.getElementById('city');
    districtSelect = document.getElementById('district');
    areaSelect = document.getElementById('street');
//行政区划查询
    opts = {
        subdistrict: 1,   //返回下一级行政区
        showbiz: false  //最后一级返回街道信息
    };
    district = new AMap.DistrictSearch(opts);//注意：需要使用插件同步下发功能才能这样直接使用
    district.search('中国', function (status, result) {
        if (status == 'complete') {
            getData(result.districtList[0]);
        }
    });

    googleLayer = new AMap.TileLayer({
        // 图块取图地址
        tileUrl: 'https://mt{1,2,3,0}.google.cn/vt/lyrs=m@142&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil',
        zIndex: 100
    });
    googleLayer.setMap(map);

    //var mouseTool = new AMap.MouseTool(map); //在地图中添加MouseTool插件
    //var drawRectangle = mouseTool.rectangle(); //用鼠标工具画矩形
    isFirst = true;
    //AMap.event.addListener(mouseTool, 'draw', function (e) {
    //    if (!isFirst) return;
    //    mouseTool.close();
    //    isFirst = false;
    //    var path = e.obj.getPath();
    //    leftBottom = [path[3].lng, path[3].lat];
    //    rightTop = [path[1].lng, path[1].lat];
    //
    //    var arr = [leftBottom, rightTop];
    //    console.log(e.obj.getPath());//获取路径
    //    $('#area-position').val(JSON.stringify(arr));
    //});


}


function getData(data, level) {
    var bounds = data.boundaries;
    if (bounds) {
        for (var i = 0, l = bounds.length; i < l; i++) {
            var polygon = new AMap.Polygon({
                map: map,
                strokeWeight: 1,
                strokeColor: '#CC66CC',
                fillColor: '#CCF3FF',
                fillOpacity: 0.5,
                path: bounds[i]
            });
            polygons.push(polygon);
            map.setFitView();//地图自适应
            setTimeout(function () {
                var pos = map.getCenter();
                //currentLocation = [pos['lng'], pos['lat']];
                // console.log(currentLocation);
                // var position = currentLocation;
                //
                // leftBottom = [position[0] - .01, position[1] - .01];
                // rightTop = [position[0] + .01, position[1] + .01];
                //
                // imageLayer.setBounds(new AMap.Bounds(leftBottom, rightTop));
                // cornerLocation = [rightTop[0], leftBottom[1]];
                // mapMarker.setPosition(currentLocation);
                // mapMarker1.setPosition(cornerLocation);
                // var arr = [leftBottom, rightTop];
                // $('#area-position').val(JSON.stringify(arr));
                //
                // for (var i = 0; i < markList.length; i++) {
                //
                //     //pos1 = JSON.parse($('#pointposition-' + markList[i]['G']['id']).val());
                //
                //     markPosition = currentLocation;
                //
                //     $('#pointposition-' + markList[i]['G']['id']).val(JSON.stringify(markPosition));
                //
                //     markList[i].setPosition(markPosition);
                // }
                var position = [pos['lng'], pos['lat']];
                setLayerPosition(position, 0);
            }, 1000);
        }

    }


    //清空下一级别的下拉列表
    if (level === 'province') {
        citySelect.innerHTML = '';
        districtSelect.innerHTML = '';
        areaSelect.innerHTML = '';
    } else if (level === 'city') {
        districtSelect.innerHTML = '';
        areaSelect.innerHTML = '';
    } else if (level === 'district') {
        areaSelect.innerHTML = '';
    }

    var subList = data.districtList;
    var contentSub, curlevel, curList;

    if ($("#page_loaded_status").val() == '0') {
        if ($("#provinceName").html() != '') {
            contentSub = new Option($("#provinceName").html());
            curList = document.querySelector('#province');
            curList.add(contentSub);
        }
        if ($("#cityName").html() != '') {
            contentSub = new Option($("#cityName").html());
            curList = document.querySelector('#city');
            curList.add(contentSub);
        }
        if ($("#districtName").html() != '') {
            contentSub = new Option($("#districtName").html());
            curList = document.querySelector('#district');
            curList.add(contentSub);
        }
    }

    if (subList) {
        switch (level) {
            case 'province':
                contentSub = new Option('--选择市--');
                break
            case 'city':
                contentSub = new Option('--选择区--');
                break
            case 'district':
                contentSub = new Option('--请选择--');
                break
            default:
                contentSub = new Option('--选择省--');
                break
        }
        curlevel = subList[0].level;
        curList = document.querySelector('#' + curlevel);
        curList.add(contentSub);
        for (var i = 0, l = subList.length; i < l; i++) {
            var name = subList[i].name;
            var levelSub = subList[i].level;
            var cityCode = subList[i].citycode;
            contentSub = new Option(name);
            contentSub.setAttribute("value", levelSub);
            contentSub.center = subList[i].center;
            contentSub.adcode = subList[i].adcode;
            curList.add(contentSub);
        }
    }

}

function search(obj) {
    //清除地图上所有覆盖物
    for (var i = 0, l = polygons.length; i < l; i++) {
        polygons[i].setMap(null);
    }
    var option = obj[obj.options.selectedIndex];
    var keyword = option.text; //关键字
    var adcode = option.adcode;
    console.log(JSON.stringify(option.value));
    district.setLevel(option.value); //行政区级别
    if (option.value == 'province') $("#provinceName").html(keyword);
    else if (option.value == 'city') $("#cityName").html(keyword);
    else if (option.value == 'district') $("#districtName").html(keyword);
    else {
        $("#provinceName").html('');
        $("#cityName").html('');
        $("#districtName").html('');
    }
    if ($('#page_Id').html() == '编辑旅游线路' || $('#page_Id').html() == '新增旅游线路')
        showAreaList($("#provinceName").html(), $("#cityName").html(), 1);
    district.setExtensions('all');
    //行政区查询
    //按照adcode进行查询可以保证数据返回的唯一性
    district.search(adcode, function (status, result) {
        if (status === 'complete') {
            getData(result.districtList[0], obj.id);
        }
    });
}

function setCenter(obj) {
    map.setCenter(obj[obj.options.selectedIndex].center);
}

function setLayerPosition(position, mode) {

    //var target = e['target']['G'];
    var pos1 = [];
    var markPosition = [];
    if (mode == 0) { // move center point
        // calculate moving amount
        var dx = position[0] - currentLocation[0];
        var dy = position[1] - currentLocation[1];
        currentLocation = position;
        // move overlay
        leftBottom[0] += dx;
        leftBottom[1] += dy;
        rightTop[0] += dx;
        rightTop[1] += dy;
        for (var i = 0; i < markList.length; i++) {

            pos1 = JSON.parse($('#pointposition-' + markList[i]['G']['id']).val());

            markPosition = [pos1[0] + dx, pos1[1] + dy];

            $('#pointposition-' + markList[i]['G']['id']).val(JSON.stringify(markPosition));

            markList[i].setPosition(markPosition);
        }
        cornerLocation = [rightTop[0], leftBottom[1]];
        mapMarker.setPosition(position);
        mapMarker1.setPosition(cornerLocation);
    } else if (mode == 1) {
        // move overlay
        originalLocation = [rightTop[0], leftBottom[1]];
        rightTop[0] = position[0];
        leftBottom[1] = position[1];
        leftBottom[0] = currentLocation[0] - (position[0] - currentLocation[0]);
        rightTop[1] = currentLocation[1] - (position[1] - currentLocation[1]);

        var rate = [(originalLocation[0] - currentLocation[0]) / (position[0] - currentLocation[0]),
            (originalLocation[1] - currentLocation[1]) / (position[1] - currentLocation[1])];

        for (var i = 0; i < markList.length; i++) {

            pos1 = JSON.parse($('#pointposition-' + markList[i]['G']['id']).val());
            markPosition = [currentLocation[0] + (pos1[0] - currentLocation[0]) / rate[0],
                currentLocation[1] + (pos1[1] - currentLocation[1]) / rate[1]];
            //if(pos1[0]-currentLocation[0]<.0001) markPosition[0] = pos1[0];
            //if(pos1[1]-currentLocation[1]<.000001) markPosition[1] = pos1[1];
            $('#pointposition-' + markList[i]['G']['id']).val(JSON.stringify(markPosition));
            markList[i].setPosition(markPosition);
        }
    }
    imageLayer.setBounds(new AMap.Bounds(leftBottom, rightTop));
    var arr = [leftBottom, rightTop];
    $('#area-position').val(JSON.stringify(arr));
}


AMapUI.loadUI(['misc/PoiPicker'], function (PoiPicker) {
    $('#city_Name').on('change', searchCity);

    function searchCity(event) {
        var poiPicker = new PoiPicker({
            input: 'city_Name',
            placeSearchOptions: {
                map: map,
                pageSize: 5
            }
        });
        poiPicker.on("poiPicked", function (poiResult) {

            poiPicker.hideSearchResults();
            var source = poiResult.source,
                poi = poiResult.item;

            if (source !== 'search') {

                //suggest来源的，同样调用搜索
                poiPicker.searchByKeyword(poi.name);

            } else {

                //console.log(poi);
            }
            var position = [poi['location']['lng'], poi['location']['lat']];
            map.setCenter(position);
            // currentLocation = [poi['location']['lng'], poi['location']['lat']];
            // map.setCenter(currentLocation);
            // var position = currentLocation;
            //
            // leftBottom = [position[0] - .01, position[1] - .01];
            // rightTop = [position[0] + .01, position[1] + .01];
            //
            // imageLayer.setBounds(new AMap.Bounds(leftBottom, rightTop));
            // cornerLocation = [rightTop[0], leftBottom[1]];
            // mapMarker.setPosition(currentLocation);
            // mapMarker1.setPosition(cornerLocation);
            setLayerPosition(position, 0);
            var arr = [leftBottom, rightTop];
            $('#area-position').val(JSON.stringify(arr));
        });
    }
});

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {

    mapMarker = null;
    mapMarker1 = null;
    imageLayer = null;
    dragging = false;
    dragging1 = false;
    cornerLocation = [];
    map = null;

    currentLocation = [(leftBottom[0] + rightTop[0]) / 2, (leftBottom[1] + rightTop[1]) / 2];
    cornerLocation = [rightTop[0], leftBottom[1]];
    var position = $('#area-position').val();
    if (position != '' && position != undefined) {

        initMap(currentLocation);
        var positionObj = JSON.parse(position);
        var url = $('#custom-base-url').val();
        base_url = url;

        leftBottom = positionObj[0];
        rightTop = positionObj[1];
        cornerLocation = [rightTop[0], leftBottom[1]];
        currentLocation = [(leftBottom[0] + rightTop[0]) / 2, (leftBottom[1] + rightTop[1]) / 2];
        var overlay = $('#area-overlay').val();

        map = new AMap.Map('custom-map-container', {
            resizeEnable: true,
            center: currentLocation,
            zoom: zoom_data,
            scrollWheel: true
        });

        imageLayer = new AMap.ImageLayer({
            url: url + 'uploads/' + overlay,
            bounds: new AMap.Bounds(
                leftBottom,     //左下角
                rightTop        //右上角
            ),
            zooms: [2, 20],
            map: map
        });
        imageLayer.setzIndex(100);
        imageLayer.setMap(map);
        mapMarker = new AMap.Marker({
            map: map,
            //icon: base_url + 'uploads/ayoubc15047194103348.jpg',
            icon: base_url + 'assets/images/control.png',
            offset: new AMap.Pixel(-20, -20),
            position: currentLocation,
            draggable: true
        });
        mapMarker.setzIndex(400);
        dragging = false;
        mapMarker.on('dragstart', function (e) {
            dragging = true;
        });
        mapMarker.on('dragend', function () {
            dragging = false;
        });
        mapMarker.on('mousemove', function (e) {
            if (dragging) {
                var position = [e['lnglat']['lng'], e['lnglat']['lat']];
                setLayerPosition(position, 0);
            }
        });
        dragging1 = false;
        mapMarker1 = new AMap.Marker({
            map: map,
            icon: base_url + 'assets/images/control.png',
            offset: new AMap.Pixel(-20, -20),
            position: cornerLocation,
            draggable: true
        });
        mapMarker1.setzIndex(400);
        dragging1 = false;
        mapMarker1.on('dragstart', function (e) {
            dragging1 = true;
        });
        mapMarker1.on('dragend', function () {
            dragging1 = false;
        });
        mapMarker1.on('mousemove', function (e) {
            if (dragging1) {
                var position = [e['lnglat']['lng'], e['lnglat']['lat']];
                setLayerPosition(position, 1);
            }
        });
        addPointFromArea(url);
    }
    else {
        // init AMap
        currentLocation = [(leftBottom[0] + rightTop[0]) / 2, (leftBottom[1] + rightTop[1]) / 2];
        cornerLocation = [rightTop[0], leftBottom[1]];
        initMap(currentLocation);
        map = new AMap.Map('custom-map-container', {
            resizeEnable: true,
            center: currentLocation,
            zoom: zoom_data,
            scrollWheel: true
            //layers: [
            //    new AMap.TileLayer(),
            //    imageLayer
            //]
        });

        googleLayer = new AMap.TileLayer({
            // 图块取图地址
            tileUrl: 'https://mt{1,2,3,0}.google.cn/vt/lyrs=m@142&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil',
            zIndex: 100
        });
        googleLayer.setMap(map);

        imageLayer = new AMap.ImageLayer({
            url: base_url + 'assets/images/bound.png',
            bounds: new AMap.Bounds(
                leftBottom,     //左下角
                rightTop        //右上角
            ),
            zooms: [1, 20],
            map: map
        });
        imageLayer.setzIndex(100);
        imageLayer.setMap(map);
        mapMarker = new AMap.Marker({
            map: map,
            icon: base_url + 'assets/images/control.png',
            offset: new AMap.Pixel(-20, -20),
            position: currentLocation,
            draggable: true
        });
        mapMarker.setzIndex(400);
        dragging = false;
        mapMarker.on('dragstart', function (e) {
            dragging = true;
        });
        mapMarker.on('dragend', function () {
            dragging = false;
        });
        mapMarker.on('mousemove', function (e) {
            if (dragging) {
                var position = [e['lnglat']['lng'], e['lnglat']['lat']];
                setLayerPosition(position, 0);
            }
        });
        mapMarker1 = new AMap.Marker({
            map: map,
            icon: base_url + 'assets/images/control.png',
            offset: new AMap.Pixel(-20, -20),
            position: cornerLocation,
            draggable: true
        });
        mapMarker1.setzIndex(400);
        dragging1 = false;
        mapMarker1.on('dragstart', function (e) {
            dragging1 = true;
        });
        mapMarker1.on('dragend', function () {
            dragging1 = false;
        });
        mapMarker1.on('mousemove', function (e) {
            if (dragging1) {
                var position = [e['lnglat']['lng'], e['lnglat']['lat']];
                setLayerPosition(position, 1);
            }
        });
    }

    /*
     Event code that find string for Search of Tourist Area
     */
    //AMap.plugin('AMap.Autocomplete', function () {//回调函数
    //    var autoOptions = {
    //        //city: "", //城市，默认全国
    //        input: "city_Name"//使用联想输入的input的id
    //    };
    //    var autocomplete = new AMap.Autocomplete(autoOptions);
    //    var placeSearch = new AMap.PlaceSearch({
    //        map:map
    //    });
    //
    //    AMap.event.addListener(autocomplete, "select", function (data) {
    //        console.log(data);
    //        currentLocation = [data['poi']['location']['lng'], data['poi']['location']['lat']];
    //        map.setCenter(currentLocation);
    //        var position = currentLocation;
    //
    //        leftBottom = [position[0] - .001, position[1] - .001];
    //        rightTop = [position[0] + .001, position[1] + .001];
    //
    //        imageLayer.setBounds(new AMap.Bounds(leftBottom, rightTop));
    //        cornerLocation = [rightTop[0], leftBottom[1]];
    //        mapMarker.setPosition(currentLocation);
    //        mapMarker1.setPosition(cornerLocation);
    //        var arr = [leftBottom, rightTop];
    //        $('#area-position').val(JSON.stringify(arr));
    //    });
    //});

    /////////////////////////////////////////////////////

    if ($('#pageId').html() == '国外地区') {
        var country_list = (JSON.parse($('#countryList').val()));
        $('#searchContinent').on('change', function () {
            var continent = parseInt($('#searchContinent').val());
            var country_html = '<option value="0" selected>选择国家</option>';
            for (var i = 1; i <= country_list.length; i++) {
                if (parseInt(country_list[i - 1].continent) == continent) {
                    if (country_list[i - 1].country == '中国') continue;
                    country_html += '<option value="' + i + '" >' + country_list[i - 1].country + '</option>';
                }
            }
            $('#searchCountry').html(country_html);
        })
    }
    /*
     Event code that upload overlay image to Tourist Area
     */
    var files;
    $('#upload-overlay').on('change', prepareUpload);

    function prepareUpload(event) {
        event.stopPropagation(); // Stop stuff happening
        event.preventDefault(); // Totally stop stuff happening
        files = event.target.files;
        if (this.files[0].type != "image/jpeg" && this.files[0].type != "image/png") {
            window.alert("图片格式不正确.");
            return;
        }
        if (this.files[0].size > 10000000) {
            window.alert("图片要不超过10M.");
            return;
        }

        var data = new FormData();
        $.each(files, function (key, value) {
            data.append(key, value);
        });

        $("#area-image-message").html('图片上传中...');

        $.ajax({
            url: base_url + 'api/Areas/upload',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function (data, textStatus, jqXHR) {
                if (typeof data.error === 'undefined') {
                    if (data['status'] == true) {
                        $('#area-overlay').val(data['file']);
                        if (map == null) {
                            map = new AMap.Map('custom-map-container', {
                                resizeEnable: true,
                                center: currentLocation,
                                zoom: zoom_data,
                            });
                        }

                        if (imageLayer != null) {
                            imageLayer.setMap(null);
                        }
                        imageLayer = new AMap.ImageLayer({
                            url: base_url + 'uploads/' + data['file'],
                            bounds: new AMap.Bounds(
                                leftBottom,   //左下角
                                rightTop    //右上角
                            ),
                            zooms: [5, 18],
                            draggable: true
                        });
                        imageLayer.setzIndex(100);
                        imageLayer.setMap(map);
                    }
                    $("#area-image-message").html('');
                }
                else {
                    // Handle errors here
                    console.log('ERRORS: ' + data.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle errors here
                console.log('ERRORS: ' + textStatus);
                // STOP LOADING SPINNER
            }
        });
    }

    //upload image for Thumb
    $('#upload-thumb-file').on('change', uploadThumbImage);

    function uploadThumbImage(event) {
        event.stopPropagation(); // Stop stuff happening
        event.preventDefault(); // Totally stop stuff happening
        files = event.target.files;
        if (this.files[0].type != "image/jpeg" && this.files[0].type != "image/png") {
            window.alert("图片格式不正确.");
            return;
        }
        if (this.files[0].size > 1000000) {
            window.alert("图片要不超过1M.");
            return;
        }
        var data = new FormData();
        $.each(files, function (key, value) {
            data.append(key, value);
        });
        console.log(data);

        $("#upload-thumb-msg").html('图片上传中...');
        $("#upload-thumb-msg").show();

        $.ajax({
            url: baseURL + 'api/Areas/upload',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function (data, textStatus, jqXHR) {
                if (typeof data.error === 'undefined') {
                    if (data['status'] == true) {
                        var url = baseURL + 'uploads/' + data['file'];
                        $("#area-thumb-img").attr("src", url);
                        $("#upload-thumb-msg").html(data['file']);
                        $("#upload-thumb-msg").hide();
                    }
                }
                else {
                    // Handle errors here
                    console.log('ERRORS: ' + data.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle errors here
                console.log('ERRORS: ' + textStatus);
                // STOP LOADING SPINNER
            }
        });

    }

    //upload image for attraction
    $('#upload-point-image').on('change', uploadPointImage);

    function uploadPointImage(event) {
        event.stopPropagation(); // Stop stuff happening
        event.preventDefault(); // Totally stop stuff happening
        files = event.target.files;
        if (this.files[0].type != "image/jpeg" && this.files[0].type != "image/png") {
            window.alert("图片格式不正确.");
            return;
        }
        if (this.files[0].size > 1000000) {
            window.alert("图片要不超过1M.");
            return;
        }
        var data = new FormData();
        $.each(files, function (key, value) {
            data.append(key, value);
        });

        $("#point-image-message").html('图片上传中...');
        $("#point-image-message").show();

        $.ajax({
            url: base_url + 'api/Areas/upload',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function (data, textStatus, jqXHR) {
                if (typeof data.error === 'undefined') {
                    if (data['status'] == true) {
                        var url = base_url + 'uploads/' + data['file'];
                        $("#point-item-image").attr("src", url);
                        $("#point-item-image").show();
                        $("#pointimage").val(data['file']);

                        $("#point-image-message").html('');
                    }
                }
                else {
                    // Handle errors here
                    console.log('ERRORS: ' + data.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle errors here
                console.log('ERRORS: ' + textStatus);
                // STOP LOADING SPINNER
            }
        });

    }

    //upload audio for attraction
    $('#upload-point-audio').on('change', uploadPointAudio);

    function uploadPointAudio(event) {
        event.stopPropagation(); // Stop stuff happening
        event.preventDefault(); // Totally stop stuff happening
        files = event.target.files;
        if (this.files[0].type != "audio/mp3" && this.files[0].type != "audio/wav") {
            window.alert("录音格式不正确.");
            return;
        }
        if (this.files[0].size > 60000000) {
            window.alert("录音要不超过60M.");
            return;
        }

        $("#pointaudio_view").show();
        $("#pointaudio_view").html('录音上传中...');

        var data = new FormData();
        $.each(files, function (key, value) {
            data.append(key, value);
        });

        $.ajax({
            url: base_url + 'api/Areas/upload',
            type: 'POST',
            data: data,
//            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                $('#upload-point-audio').val('');
                if (typeof data.error === 'undefined') {
                    if (data['status'] == true) {
                        $("#pointaudio").val(data['file']);
                        $("#pointaudio_view").html(data['file']);
                    }
                }
                else {
                    // Handle errors here
                    console.log('ERRORS: ' + data.error);
                    $("#pointaudio_view").html(data.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle errors here
                console.log('ERRORS: ' + textStatus);
                $("#pointaudio_view").html(textStatus);
                // STOP LOADING SPINNER
            }
        });
    }

    //upload audio for attraction
    $('#upload-area-audio').on('change', uploadAreaAudio);

    function uploadAreaAudio(event) {

        event.stopPropagation(); // Stop stuff happening
        event.preventDefault(); // Totally stop stuff happening
        files = event.target.files;
        if (this.files[0].type != "audio/mp3" && this.files[0].type != "audio/wav") {
            window.alert("录音格式不正确.");
            return;
        }
        if (this.files[0].size > 60000000) {
            window.alert("录音要不超过60M.");
            return;
        }

        $("#area-audio-file").show();
        $("#area-audio-file").html('录音上传中...');

        var data = new FormData();
        $.each(files, function (key, value) {
            data.append(key, value);
        });
        console.log(data);

        $.ajax({
            url: base_url + 'api/Areas/upload',
            type: 'POST',
            data: data,
//            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function (data, textStatus, jqXHR) {
                if (typeof data.error === 'undefined') {
                    if (data['status'] == true) {
                        $("#area-audio-file").html(data['file']);
                    }
                }
                else {
                    // Handle errors here
                    console.log('ERRORS: ' + data.error);

                    $("#area-audio-file").html(data.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle errors here
                console.log('ERRORS: ' + textStatus);
                $("#area-audio-file").html(textStatus);
                // STOP LOADING SPINNER
            }
        });
    }

    $status = $("#page_type_name").val();
    if ($("#page_type_name").val() == 'area_add_interface') {
        $("#page_loaded_status").val("1");
    }

    if ($("#provinceName").html() != '') {
        contentSub = new Option($("#provinceName").html());
        curList = document.querySelector('#province');
        curList.add(contentSub);
    }
    if ($("#cityName").html() != '') {
        contentSub = new Option($("#cityName").html());
        curList = document.querySelector('#city');
        curList.add(contentSub);
    }
    if ($("#districtName").html() != '') {
        contentSub = new Option($("#districtName").html());
        curList = document.querySelector('#district');
        curList.add(contentSub);
    }
});
var isNewPoint = 0;

function showAddPoint() {

    showPointMarker();
    isNewPoint = 1;
    $('.point-add-view').show();
    $('.point-list-view').hide();


    $('#pointname').val('');
    $('#pointdescription').val('');
    $('#pointprice').val('');
    $('#point-view-index').val('0');
    $("#point-item-image").attr("src", '');
    $("#pointimage").val('');
    $("#pointfree").attr("checked", false);

    $("#point-item-image").hide();
    $("#pointaudio_view").html('');


}

var marker = null;

function showPointMarker() {

    markerId = markerId + 1;
    marker = new AMap.Marker({ //添加自定义点标记
        map: map,
        position: map.getCenter(), //基点位置
        offset: new AMap.Pixel(-10, -20), //相对于基点的偏移位置
        draggable: true,
        id: markerId
    });
    var position = map.getCenter();

    $('#point-position-temp').val(JSON.stringify([position['lng'], position['lat']]));
    marker.on('dragend', function (e) {
        var target = e['target']['G'];
        var position = [e['lnglat']['lng'], e['lnglat']['lat']];
        $('#point-position-temp').val(JSON.stringify(position));
        console.log($('#point-position-temp').val());
    });
}

// Add attraction to Tourist Area
function addPointFromArea(url) {

    var areaid = $('#point-list').val();
    $.post(url + "api/Areas/edit/" + areaid, '', function (result) {
        console.log(result);

        var objList = JSON.parse(result['point_list']);
        console.log(objList);
        for (var i = 0; i < objList.length; i++) {
            var obj = objList[i];
            var pointName = obj['name'];
            var pointDescription = obj['description'];
            var pointPrice = obj['price'];
            var pointImage = obj['image'];
            var pointAudio = obj['audio_1'];

            var pointFree = obj['trial'];
            var pointPosition = JSON.parse(obj['position']);

            markerId = markerId + 1;
            var marker = new AMap.Marker({ //添加自定义点标记
                map: map,
                position: pointPosition, //基点位置
                offset: new AMap.Pixel(-10, -20), //相对于基点的偏移位置
                draggable: true,
                id: markerId
            });

            marker.on('dragend', function (e) {
                var target = e['target']['G'];
                var position = [e['lnglat']['lng'], e['lnglat']['lat']];
                $('#pointposition-' + target['id']).val(JSON.stringify(position));
                console.log(target['id']);
            });

            marker.on('click', function (e) {
                var target = e['target']['G'];
                var targetId = target['id'];
                showEditPoint(targetId);
                console.log(targetId);
            });

            markList.push(marker);

            $("#pointList").append("<li id='pointitem-" + markerId + "'><div class='col-sm-6'>" + pointName + "</div>" +
                "<input style='display: none;' value='" + pointDescription + "'/>" +
                "<input style='display: none;' value='" + pointPrice + "'/>" +
                "<input id='pointposition-" + markerId + "' style='display: none;' value='" + JSON.stringify(pointPosition) + "'/>" +
                "<input style='display: none;' value='" + pointImage + "'/>" +
                "<input style='display: none;' value='" + pointAudio + "'/>" +
                "<input style='display: none;' value='" + pointFree + "'/>" +
                "<div class='col-sm-3' data-id='" + markerId + "' onclick='editPoint(this);'><a>编辑</a></div>" +
                "<div class='col-sm-3' data-id='" + markerId + "' onclick='deletePoint(this);'><a>删除</a></div>" +
                "</li>");
        }
    });
}

function addPoint(param) {
    var pointName = $('#pointname').val();
    var pointDescription = $('#pointdescription').val();
    var pointPrice = $('#pointprice').val();
    var pointImage = $('#pointimage').val();
    var pointAudio = $('#pointaudio').val();

    var pointFree = ($('#pointfree').is(":checked") == true) ? '1' : '0';
    if (pointName.length > 10) {
        window.alert("景点名称要不超过10个字符");
        return;
    }
    if (pointDescription.length > 500) {
        window.alert("景点简述要不超过500个字符");
        return;
    }

    $('.point-add-view').hide();
    $('.point-list-view').show();
    console.log(pointImage + ',' + pointAudio);

    if (param == 1) {

        var pointIndex = $('#point-view-index').val();
        var ptCenter = JSON.parse($('#point-position-temp').val());
        console.log(ptCenter + ",,," + pointIndex);
        $('#point-position-temp').val('');
        if (pointIndex == '0') {

            marker.on('dragend', function (e) {
                var target = e['target']['G'];
                var position = [e['lnglat']['lng'], e['lnglat']['lat']];
                $('#pointposition-' + target['id']).val(JSON.stringify(position));
                console.log(target['id']);
            });

            marker.on('click', function (e) {
                isNewPoint = 0;
                var target = e['target']['G'];
                var targetId = target['id'];
                showEditPoint(targetId);
                console.log(targetId);
            });

            markList.push(marker);

            $("#pointList").append("<li id='pointitem-" + markerId + "'><div class='col-sm-6'>" + pointName + "</div>" +
                "<input style='display: none;' value='" + pointDescription + "'/>" +
                "<input style='display: none;' value='" + pointPrice + "'/>" +
                "<input id='pointposition-" + markerId + "' style='display: none;' value='" + JSON.stringify([ptCenter[0], ptCenter[1]]) + "'/>" +
                "<input style='display: none;' value='" + pointImage + "'/>" +
                "<input style='display: none;' value='" + pointAudio + "'/>" +
                "<input style='display: none;' value='" + pointFree + "'/>" +
                "<div class='col-sm-3' data-id='" + markerId + "' onclick='editPoint(this);'><a >编辑</a></div>" +
                "<div class='col-sm-3' data-id='" + markerId + "' onclick='deletePoint(this);'><a>删除</a></div>" +
                "</li>");
        }
        else {
            var pointInfo = $('#pointitem-' + pointIndex).children();
            $(pointInfo[0]).text(pointName);
            $(pointInfo[1]).val(pointDescription);
            $(pointInfo[2]).val(pointPrice);
            $(pointInfo[4]).val(pointImage);
            $(pointInfo[5]).val(pointAudio);
            $(pointInfo[6]).val(pointFree);
        }
    } else {
        if (isNewPoint == 1)
            marker.setMap(null);
    }
    return marker;
}

// edit Attraction
function editPoint(e) {
    isNewPoint = 0;
    var targetId = $(e).attr('data-id');
    showEditPoint(targetId);
}

//show Point Edit window
function showEditPoint(targetId) {

    var pointInfo = $('#pointitem-' + targetId).children();
    var pointName = $(pointInfo[0]).text();
    var pointDescription = $(pointInfo[1]).val();
    var pointPrice = $(pointInfo[2]).val();
    var pointImage = $(pointInfo[4]).val();
    var pointAudio = $(pointInfo[5]).val();
    var pointFree = $(pointInfo[6]).val();
    console.log(targetId);
    $('#point-position-temp').val($('#pointposition-' + targetId).val());

    $('#pointname').val(pointName);
    $('#pointdescription').val(pointDescription);
    $('#pointprice').val(pointPrice);
    $('#point-view-index').val(targetId);

    $("#pointimage").val(pointImage);
    $("#pointaudio").val(pointAudio);
    if (pointFree == '1') { // 1-trial, 0-need pay

        $('#pointfree')[0].checked = true;
    } else {

        $('#pointfree')[0].checked = false;
    }

    $('.point-add-view').show();
    $('.point-list-view').hide();

    $("#point-item-image").attr("src", base_url + 'uploads/' + pointImage);
    $("#point-item-image").show();
    $("#pointaudio_view").html(pointAudio);
    $("#pointaudio_view").show();
}

// delete Attraction
function deletePoint(e) {
    var targetId = $(e).attr('data-id');
    for (var i = 0; i < markList.length; i++) {
        var maker = markList[i];
        var makerId = maker['G']['id'];
        if (targetId == makerId) {
            map.remove(maker);
            markList.splice(i, 1);
            break;
        }
    }
    $(e).parent().remove();
}

function addTouristArea(url, isEdit) {
    var area = $("#areaname").val();
    var rate = (parseFloat($("#arearate").val())) / 100;
    var thumb = $('#upload-thumb-msg').html();
    var overlay = $('#area-overlay').val();
    var provinceText = $('#provinceName').html();
    var cityText = $('#cityName').html();
    // var districtText = $('#districtName').html();
    var pointText = $('#city_Name').val();
    var audioText = $('#area-audio-file').html().trim();
    if (cityText == '' || provinceText == '') {
        window.alert("请选择地址");
        return;
    }

    if (area == '') {
        window.alert("请请输入名称");
        return;
    }

    if(audioText=='录音上传中...') {
        window.alert('请稍候，录音文件正在上传');
        return;
    }

    if (area.length > 10) {
        $("#custom-error-areaname").show();
        return;
    } else $("#custom-error-areaname").hide();



    var info = {
        pointText: pointText,
        overay: overlay,
        thumbnail: thumb.trim(),
        position: (($('#area-position').val() != '') ? JSON.parse($('#area-position').val()) : ''),
        audio: $('#area-audio-file').html().trim(),
        zoom: map.getZoom()
    };
    console.log(info);

    var attraction_list = getAttractions(0);

    var price = 0;
    for (var i = 0; i < attraction_list.length; i++) {
        if (attraction_list[i].trial == '1') continue;
        price += parseFloat(attraction_list[i].price);
    }

    var touristArea = {
        name: area,
        discount_rate: rate,
        address: provinceText,
        address_1: cityText,
        status: 0,
        type: 2, // 1-course,     2-area
        isforeign: 1, //1-foreign, 2-inside
        price: price,
        info: JSON.stringify(info),
        point_list: JSON.stringify(attraction_list)
    };

    var area_id = $('#point-list').val();
    var url_suffix = (area_id == undefined) ? "" : ("/" + area_id);
    $.post(url + "api/Areas/save" + url_suffix, touristArea, function (result) {
        if ((result.id) != undefined) {
            $('#point-list').val(result.id);
            touristArea['point_list'] = JSON.stringify(getAttractions(parseInt(result.id)));
            $.post(url + "api/Areas/save/" + result.id, touristArea, function (result) {


            });
        }
        window.alert("景区保存成功。");
        location.href = url + 'area';
    });
}

function getAttractions(id) {
    var ret = [];
    var area_id = id == 0 ? $('#point-list').val() : id;
    var list = document.getElementById('pointList');
    var pointList = list.getElementsByTagName('li');

    for (var i = 0; i < pointList.length; i++) {
        var pointInfo = $(pointList[i]).children();
        var pointName = $(pointInfo[0]).text();
        var pointDescription = $(pointInfo[1]).val();
        var pointPrice = $(pointInfo[2]).val();
        var pointPosition = $(pointInfo[3]).val();
        var pointImage = $(pointInfo[4]).val();
        var pointAudio = $(pointInfo[5]).val();
        var pointFree = $(pointInfo[6]).val();

        var point = {
            id: area_id + "_" + (i + 1),
            name: pointName,
            description: pointDescription,
            price: pointPrice == '' ? '0' : pointPrice,
            discount_rate: '1',
            image: pointImage,
            audio_1: pointAudio,
            audio_2: pointAudio,
            audio_3: pointAudio,
            trial: pointFree,
            position: pointPosition
        };
        ret.push(point);
    }
    return ret;//JSON.stringify(ret);
}

function deleteAreaConfirm(id) {
    $('#custom-confirm-delete-view').show();
    $('#current-areaid').val(id);
}

function deleteArea(url, type) {

    $('#custom-confirm-delete-view').hide();
    if (type == 1) {
        $.post(url + "api/Areas/remove/" + $('#current-areaid').val(), function (result) {
            location.href = url + 'area';
        });
    }
}

function deployAreaConfirm(id) {

    $('#custom-confirm-deploy-view').show();
    $('#current-areaid').val(id);
    $('#current-areastatus').val(1);
}

function undeployAreaConfirm(id) {

    $('#custom-confirm-deploy-view').show();
    $('#current-areaid').val(id);
    $('#current-areastatus').val(0);
}

function deployArea(url, type) {

    $('#custom-confirm-deploy-view').hide();
    if (type == 1) { //if ok button clicked

        var touristArea = {
            id: $('#current-areaid').val(),
            status: $('#current-areastatus').val()
        };

        $.post(url + "api/Areas/save/" + touristArea['id'], touristArea, function (result) {
            location.href = url + 'area';
        });
    }
}

function uploadOverlay() {
    if ($("#page_loaded_status").val() == '1') {
        $('#upload-overlay').val('');
        $('#upload-overlay').click();
    } else {
        alert("页加载中. 请等一下.");
    }
}

function uploadThumb() {
    if ($("#page_loaded_status").val() == '1') {
        $('#upload-thumb-file').val('');
        $('#upload-thumb-file').click();
    } else {
        alert("页加载中. 请等一下.");
    }
}

function deleteThumb() {
    $('#upload-thumb-msg').html('');
    $("#area-thumb-img").attr("src", baseURL + 'assets/images/default.png');
}

function uploadPointImage() {
    if ($("#page_loaded_status").val() == '1') {
        $('#upload-point-image').val('');
        $('#upload-point-image').click();
    } else {
        alert("页加载中. 请等一下.");
    }
}

function uploadPointAudio() {

    if ($("#page_loaded_status").val() == '1') {
        $('#upload-point-audio').val('');
        $('#upload-point-audio').click();
    } else {
        alert("页加载中. 请等一下.");
    }
}

function uploadAreaAudio() {
    if ($("#page_loaded_status").val() == '1') {
        $('#upload-area-audio').val('');
        $('#upload-area-audio').click();
    } else {
        alert("页加载中. 请等一下.");
    }
}

function searchMapArea() {
    var city = $("#city_Name").val();
    $("#city_Name").val('');
    $('#detail_editing_panel').show();
    $("#city_Name").val(city);
}