
function convertgpx(event) {
	var templateString = `<?xml version="1.0" encoding="utf-8"?>
<Route>
  <Id>0</Id>
  <Distance>0</Distance>
  <Duration>0</Duration>
  <Ascent>0.0</Ascent>
  <Descent>0.0</Descent>
  <Encode>0</Encode>
  <Lang>0</Lang>
  <TracksCount>0</TracksCount>
  <Tracks></Tracks>
  <Navs />
  <Points>
  </Points>
</Route>
`;
/*
	waypoint definition for cnx
	0: ウェイポイント
	1: スプリントポイント
	2: ヒルクライム
	3: レベル1クライミング
	4: レベル2クライミング
	5: レベル3クライミング
	6: レベル4クライミング
	7: サプリポイント（食事）
	8: ゴミ収集場
	9: トイレ
	10: サービスポイント
	11: 医療援助ステーション
	12: 装備エリア
	13: ショップ
	14: 集合ポイント
	15: 展望台
	16: インスタ映え場所
	17: トンネル
	18: 谷
	19: 危険な道路
	20: 急カーブ
	21: 急斜面
	22: 交差点
*/
	var typeTable = {
		"Left": 0,
		"Right": 0,
		"Slight Left": 0,
		"Slight Right": 0,
		"Sharp Left": 0,
		"Sharp Right": 0,
		"Straight": 0,
		"Uturn": 0,
		"Summit": 15,
		"Valley": 18,
		"Water": 10,
		"Food": 7,
		"Danger": 19,
		"First Aid": 11,
		"Control": 14,
		"Climb": 2,
		"4th Category": 6,
		"3rd Category": 5,
		"2nd Category": 4,
		"1st Category": 3,
		"Hors Category": 2,
		"Sprint": 1,
		"Generic": 16
	 };
	var items = document.getElementById("download_item");
	var li = document.createElement("li");
	var serializer = new XMLSerializer();
	var modifyFlag = false;
	var dom = new DOMParser();
	var newDoc = dom.parseFromString(templateString, 'application/xml');
//	var newDoc = document.implementation.createDocument('','',null);
	var doc = dom.parseFromString(event.target.result, "application/xml");
	var e = doc.firstChild;
	var tracksCount = 0;
	var tracks = '';
	if (e != null && e.tagName.toUpperCase() === 'GPX') {
		var elements = doc.getElementsByTagName('trkpt');
		for (var e of elements) {
			var eleElements = e.getElementsByTagName('ele');
			if (eleElements.length > 0) {
				var lat = e.getAttribute('lat');
				var lon = e.getAttribute('lon');
				var ele = Math.round(Number(eleElements[0].textContent) * 100);
				tracks += `${lat},${lon},${ele};`;
				tracksCount++;
			}
		}
		var tracksCountElements = newDoc.getElementsByTagName('TracksCount');
		if(tracksCountElements.length > 0){
			tracksCountElements[0].textContent = tracksCount;
		}
		var tracksElements = newDoc.getElementsByTagName('Tracks');
		if(tracksElements.length > 0){
			tracksElements[0].textContent = tracks;
		}

		var newPointsElements = newDoc.getElementsByTagName('Points');
		if(newPointsElements.length > 0){
			var elements = doc.getElementsByTagName('wpt');
			for (var e of elements){
				var descr = '';
				var pointType = 0;
				var cmtElements = e.getElementsByTagName('cmt');
				var nameElements = e.getElementsByTagName('name');
				var lon = e.getAttribute('lon');
				var lat = e.getAttribute('lat');
				if(cmtElements.length > 0){
					descr = cmtElements[0].textContent;
					if(nameElements.length > 0){
						if(nameElements[0].textContent in typeTable){
							pointType = typeTable[nameElements[0].textContent];
						}
					}
				}else{
					if(nameElements.length > 0){
						descr = nameElements[0].textContent;
					}
				}
				var pointElement = newDoc.createElement('Point');
				var lonElement = newDoc.createElement('Lng');
				lonElement.textContent = lon;
				var latElement = newDoc.createElement('Lat');
				latElement.textContent = lat;
				var typeElement = newDoc.createElement('Type');
				typeElement.textContent = pointType;
				var descrElement = newDoc.createElement('Descr');
				descrElement.textContent = descr;
				pointElement.appendChild(latElement);
				pointElement.appendChild(lonElement);
				pointElement.appendChild(typeElement);
				pointElement.appendChild(descrElement);
				newPointsElements[0].appendChild(pointElement);
			}
		}
		modifyFlag = true;

		if (modifyFlag) {
			var img = document.createElement("img");
			img.src = "img/GPX_icon-vector.svg";
			var output = serializer.serializeToString(newDoc);
			var blob = new Blob([output], { type: 'application/gpx+xml' });
			var url = URL.createObjectURL(blob);
			var a = document.createElement("a");
			a.download = this.file.name+".cnx";
			a.href = url;
			a.appendChild(img);
			a.appendChild(document.createTextNode(this.file.name+".cnx"));
			li.appendChild(a);
		} else {
			li.textContent = this.file.name + " is NOT modified.";
		}
	} else {
		li.textContent = this.file.name + " is NOT a gpx file.";
	}
	items.appendChild(li);
}

function errorgpx(event) {
	var items = document.getElementById("download_item");
	var li = document.createElement("li");
	li.textContent = this.file.name + " is NOT read.";
	items.appendChild(li);
}

function selectedFiles(files) {
	if (files.length > 0) {
		for (var i = 0, f; f = files[i]; i++) {
			var reader = new FileReader();
			reader.addEventListener('load', { handleEvent: convertgpx, file: f });
			reader.addEventListener('error', { handleEvent: errorgpx, file: f });
			reader.readAsText(f);
		}
	} else {
		var items = document.getElementById("download_item");
		var li = document.createElement("li");
		li.textContent = "It is NOT a file.";
		items.appendChild(li);
	}
}

function showDropZoneEnter() {
	var dropZone = document.getElementById('drop_zone');
	dropZone.style.backgroundColor = 'lightsteelblue';
}
function showDropZoneLeave() {
	var dropZone = document.getElementById('drop_zone');
	dropZone.style.backgroundColor = 'aliceblue';
}

function handleFileDrop(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	selectedFiles(evt.dataTransfer.files);
	showDropZoneLeave();
}
function handleFileSelect(evt) {
	selectedFiles(evt.target.files);
}
function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy';
	showDropZoneEnter();
}
function handleDragLeave(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'none';
	showDropZoneLeave();
}
function handleDragEnd(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	showDropZoneLeave();
}

document.getElementById('files').addEventListener('change', handleFileSelect);
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('dragleave', handleDragLeave, false);
dropZone.addEventListener('dragend', handleDragEnd, false);
dropZone.addEventListener('drop', handleFileDrop, false);
