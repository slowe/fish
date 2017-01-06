
function SVG(id){
	if(!id) return this;
	this.canvas = S('#'+id);
	this.w = this.canvas[0].offsetWidth;
	this.h = this.canvas[0].offsetHeight;
	
	this.canvas.html('<svg height="'+this.h+'" version="1.1" width="'+this.w+'" xmlns="http://www.w3.org/2000/svg"><desc>Created by stuQuery SVG</desc></svg>');
	this.paper = S(this.canvas.find('svg')[0]);
	
	// Initialise
	this.nodes = new Array();
	this.clippaths = new Array();
	
	function Node(inp){
		for(var i in inp){
			this[i] = inp[i];
		}
		var _obj = this;
		this.attr = function(a){
			_obj.attributes = a;
			return _obj;
		}
		return this;
	}
	
	this.circle = function(x,y,r){
		this.nodes.push(new Node({'cx':x,'cy':y,'r':r,'type':'circle'}));
		return this.nodes[this.nodes.length-1];
	}
	this.rect = function(x,y,w,h,r){
		this.nodes.push(new Node({'x':x,'y':y,'width':w,'height':h,'r':r,'rx':r,'ry':r,'type':'rect'}));
		return this.nodes[this.nodes.length-1];
	}
	this.path = function(path){
		this.nodes.push(new Node({'d':path,'type':'path'}));
		return this.nodes[this.nodes.length-1];
	}
	this.clip = function(o){
		this.clippaths.push(new Node(o))
		return this.clippaths[this.clippaths.length-1];
	}

	return this;
}
SVG.prototype.clear = function(){
	this.nodes = new Array();
	this.clippaths = new Array();
	this.draw();
	return this;
}	
SVG.prototype.draw = function(){
	var dom = "<desc>Created by stuQuery SVG</desc>";
	if(this.clippaths.length > 0){
		dom += '<defs>';
		for(var i = 0; i < this.clippaths.length; i++){
			dom += '<clipPath id="'+this.clippaths[i].id+'">';
			if(this.clippaths[i].type){
				dom += '<'+this.clippaths[i].type;
				// Add properties
				for(var j in this.clippaths[i]){
					if(j != "type" && typeof this.clippaths[i][j]!=="function" && j != "attributes") dom += ' '+j+'="'+this.clippaths[i][j]+'"';
				}
				dom += ' />';
			}
			dom += '</clipPath>';
		}
		dom += '</defs>';
	}

	for(var i = 0; i < this.nodes.length; i++){
		if(this.nodes[i].type){
			dom += '<'+this.nodes[i].type;
			// Add properties
			for(var j in this.nodes[i]){
				if(j != "type" && typeof this.nodes[i][j]!=="function" && j != "attributes") dom += ' '+j+'="'+this.nodes[i][j]+'"';
			}
			// Add attributes
			for(var a in this.nodes[i].attributes){
				dom += ' '+a+'="'+(a == "clip-path" ? 'url(#':'')+this.nodes[i].attributes[a]+(a == "clip-path" ? ')':'')+'"';
			}
			dom += ' />';
		}
	}
	this.paper.html(dom);
	return this;
}

/*
<defs>
    <clipPath id="cut-off-bottom">
      <rect x="0" y="0" width="200" height="100" />
    </clipPath>
  </defs>
  <circle cx="100" cy="100" r="100" clip-path="url(#cut-off-bottom)" />
  <ellipse cx="190" cy="100" rx="30" ry="20" fill="#bf0000" stroke="#bf0000" style="fill-opacity: 0; cursor: move;" fill-opacity="0" stroke-width="2">
  */