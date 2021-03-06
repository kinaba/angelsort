var N = null;
var oracle = null;
var tr = null;
var tr_i = null;
var timer = null;

function Replay(n)
{
	var fact = new Array(n);
	for(var x=0; x<n; ++x) {
		fact[x] = new Array(n);
		for(var y=0; y<n; ++y)
			fact[x][y] = 0;
	}

	var uf = new Array(n);
	var sz = new Array(n);
	for(var x=0; x<n; ++x) {uf[x]=x; sz[x]=1;}
	function find(x) {
		return (uf[x]==x ? x : (uf[x]=find(uf[x])));
	}
	function union(x, y) {
		x = find(x);
		y = find(y);
		if( x != y ) {
			if(sz[x] < sz[y]) {
				uf[x] = y;
				sz[y] += sz[x];
			} else {
				uf[y] = x;
				sz[x] += sz[y];
			}
		}
	}

	this.commit = function(small, big) {
		union(small, big);
		for(var x=0; x<N; ++x) if(x==small || fact[x][small]==-1)
		for(var y=0; y<N; ++y) if(y==big   || fact[big][y]==-1)
			if(x!=y && fact[x][y]==0) {
				fact[x][y] = -1;
				fact[y][x] = +1;
			}
	};

	this.related = function(v) {
		var arr = [];
		for(var u=0; u<n; ++u)
			if(find(u) == find(v))
				arr.push(u);
		return arr;
	};

	this.lines = function() {
		var a = new Array();
		for(var i=0; i<tr_i; ++i)
			a.push(tr[i]);
		return a;
	};

	this.dots = function() {
		var level = new Array(n);
		function rec(v) {
			if(level[v] === undefined) {
				level[v] = 0;
				for(var u=0; u<n; ++u) if(fact[u][v]==-1)
					level[v] = Math.max(level[v], rec(u)+1);
			}
			return level[v];
		}
		var maxlevel = 0;
		for(var v=0; v!=n; ++v) maxlevel=Math.max(maxlevel, rec(v));

		var a = new Array();
		var X_UNIT = 0.8/n;
		var Y_UNIT = 0.75/(maxlevel==0 ? 1 : maxlevel);
		var xl = 0.1;
		for(var v=0; v!=n; ++v) if(!a[v]) {
			var uu = this.related(v);
			var levelcnt = new Array(n);
			var lc = 0;
			var maxX = xl;
			for(var k=0; k<uu.length; ++k) {
				var u = uu[k];
				var x = xl + X_UNIT*lc;
				maxX = Math.max(maxX, x);
				a[u] = {x: x, y: 0.9-Y_UNIT*level[u]};
				lc ++;
			}
			xl = maxX + X_UNIT;
		}
		return a;
	};
}

function step() {
  if(tr_i < tr.length) {
	oracle.commit(tr[tr_i][0], tr[tr_i][1]);
	tr_i ++;
	return true;
  }
  return false;
}

function drawLines(lineLayer, dotLayer) { return function() {
	var canvas = lineLayer.getCanvas();
	canvas.clear();
	var context = canvas.getContext();
	var dots = dotLayer.getChildren();
	var lines = oracle.lines();

	for(var i=0; i<lines.length; ++i) {
		context.beginPath();
		var p = dots[lines[i][0]];
		context.moveTo(p.attrs.x, p.attrs.y);
		var q = dots[lines[i][1]];
		context.lineTo(q.attrs.x, q.attrs.y);
		context.lineWidth = 2;
		context.strokeStyle = "gray";
		context.stroke();
	}
}}

function tango(layer) {
	if(!step()) return;
	var dots = oracle.dots();
	for(var n = 0; n < layer.getChildren().length; n++) {
		var shape = layer.getChildren()[n];
		var stage = shape.getStage();
	 	shape.transitionTo({
			rotation: Math.random() * Math.PI * 2,
			x: dots[n].x * stage.getWidth(),
			y: dots[n].y * stage.getHeight(),
			duration: 1,
			easing: 'ease-in-out'
		});
	}
	timer = setTimeout(function(){tango(layer);}, 1500);
}

function Player(elem)
{
	var stage = new Kinetic.Stage({container: elem});

	this.start = function(N, tr) {
		stage.reset();
		stage.setWidth(elem.offsetWidth);
		stage.setHeight(elem.offsetHeight);

		window.N = N;
		window.oracle = new Replay(N);
		window.tr = tr;
		window.tr_i = 0;

		if(timer)clearTimeout(timer);
		var layer = new Kinetic.Layer();

		var dots = oracle.dots();
		for(var n=0; n<N; ++n) {
			var shape = new Kinetic.RegularPolygon({
				x: dots[n].x * stage.getWidth(),
				y: dots[n].y * stage.getHeight(),
				sides: 6,
				radius: 10,
				fill: '#'+Math.random().toString(16).slice(-6),
				stroke: 'black',
				strokeWidth: 2
			});
			layer.add(shape);
		}
		var line_layer = new Kinetic.Layer();
		layer.beforeDraw(drawLines(line_layer, layer));
		stage.add(line_layer);
		stage.add(layer);
		timer = setTimeout(timer = function(){tango(layer);}, 1500);
	};
}
