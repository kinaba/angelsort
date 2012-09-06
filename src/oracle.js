//----------------------------------------------------------------------------
// Collection of sort oracle generators. They have the following signature
//
//   Function foo(int N, int[2][] Output);
//
// and returns a comparator predicate for sort algorithms in sort.js.
// N is the size of the array to be sorted, and Output is the array to record
// the list of comparisons executed during sorting. For example, if Output[0]
// is [9, 2], then it means that the first comparison was to compared the 2nd
// and the 9th element of the array, and the oracle determined that 9th<2nd.
//
//  * Angel : she tries to finish the sorting as fast as possible.
//  * Devil : she tries to slow down the sorting as mush as possible.
//
// The code is intentionally written primitively, so that the logic is easily
// ported to other programming languages.
//----------------------------------------------------------------------------

function GenerateTraceWithOracle(oracle, algorithm, N)
{
	var a = new Array(N);
	for(var i=0; i<N; ++i)
		a[i] = i;
	var tr = [];
	algorithm(a, oracle(N, tr));
	return tr;
}


var K_UNKNOWN = 0;
var K_LESS = -1;
var K_MORE = +1;

var Oracle =
{
	"Angel": function(N, Output)
	{
		// fact[a][b] = K_LESS means that we already know a<b.
		// fact[a][b] = K_MORE means that we already kwno a>b.
		// fact[a][b] = K_UNKNOWN means nothing is known.

		var fact = new Array(N);
		for(var i=0; i<N; ++i) {
			fact[i] = new Array(N);
			for(var j=0; j!=N; ++j)
				fact[i][j] = K_UNKNOWN;
		}

		return function(a, b) {
			if( a == b )
				return false;

			if( fact[a][b] == K_UNKNOWN )
			{
				// How many cells can we fill if a<b ?
				var ab = 0;
				for(var x=0; x<N; ++x) if(x==a || fact[x][a]==K_LESS)
				for(var y=0; y<N; ++y) if(y==b || fact[b][y]==K_LESS)
					if(x!=y && fact[x][y]==K_UNKNOWN)
						ab++;

				// How many cells can we fill if b<a ?
				var ba = 0;
				for(var x=0; x<N; ++x) if(x==b || fact[x][b]==K_LESS)
				for(var y=0; y<N; ++y) if(y==a || fact[a][y]==K_LESS)
					if(x!=y && fact[x][y]==K_UNKNOWN)
						ba++;

				// Angel wants to make sort faster, so she likes to fill more cells.
				if( ab >= ba )
				{
					// It's a<b!
					for(var x=0; x<N; ++x) if(x==a || fact[x][a]==K_LESS)
					for(var y=0; y<N; ++y) if(y==b || fact[b][y]==K_LESS)
						if(x!=y && fact[x][y]==K_UNKNOWN) {
							fact[x][y] = K_LESS;
							fact[y][x] = K_MORE;
						}
				}
				else
				{
					// It's b<a!
					for(var x=0; x<N; ++x) if(x==b || fact[x][b]==K_LESS)
					for(var y=0; y<N; ++y) if(y==a || fact[a][y]==K_LESS)
						if(x!=y && fact[x][y]==K_UNKNOWN) {
							fact[x][y] = K_LESS;
							fact[y][x] = K_MORE;
						}
				}
			}
			Output.push(fact[a][b]==K_LESS ? [a,b] : [b,a]);
			return (fact[a][b] == K_LESS);
		};
	},

	"Devil": function(N, Output)
	{
		var fact = new Array(N);
		for(var i=0; i<N; ++i) {
			fact[i] = new Array(N);
			for(var j=0; j!=N; ++j)
				fact[i][j] = K_UNKNOWN;
		}

		return function(a, b) {
			if( a == b )
				return false;

			if( fact[a][b] == K_UNKNOWN )
			{
				var ab = 0;
				for(var x=0; x<N; ++x) if(x==a || fact[x][a]==K_LESS)
				for(var y=0; y<N; ++y) if(y==b || fact[b][y]==K_LESS)
					if(x!=y && fact[x][y]==K_UNKNOWN)
						ab++;

				var ba = 0;
				for(var x=0; x<N; ++x) if(x==b || fact[x][b]==K_LESS)
				for(var y=0; y<N; ++y) if(y==a || fact[a][y]==K_LESS)
					if(x!=y && fact[x][y]==K_UNKNOWN)
						ba++;

				if( ab < ba ) // Only difference between a devil and an angel.
				{
					for(var x=0; x<N; ++x) if(x==a || fact[x][a]==K_LESS)
					for(var y=0; y<N; ++y) if(y==b || fact[b][y]==K_LESS)
						if(x!=y && fact[x][y]==K_UNKNOWN) {
							fact[x][y] = K_LESS;
							fact[y][x] = K_MORE;
						}
				}
				else
				{
					for(var x=0; x<N; ++x) if(x==b || fact[x][b]==K_LESS)
					for(var y=0; y<N; ++y) if(y==a || fact[a][y]==K_LESS)
						if(x!=y && fact[x][y]==K_UNKNOWN) {
							fact[x][y] = K_LESS;
							fact[y][x] = K_MORE;
						}
				}
			}
			Output.push(fact[a][b]==K_LESS ? [a,b] : [b,a]);
			return (fact[a][b] == K_LESS);
		};
	},

	"Random": function(N, Output)
	{
		var fact = new Array(N);
		for(var i=0; i<N; ++i) {
			fact[i] = new Array(N);
			for(var j=0; j!=N; ++j)
				fact[i][j] = K_UNKNOWN;
		}

		return function(a, b) {
			if( a == b )
				return false;

			if( fact[a][b] == K_UNKNOWN )
			{
				var ab = 0;
				for(var x=0; x<N; ++x) if(x==a || fact[x][a]==K_LESS)
				for(var y=0; y<N; ++y) if(y==b || fact[b][y]==K_LESS)
					if(x!=y && fact[x][y]==K_UNKNOWN)
						ab++;

				var ba = 0;
				for(var x=0; x<N; ++x) if(x==b || fact[x][b]==K_LESS)
				for(var y=0; y<N; ++y) if(y==a || fact[a][y]==K_LESS)
					if(x!=y && fact[x][y]==K_UNKNOWN)
						ba++;

				// Biased randomness. If ab is small, a<b is likely to happen than b<a.
				if( Math.random() < Math.sqrt(ba)/(Math.sqrt(ab)+Math.sqrt(ba)) )
				{
					for(var x=0; x<N; ++x) if(x==a || fact[x][a]==K_LESS)
					for(var y=0; y<N; ++y) if(y==b || fact[b][y]==K_LESS)
						if(x!=y && fact[x][y]==K_UNKNOWN) {
							fact[x][y] = K_LESS;
							fact[y][x] = K_MORE;
						}
				}
				else
				{
					for(var x=0; x<N; ++x) if(x==b || fact[x][b]==K_LESS)
					for(var y=0; y<N; ++y) if(y==a || fact[a][y]==K_LESS)
						if(x!=y && fact[x][y]==K_UNKNOWN) {
							fact[x][y] = K_LESS;
							fact[y][x] = K_MORE;
						}
				}
			}
			Output.push(fact[a][b]==K_LESS ? [a,b] : [b,a]);
			return (fact[a][b] == K_LESS);
		};
	},
};
