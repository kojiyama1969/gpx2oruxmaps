
      function convertgpx(event){
	  // this is for 8.5.5
	  var typeTable = { "Left":"左", "Right":"右", "Slight Left":"やや左", "Slight Right":"やや右", "Sharp Left":"左に急カーブ", "Sharp Right":"右に急カーブ", "Straight":"そのまま進行", "Uturn":"リターン", "Summit":"頂上", "Water":"水飲み場", "Food":"レストラン", "Danger":"危険地帯", "First Aid":"救急車", "Control":"情報案内", "Generic":"ポイント", "Sprint":"写真"};
	  // this is for 7.x
	  // var typeTable = { "Left":"左", "Right":"右", "Slight Left":"Slight Left", "Slight Right":"Slight Right", "Sharp Left":"Turn Sharp Left", "Sharp Right":"Turn Sharp Right", "Straight":"そのまま進行", "Uturn":"リターン", "Summit":"頂上", "Water":"水飲み場", "Food":"レストラン", "Danger":"危険地帯", "First Aid":"Ambulance", "Control":"情報案内", "Generic":"ポイント", "Sprint":"写真"};
	  var items = document.getElementById("download_item");
	  var li = document.createElement("li");
	  var serializer = new XMLSerializer();
	  var modifyFlag = false;
	  var dom = new DOMParser();
	  var doc = dom.parseFromString(event.target.result,"application/xml");
	  var e = doc.firstChild;
	  if(e != null && e.tagName == "gpx"){
	      var elements = doc.getElementsByTagName("wpt");
	      for(var e of elements){
		      var names = e.getElementsByTagName("name");
		      if(names.length > 0){
			  	var sym = doc.createElementNS(e.namespaceURI, "sym");
			  	sym.textContent = "Waypoint";
			  	var type = doc.createElementNS(e.namespaceURI, "type");
			  	if(names[0].textContent in typeTable){
			    	type.textContent = typeTable[names[0].textContent];
			  	}else{
			    	type.textContent = "Dot";
			  	}
			  	var newName = doc.createElementNS(e.namespaceURI, "name");
			  	newName.textContent = "";
			  	var descs = e.getElementsByTagName("desc");
			  	if(descs.length > 0){
					newName.textContent = descs[0].textContent;
			  	}
			  	e.replaceChild(newName,names[0]);

			  	var oldSym = e.getElementsByTagName("sym");
			  	if(oldSym.length > 0){
			    	e.replaceChild(sym,oldSym[0]);
			  	}
			  	var oldType = e.getElementsByTagName("type");
			  	if(oldType.length > 0){
			    	e.replaceChild(type,oldType[0]);
			  	}
			  }
			  modifyFlag = true;
		  }
	      if(modifyFlag){
		  var img = document.createElement("img");
		  img.src = "img/GPX_icon-vector.svg";
		  var output = serializer.serializeToString(doc);
		  var blob = new Blob([output], {type: 'application/gpx+xml'});
		  var url = URL.createObjectURL(blob);
		  var a = document.createElement("a");
		  a.download = this.file.name;
		  a.href = url;
		  a.appendChild(img);
		  a.appendChild(document.createTextNode(this.file.name));
		  li.appendChild(a);
	      }else{
		  li.textContent = this.file.name + " is NOT modified.";
	      }
	  }else{
	      li.textContent = this.file.name + " is NOT a gpx file.";
	  }
	  items.appendChild(li);
      }

      function errorgpx(event){
	  var items = document.getElementById("download_item");
	  var li = document.createElement("li");
	  li.textContent = this.file.name + " is NOT read.";
	  items.appendChild(li);
      }
      
      function selectedFiles(files){
	  if(files.length > 0){
	      for(var i = 0, f;f = files[i];i++){
		  var reader = new FileReader();
		  reader.addEventListener('load',{handleEvent: convertgpx, file: f});
		  reader.addEventListener('error',{handleEvent: errorgpx, file: f});
		  reader.readAsText(f);
	      }
	  }else{
	      var items = document.getElementById("download_item");
	      var li = document.createElement("li");
	      li.textContent = "It is NOT a file.";
	      items.appendChild(li);
	  }
      }
      
      function showDropZoneEnter(){
	  var dropZone = document.getElementById('drop_zone');
	  dropZone.style.backgroundColor = 'lightsteelblue';
      }
      function showDropZoneLeave(){
	  var dropZone = document.getElementById('drop_zone');
	  dropZone.style.backgroundColor = 'aliceblue';
      }

      function handleFileDrop(evt){
	  evt.stopPropagation();
	  evt.preventDefault();

	  selectedFiles(evt.dataTransfer.files);
	  showDropZoneLeave();
      }
      function handleFileSelect(evt){
	  selectedFiles(evt.target.files);
      }
      function handleDragOver(evt){
	  evt.stopPropagation();
	  evt.preventDefault();
	  evt.dataTransfer.dropEffect = 'copy';
	  showDropZoneEnter();
      }
      function handleDragLeave(evt){
	  evt.stopPropagation();
	  evt.preventDefault();
	  evt.dataTransfer.dropEffect = 'none';
	  showDropZoneLeave();
      }
      function handleDragEnd(evt){
	  evt.stopPropagation();
	  evt.preventDefault();
	  showDropZoneLeave();
      }
      
      document.getElementById('files').addEventListener('change',handleFileSelect);
      var dropZone = document.getElementById('drop_zone');
      dropZone.addEventListener('dragover', handleDragOver, false);
      dropZone.addEventListener('dragleave', handleDragLeave, false);
      dropZone.addEventListener('dragend', handleDragEnd, false);
      dropZone.addEventListener('drop', handleFileDrop, false);
