define(['dojo/_base/declare', 
'jimu/BaseWidget',
'esri/graphic',
'dojo/parser',
'dojo/dom',
'dojo/on',
'dijit/_WidgetBase',
'dijit/_AttachMixin',
'dojo/_base/lang',
'esri/graphic',
'esri/graphicsUtils',
"esri/geometry/Point",
'esri/geometry/Extent', 
"esri/SpatialReference", 
'esri/geometry/Geometry',
'esri/layers/GraphicsLayer',
"esri/symbols/SimpleMarkerSymbol",
"esri/Color", 
"esri/InfoTemplate", 
"esri/graphic",
"esri/tasks/IdentifyTask",
'esri/tasks/IdentifyParameters',
"esri/dijit/InfoWindow"],
function(declare, BaseWidget,Graphic,parser,dom, on,_WidgetBase,_AttachMixin,lang,Graphic, 
graphicsUtils,Point,Extent,SpatialReference,Geometry,GraphicsLayer,SimpleMarkerSymbol,Color,InfoTemplate,Graphic,IdentifyTask,IdentifyParameters,InfoWindow) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {
    // Custom widget code goes here 
	
    baseClass: 'jimu-widget-globals_test',
	//graphics: null,
	
	//methods to communication with app container:

    // onMinimize: function(){
    //   console.log('onMinimize');
    // },

    // onMaximize: function(){
    //   console.log('onMaximize');
    // },

    // onSignIn: function(credential){
    //   /* jshint unused:false*/
    //   console.log('onSignIn');
    // },

    // onSignOut: function(){
    //   console.log('onSignOut');
    // }
      
    // onPositionChange: function(){
    //   console.log('onPositionChange');
    // },

    // resize: function(){
    //   console.log('resize');
    // }
	postCreate: function() {
      this.inherited(arguments);	 
	  console.log('postCreate');
	  //this._test("test");
    },

    startup: function() {
      this.inherited(arguments);
      //this.mapIdNode.innerHTML = 'map id:' + this.map.id;
      console.log('startup');
	  
    },

    onOpen: function(){
      console.log('onOpen');
    },

    onClose: function(){
      
		//dom.byId("searchMsg").innerHTML = "";
		//dom.byId("searchMsg").innerHTML = "";
		//dom.byId("resultsDiv").innerHTML = "";
		//dom.byId("myTextBox").value = "5440 Fulton Industrial";
		this.map.infoWindow.hide();
		//this.map.graphics.clear();
		console.log('onClose Worked');
    },
	_ClearResults: function(){
      
		dom.byId("searchMsg").innerHTML = "";
		dom.byId("searchMsg").innerHTML = "";
		dom.byId("resultsDiv").innerHTML = "";
		dom.byId("myTextBox").value = "";
		dom.byId("clearButton").style.visibility = "hidden";
		this.map.infoWindow.hide();
		
		//this.map.graphics.clear();
		console.log('onClose Hello Worked');
    },
	//_test: function(val){
	//	console.log("Start");
	//	alert(val);
	//},
	_hitEnter: function(event){ 
		//console.log(event.keyCode);
		if(event.keyCode == 13){
			console.log("Good"); 
			this._getData();
			console.log("Good"); 
			}
	},
	_getData: function(){ 
		parser.parse();  
		
		this.map.infoWindow.hide();
		this.map.graphics.clear();
		dom.byId("resultsDiv").innerHTML = "";
		this.map.graphics.clear();				
		//var srcString = dijit.byId("myTextBox").get("value");
		var srcString = document.getElementById("myTextBox").value; 
		if(srcString == ""){
			dom.byId("searchMsg").innerHTML = "<font color='red'>Please enter search parameters above</font>";
			return;
		}		
		dom.byId("loading").style.visibility = "visible";
		dom.byId("clearButton").style.visibility = "visible";
		var hostname = window.location.hostname;		
		if(hostname == "gis.fultoncountyga.gov"){
			var myurl = "https://"+hostname+"/Apps/GlobalSearch/GlobalSearch.php";
		}
		else{
			var myurl = "http://"+hostname+"/Apps/GlobalSearch/GlobalSearch.php";
		}		
		console.log("Url: "+myurl);
		dojo.xhrGet({
			url: myurl,
			handleAs: "json",
			content:{token: srcString},
			load: lang.hitch(this, function(data) {
				if (data.length < 1) {
					dom.byId("searchMsg").innerHTML = "Your search returned no results. Please check your spelling or try alternatives.";
					dom.byId("loading").style.visibility = "hidden";
				}
				else {
					if (data.length == 100) {
						dom.byId("searchMsg").innerHTML = "Your search exceeded the maximum of 100 results.  Try making your search more specific.";
					}
					else {
						if (data.length == 1) {
							dom.byId("searchMsg").innerHTML = "Your search returned 1 result.";
						}
						else {
							dom.byId("searchMsg").innerHTML = "Your search returned " + data.length + " results.<BR>";
						}
					}
					var lastFeatType = "";
					var buffer = 1000;
					for (var i=0;i<data.length;i++) {
						var obj = data[i];
						var name = obj["Name"];
						//var linkname = "<a href='javascript:"+this._test("Hello Sir");+"'>"+name+"</a>";
						var objid = obj["ObjId"];
						var featid = obj["FeatureID"];
						//alert(name);					
						var featType = obj["FeatType"];
						var showInfo = false;
						var rank = obj["Rank"];
						var minx = parseInt(obj["MinX"]) - buffer;
						var miny = parseInt(obj["MinY"]) - buffer;
						var maxx = parseInt(obj["MaxX"]) + buffer;
						var maxy = parseInt(obj["MaxY"]) + buffer;
						var labelx = parseInt(obj["LabelX"]);
						var labely = parseInt(obj["LabelY"]);
						//highlightResult(labelx, labely);
						if (featType != lastFeatType) {
							if (i > 0) {
								dojo.place(ul,"resultsDiv");
							}
							var span = dojo.doc.createElement("span");
							dojo.addClass(span, "resultType");
							
							span.innerHTML = featType;
							dojo.place(span,"resultsDiv");
							var ul = dojo.doc.createElement("ul");
						}
						
						//showInfo = 'false';
						var nameParam = name.replace(/\s/g,"_");
						if (featType == 'Tax Parcels' || featType == "Addresses"){
							showInfo = 'true';
							//alert(featType);
						}
						var li = dojo.doc.createElement("li");
						li.id = name;
						li.tag = minx+","+miny+","+maxx+","+maxy+","+labelx+","+labely+","+showInfo+","+nameParam;  
						var mytag = minx+","+miny+","+maxx+","+maxy+","+labelx+","+labely+","+showInfo+","+nameParam;
						this.own(on(li, 'click', lang.hitch(this, this._onClick, mytag )));
						//this.own(on(li, 'click', lang.hitch(this, this._test, "test")));
						
						//var nameParam = name.replace(/\s/g,"_");
						var featTypeParam = featType.replace(/\s/g,"_");
						//alert(name);
						li.innerHTML =	"<span style='color: blue; font-size: 9pt; cursor: pointer;'>"+name+"</span>"; //name; 
						
						dojo.byId(ul).appendChild(li);
						lastFeatType = featType;
						dom.byId("loading").style.visibility = "hidden";
					}
					dojo.place(ul,"resultsDiv");
				}
			}),
			error: function() {
				alert("error");
			}			
			
		}); 
	},
	
	_onClick: function(tag){
		//alert("Set");
		//console.log(evt.target.tag);
		this.map.infoWindow.hide();
		this.map.graphics.clear();
		//var mystring = evt.target.tag;
		var mystring = tag;
		var myarray = mystring.split(",");
		var minx = parseInt(myarray[0]);
		var miny = parseInt(myarray[1]);
		var maxx = parseInt(myarray[2]);
		var maxy = parseInt(myarray[3]);
		var labelx = parseInt(myarray[4]);
		var labely = parseInt(myarray[5]);
		var showInfo = myarray[6];
		var location = myarray[7];
		
		resultSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 9,
		new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, 
		new dojo.Color([255,0,0,1]), 3),
		new dojo.Color([255,255,255,1]));
				
		highlightSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 12,
		new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, 
		new dojo.Color([255,0,0,1]), 5),
		new dojo.Color([255,255,255,1]));
					
		var highlightPoint = this.map.extent.getCenter();
		var highlightGraphic = new esri.Graphic(highlightPoint, highlightSymbol);
		
		dojo.connect(dijit.byId('map'), 'resize', this.map, this.map.resize);	   
		var anchorx = labelx;
		var anchory = labely;
			
		var resultExtent = new esri.geometry.Extent(minx,miny,maxx,maxy,this.map.spatialReference);
		this.map.setExtent(resultExtent);
			
		selectedResult = location.replace(/_/g," ");
			
		if (showInfo == 'true') {
			window.setTimeout(lang.hitch(this,function (anchorx, anchory) {
				if (document.createEvent) {
					//console.log(this.map.id);
					var evt = document.createEvent("MouseEvents");
					evt.initEvent("mousedown", true, true);
					evt.mapPoint = new esri.geometry.Point(labelx, labely, this.map.spatialReference);
					this.mapTipDelay = setTimeout(
						lang.hitch(this, function(){ this._executeIdentifyTask(evt)}),
						500
					);
					//console.log("identify executed on mouse click");
				}
				else if (document.createEventObject) {
					var evt = document.createEventObject();
					evt.mapPoint = new esri.geometry.Point(labelx, labely, map.spatialReference);
					executeIdentifyTask(evt,'fromSearchResults');
					//console.log("identify executed");
				}
			},1000));
		}
	},
	_executeIdentifyTask: function(evt){
		//alert("Hello3");
		var hostname = window.location.hostname;
		if((hostname == "gis.fultoncountyga.gov")||(hostname == "gisstaging.fultoncountyga.gov")){
			var findBaseMapTaskServiceUrl = "https://gis.fultoncountyga.gov/arcgis/rest/services/MapServices/ParcelQuery/MapServer";			
		}
		else{
			var findBaseMapTaskServiceUrl = "http://gisapps.co.fulton.ga.us/arcgis/rest/services/MapServices/ParcelQuery/MapServer";	
		}
		
		identifyTask = new esri.tasks.IdentifyTask(findBaseMapTaskServiceUrl); 		
		console.log("Find urlrrrr "+findBaseMapTaskServiceUrl);
		identifyParams = new esri.tasks.IdentifyParameters();
		identifyParams.tolerance = 1;
		identifyParams.returnGeometry = true;
		identifyParams.layerIds = [0];
		identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
		identifyParams.geometry = evt.mapPoint;
		identifyParams.mapExtent = this.map.extent;
		identifyTask.execute(identifyParams, lang.hitch(this,function(idResults) { this._showInfo(idResults, evt); }));	
	},
	_showInfo: function(idResults, evt){
		console.log("inside showinfo");
		console.log(idResults.length);
		var owner = "";
		var characterType = "";
		var zoning = "";
		var landuse = "";
		var layerFound = false;
		var content = "<div class='infoContent'>";
		var parcelCount = 0;
			
		if (selectedResult) {
			this.map.infoWindow.setTitle(selectedResult);
		}
		else {
			this.map.infoWindow.setTitle("Property Information");
		}
		this.map.infoWindow.show(evt.mapPoint);		
		for (var i=0, il=idResults.length; i<il; i++) {
			var result = idResults[i];
			var feature = result.feature;
			if (result.layerId === 0) {
				parcelCount++;
				layerFound = true;
				taxpin = feature.attributes["ParcelID"];
				situs = feature.attributes["Address"];
				owner = feature.attributes["Owner"];
				totAppr = feature.attributes["TotAppr"];
				console.log(totAppr);
				totAppr = "$"+totAppr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				landAcres = feature.attributes["LandAcres"];
				objectid = feature.attributes.OBJECTID;
				if (taxpin.indexOf('C') == 11) {
					content += "<div><table><tr><td>Parcel ID:</td><td>"+taxpin+"</td></tr><tr><td colspan='2'>This is a common property.  No further details are available.</td></tr></table><br>";
				}
				else {
					if (parcelCount > 1) {
						content += "<hr>";
					}
					content += "<div><table><tr><td>Parcel ID:</td><td>"+taxpin+"</td></tr><tr><td>Parcel Address:</td>";
					content += "<td>"+situs+"</td></tr><tr><td>Owner:</td><td>"+owner+"</td></tr><tr><td>Total Appraised:</td><td>"+totAppr+"</td></tr><tr><td>Area:</td><td>"+landAcres+" acres</td></tr></table>";
					
					content += "<br><span id='myobject' style='color: blue; font-size: 8pt; cursor: pointer;'>View Full Property Profile</span><br>";
					
				}
			}
		}
		
		this._showResults(idResults);
		content += "</div>";
		if (layerFound) {
			this.map.infoWindow.setContent(content);
			console.log(taxpin);
			var node = dom.byId("myobject");
			this.own(on(node, 'click', lang.hitch(this, this._activateDialog, encodeURI(taxpin))));
			//var node = dom.byId("mydialog");
			//this.own(on(node, 'click', lang.hitch(this, this._activateDialog("pin"))));
			//on(node, 'click', this._activateDialog("pin"));
		}
	},
	_showResults: function(results){
		console.log("test");
		this.markerSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([0, 255, 0, 0.25]));
		this.lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 1);
		this.polygonSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([255, 0, 0, 0.10]));
		this.map.graphics.clear();
		//Build an array of attribute information and add each found graphic to the map
		var i = 0;
		dojo.forEach(results, lang.hitch(this, function(result) {
			this.graphic = result.feature;
			switch (result.feature.geometry.type) {
				case "point":
					this.graphic.setSymbol(this.markerSymbol);
					break;
				case "polyline":
					this.graphic.setSymbol(this.lineSymbol);
					break;
				case "polygon":
					this.graphic.setSymbol(this.polygonSymbol);
					break;
			}
			if(i == 0){
				this.map.graphics.add(this.graphic);
			}
			i++;
		}));
	},
    _activateDialog: function(pin){
		var hostname = window.location.hostname;
		if(hostname == "gisapps"){hostname = "gisapps.co.fulton.ga.us";}
		console.log(hostname);		
		if((hostname == "gis.fultoncountyga.gov")||(hostname == "gisstaging.fultoncountyga.gov")){
			detailsSrc = "https://gis.fultoncountyga.gov/Apps/PropertyProfile/PropertyProfileSimple.html?pin="+decodeURIComponent(pin);
		}
		else{
			//hostname = hostname.replace('gisapps','gisapps.co.fulton.ga.us');
			detailsSrc = "http://"+hostname+"/Apps/PropertyProfile/PropertyProfileSimple.php?pin="+decodeURIComponent(pin);
			
		}
		console.log(detailsSrc);
		var htmlFragment = '<div id="detailsDiv" title="Property Profile" style="width: 840px; height: 600px; border: 1px solid #A8A8A8;">';
		htmlFragment += '<iframe id="detailsFrame" src="'+detailsSrc+'" style="border-width: 0px;" width="98%" height="98%"></iframe>';
		htmlFragment += '</div>';
	    // CREATE DIALOG
          dialogBox = new dijit.Dialog({
            title: "Property Profile",
            content: htmlFragment,
            autofocus: !dojo.isIE, // NOTE: turning focus ON in IE causes errors when reopening the dialog
            refocus: !dojo.isIE
          });
           // DISPLAY DIALOG
          dialogBox.show();
        },



//methods to communication between widgets:

  });
});