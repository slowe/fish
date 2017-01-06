var fish;
S(document).ready(function(){

	fish = new Fish('fish',600,400);

	// Create an initial fish
	fish.update();
	
	// Add event to button
	S('#new').on('click',function(e){ fish.create().draw(); });		

	// Add event to button
	S('#rounding').on('click',function(e){ fish.rounded = Math.random(); fish.paper.clear(); fish.draw(); });		

});

function Fish(id,w,h){
	
	this.aspectratio = w/h;
	this.id = id;
	this.rounded = Math.random();

	var points = new Array(10);

	var eye;
	var path = "";
	var colours = {
		"c1": { "bg": "#2254F4", "text": "white" },
		"c2": { "bg": "#178CFF", "text": "white" },
		"c3": { "bg": "#00B6FF", "text": "white" },
		"c4": { "bg": "#08DEF9", "text": "black" },
		"c5": { "bg": "#1DD3A7", "text": "white" },
		"c6": { "bg": "#0DBC37", "text": "white" },
		"c7": { "bg": "#67E767", "text": "white" },
		"c8": { "bg": "#722EA5", "text": "white" },
		"c9": { "bg": "#E6007C", "text": "white" },
		"c10": { "bg": "#EF3AAB", "text": "white" },
		"c11": { "bg": "#D73058", "text": "white" },
		"c12": { "bg": "#D60303", "text": "white" },
		"c13": { "bg": "#FF6700", "text": "white" },
		"c14": { "bg": "#F9BC26", "text": "black"}
	}

	function inRange(lo,hi){
		return Math.min(Math.max(lo,Math.random()),hi);
	}

	var _obj = this;
	// We'll need to change the sizes when the window changes size
	window.addEventListener('resize', function(event){ _obj.resize(); });

	this.size = function(){
		S('#'+this.id).css({'height':''});
		w = S('#'+this.id)[0].offsetWidth;
		S('#'+this.id).css({'height':(w/this.aspectratio)+'px'});
		this.paper = new SVG(this.id);
		w = this.paper.w;
		h = this.paper.h;
		return this;
	}
	this.resize = function(){
		this.size();
		this.paper.clear();
		this.draw();
		return this;
	}
	this.update = function(){ this.create().draw(); }
	this.create = function(){

		this.paper.clear();
		this.colour = colours['c'+Math.ceil(Math.random()*14)].bg;
		
		front = inRange(0.1,0.9);
		back = inRange(0.1,0.9);

		points = new Array(10);

		// Start with nose
		points[0] = { x: 0.1, y: 0.5 - front*(Math.random()-0.5)*0.5 };
		points[1] = { x: points[0].x, y: points[0].y - front*Math.random()*0.2 };

		// Slightly move top of nose forwards
		points[1].x -= (1-Math.pow(front,2))*0.02;

		// Add head
		points[2] = {x: 0.3, y:((1 - front)/2)};
		points[9] = {x: 0.3, y:((1 + front)/2)};

		// Add end of body
		points[3] = {x: 0.7, y: ((1 - back)/2)};
		points[8] = {x: 0.7, y: 0.8};

		// Add start of tail
		points[4] = {x: 0.83, y: 0.45 };
		points[7] = {x: 0.83, y: 0.55 };

		// Add start of tail
		points[5] = {x: 0.9,y: 0.4 };
		points[6] = {x: 0.9,y: 0.6 };

		eye = { x: points[0].x + (points[2].x-points[0].x)*0.75, y: (points[1].y - inRange(0,0.6)*Math.abs(points[2].y - points[1].y)) };

		return this;
	}
	
	this.draw = function(){

		// Move to start
		path = 'M'+	Math.round(points[0].x)+','+Math.round(points[0].y);
		bodygrad1 = (points[3].y - points[2].y)/(points[3].x - points[2].x);
		bodygrad2 = (points[9].y - points[8].y)/(points[9].x - points[8].x);


		for(var i = 0; i <= points.length; i++){
			if(i == 2){
				path += 'C';
				dx = -0.2 * this.rounded;
				dy = bodygrad1*dx;
				if(Math.abs(points[2].y - points[1].y) < 0.05){
					dx = 0;
					dy = 0;
				}
				path += Math.round(w*(points[i-1].x))+','+Math.round(h*(points[i-1].y))+' '+Math.round(w*(points[i].x + dx))+','+Math.round(h*(points[i].y + dy))+' '+Math.round(w*points[i].x)+','+Math.round(h*points[i].y);
			}else if(i == 4){
				path += 'C';
				dx = 0.1*this.rounded;
				dy = bodygrad1*dx;
				path += Math.round(w*(points[i-1].x + dx))+','+Math.round(h*(points[i-1].y + dy))+' '+Math.round(w*points[i].x)+','+Math.round(h*points[i].y)+' '+Math.round(w*points[i].x)+','+Math.round(h*points[i].y);
			}else if(i == 8){
				path += 'C';
				path += Math.round(w*points[i-1].x)+','+Math.round(h*points[i-1].y)+' '+Math.round(w*(points[i].x+0.1*this.rounded))+','+Math.round(h*points[i].y)+' '+Math.round(w*points[i].x)+','+Math.round(h*points[i].y);
			}else if(i == 10){
				path += 'C';
				dx = -0.15*this.rounded;
				dy = bodygrad2*dx;
				if(Math.abs(points[0].y - points[9].y) < 0.05){
					dx = 0;
					dy = 0;
				}
				path += Math.round(w*(points[i-1].x + dx))+','+Math.round(h*(points[i-1].y + dy))+' '+Math.round(w*points[0].x)+','+Math.round(h*points[0].y)+' '+Math.round(w*points[0].x)+','+Math.round(h*points[0].y);
			}else{
				path += 'L';
				path += Math.round(w*points[i].x)+','+Math.round(h*points[i].y);
			}
		}	
		path += '';

		this.paper.path(path).attr({'stroke':0,'fill':this.colour});
		this.paper.circle(eye.x*w, eye.y*h, w*0.02).attr({'stroke':0,'fill':'white'});
		this.paper.circle(eye.x*w, eye.y*h, w*0.015).attr({'stroke':0,'fill':'black'});
		
		this.paper.draw();
		return this;

	}
	this.size();

	return this;
}