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

	var points,eye,patterns;
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
	function random(lo,hi){
		return Math.random()*(hi-lo)+lo;
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
		var c = 'c'+Math.ceil(Math.random()*14);
		this.colour = c;
		this.colour2 = colours[c].text;
		
		front = inRange(0.1,0.9);
		head = random(0,0.1);
		back = inRange(0.1,0.9);
		back2 = inRange(0.1,0.9);
		tail = random(0,0.05);
		tailend = random(0.025,0.05);
		nose = random(-0.05,0.05);

		points = new Array(10);
		patterns = new Array();

		// Start with nose
		points[0] = { x: 0.1 - nose, y: 0.5 - front*(Math.random()-0.5)*0.5 };
		points[1] = { x: points[0].x, y: points[0].y - front*Math.random()*0.2 };

		// Slightly move top of nose forwards
		points[1].x -= (1-Math.pow(front,2))*0.02;

		// Add head
		points[2] = {x: 0.3 + head, y:((1 - front)/2)};
		points[9] = {x: 0.3 + head, y:((1 + front)/2)};

		// Add end of body
		points[3] = {x: 0.7, y: ((1 - back)/2) };
		points[8] = {x: 0.7, y: 0.75+random(-0.15,0.15) };

		// Add start of tail
		points[4] = {x: 0.83, y: 0.45 + tail };
		points[7] = {x: 0.83, y: 0.55 - tail };

		// Add end of tail
		points[5] = {x: 0.875 + tailend,y: 0.4 };
		points[6] = {x: 0.875 + tailend,y: 0.6 };

		eye = { x: points[0].x + (points[2].x-points[0].x)*0.75, y: (points[1].y - inRange(0,0.6)*Math.abs(points[2].y - points[1].y)) };

		if(Math.random() > 0.8) patterns.push({'pattern':getPattern('belly'),'attr':{'stroke-width':0,'stroke':'none','fill':this.colour2,'opacity':0.6}});
		else {
			if(Math.random() > 0.9) patterns.push({'pattern':getPattern('face'),'attr':{'stroke-width':0,'stroke':'none','fill':'black','opacity':0.7}});
			if(Math.random() > 0.7) patterns.push({'pattern':getPattern('stripes'),'attr':{'stroke-width':Math.round(w*0.02),'stroke':this.colour2,'fill':this.colour2,'opacity':0.6}});
			else{
				if(Math.random() > 0.7) patterns.push({'pattern':getPattern('lines'),'attr':{'stroke-width':Math.round(w*0.01),'stroke':this.colour2,'fill':this.colour2,'opacity':0.6}});
			}
		}

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
				dy2 = Math.abs(points[2].y - points[1].y);
				if(dy2 < 0.15){
					dx *= 0.5;
					dy *= 0.5;
				}else if(dy2 < 0.05){
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
				dx = 0.1*this.rounded;
				dy = bodygrad2*dx;
				path += Math.round(w*points[i-1].x)+','+Math.round(h*points[i-1].y)+' '+Math.round(w*(points[i].x + dx))+','+Math.round(h*(points[i].y + dy))+' '+Math.round(w*points[i].x)+','+Math.round(h*points[i].y);
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

		this.paper.clip({'type':'path','d':path,'id':'shape'});
		this.paper.path(path).attr({'stroke':0,'fill':colours[this.colour].bg,'clip-path':'shape'});
		if(patterns.length > 0){
			for(var i = 0; i < patterns.length; i++){
				patterns[i].attr['clip-path'] = 'shape';
				this.paper.path(patterns[i].pattern).attr(patterns[i].attr);
			}
		}
		this.paper.circle(eye.x*w, eye.y*h, w*0.02).attr({'stroke':0,'fill':'white'});
		this.paper.circle(eye.x*w, eye.y*h, w*0.015).attr({'stroke':0,'fill':'black'});
		
		this.paper.draw();
		return this;

	}
	
	function getPattern(t){
		if(t == "stripes"){
			var dy;
			var r = Math.random();
			var n = Math.max(3,Math.round(Math.random()*6));
			var sep = 0.04;
			var str = '';
			var angle = Math.random()*0.25;
			var half = (Math.random()>0.5) ? true : false;
			var tall = (half) ? h/2 : h;
			var dy = sep*w*Math.cos(angle)*Math.sin(angle);
			for(var i = 0, x = points[2].x; i < n ; i++, x += sep){
				str += 'M'+Math.round(w*x)+',0l'+(tall*Math.tan(angle))+','+tall;
				tall -= dy;
			}
			if(half){
				for(var i = 0, x = points[3].x; i < n ; i++, x -= sep){
					str += 'M'+Math.round(w*x)+','+h+'l-'+(tall*Math.tan(angle))+',-'+tall;
					tall -= dy;
				}
			}
			return str;
		}else if(t == "lines"){
			var dy,dx;
			var r = Math.random();
			var n = Math.max(5,Math.round(Math.random()*20));
			var dy = 0.03*h;
			var str = '';
			var tall = (h/2)+(random(0,0.4)*h);
			for(var i = 0; i < n ; i++){
				x = points[2].x + random(0,0.1);
				while(x < points[3].x){
					dx = Math.random()*(points[3].x-points[2].x);
					x2 = Math.min(x + dx,points[4].x)-x;
					str += 'M'+Math.round(w*x)+','+(tall)+'l'+Math.round(w*x2)+',0';
					x += (dx + 0.02);
				}
				tall -= dy;
				console.log(tall)
			}
			return str;
		}else if(t == "belly"){
			return 'M0,'+h+'L'+Math.round(points[2].x*w)+','+(h/2)+'L'+w+','+(h/2)+'L'+w+','+h+'Z';
		}else if(t == "face"){
			return 'M0,0L'+Math.round(points[2].x*w)+',0l0,'+h+'L0,'+h+'Z';
		}else{
			return '';
		}
	}
	
	this.size();

	return this;
}