var fish;
S(document).ready(function(){

	fish = new Fish('fish');

	// Create an initial fish
	fish.update();
	
	// Add event to button
	S('#new').on('click',function(e){ fish.create().draw(); });		

	// Add event to button
	S('#rounding').on('click',function(e){ fish.rounded = Math.random(); fish.paper.clear(); fish.draw(); });		

});

function Fish(id){
	
	this.paper = new SVG('fish');
	w = this.paper.w;
	h = this.paper.h;

	this.rounded = Math.random();
	
	var points;
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

	this.update = function(){ this.create().draw(); }
	this.create = function(){

		this.paper.clear();
		this.colour = colours['c'+Math.ceil(Math.random()*14)].bg;
		
		front = inRange(0.1,0.9);
		back = inRange(0.1,0.9);

		points = new Array(10);

		// Start with nose
		points[0] = { x: Math.round(w*0.1), y:(h/2) - h*front*(Math.random()-0.5)*0.5 };
		points[1] = { x: points[0].x, y:points[0].y - h*front*Math.random()*0.2 };

		// Slightly move top of nose forwards
		points[1].x -= w*(1-Math.pow(front,2))*0.02;

		// Add head
		points[2] = {x:Math.round(w*0.3),y:(h*(1 - front)/2)};
		points[9] = {x:Math.round(w*0.3),y:(h*(1 + front)/2)};

		// Add end of body
		points[3] = {x:Math.round(w*0.7),y:Math.round((h*(1 - back)/2))};
		points[8] = {x:Math.round(w*0.7),y:Math.round(h - h*0.2)};

		// Add start of tail
		points[4] = {x:Math.round(w*0.83),y:h-Math.round(h*0.55)};
		points[7] = {x:Math.round(w*0.83),y:h-Math.round(h*0.45)};

		// Add start of tail
		points[5] = {x:Math.round(w*0.9),y:h-Math.round(h*0.6)};
		points[6] = {x:Math.round(w*0.9),y:h-Math.round(h*0.4)};

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
				dx = -0.2*w*this.rounded;
				dy = bodygrad1*dx;
				if(Math.abs(points[2].y - points[1].y) < 30){
					dx = 0;
					dy = 0;
				}
				path += Math.round(points[i-1].x)+','+Math.round(points[i-1].y)+' '+Math.round(points[i].x + dx)+','+Math.round(points[i].y + dy)+' '+Math.round(points[i].x)+','+Math.round(points[i].y);
			}else if(i == 4){
				path += 'C';
				dx = 0.1*w*this.rounded;
				dy = bodygrad1*dx;
				path += Math.round(points[i-1].x + dx)+','+Math.round(points[i-1].y + dy)+' '+Math.round(points[i].x)+','+Math.round(points[i].y)+' '+Math.round(points[i].x)+','+Math.round(points[i].y);
			}else if(i == 8){
				path += 'C';
				path += Math.round(points[i-1].x)+','+Math.round(points[i-1].y)+' '+Math.round(points[i].x+0.1*w*this.rounded)+','+Math.round(points[i].y)+' '+Math.round(points[i].x)+','+Math.round(points[i].y);
			}else if(i == 10){
				path += 'C';
				dx = -0.15*w*this.rounded;
				dy = bodygrad2*dx;
				if(Math.abs(points[0].y - points[9].y) < 30){
					dx = 0;
					dy = 0;
				}
				path += Math.round(points[i-1].x + dx)+','+Math.round(points[i-1].y + dy)+' '+Math.round(points[0].x)+','+Math.round(points[0].y)+' '+Math.round(points[0].x)+','+Math.round(points[0].y);
			}else{
				path += 'L';
				path += Math.round(points[i].x)+','+Math.round(points[i].y);
			}
		}	
		path += '';

		this.paper.path(path).attr({'stroke':0,'fill':this.colour});
		this.paper.circle(eye.x, eye.y, w*0.02).attr({'stroke':0,'fill':'white'});
		this.paper.circle(eye.x, eye.y, w*0.015).attr({'stroke':0,'fill':'black'});
		
		this.paper.draw();
		return this;

	}
	return this;
}