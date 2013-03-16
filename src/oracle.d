import std.algorithm;
import std.stdio;
import std.random;
import std.typecons;

const N = 50;

void main()
{
	{
		// fact[x][y] == -1 <==> x<y
		int[][] fact = new int[][](N,N);
		int counter = 0;
		bool hack(int a, int b)
		{
			++counter;
			if(a == b)
				return false;
			if(fact[a][b] != 0)
				return fact[a][b] == -1;

			class enumerator {
				int a, b;
				int[][] fact;
				this(int a, int b, int[][] fact) {
					this.a = a;
					this.b = b;
					this.fact = fact;
				}
				int x = -1, y;
				Tuple!(int,int) next() {
					if(x == -1) {
						++x;
						y = -2;
						return tuple(a, b);
					}
					while(x<N) {
						if(x!=a && x!=b) {
							if(y == -2) {
								++y;
								// x<a ==> x<b
								if(fact[x][a]==-1 && fact[x][b]==0) {
									return tuple(x,b);
								}
							}
							if(y == -1) {
								// b<x ==> a<x
								if(fact[b][x]==-1 && fact[a][x]==0) {
									++y;
									return tuple(a,x);
								} else {
									y = N;
								}
							}
							while(y<N) {
								// b<x & y<a => y<x
								if(y!=a && y!=b && fact[y][a]==-1 && fact[y][x]==0) {
									return tuple(y++,x);
								}
								++y;
							}
							++x;
							y = -2;
						}
						++x;
					}
					throw new Exception("done");
				}
			}
			auto abq = new enumerator(a,b,fact);
			auto baq = new enumerator(b,a,fact);
			Tuple!(int,int)[] ab, ba;

			bool use_ab = false;
			for(;;) {
				try { ba ~= baq.next(); } catch { use_ab = false; break; }
				try { ab ~= abq.next(); } catch { use_ab = true; break; }
			}
			foreach(xy; use_ab ? ab : ba) {
				int x = xy[0], y = xy[1];
				fact[x][y] = -1;
				fact[y][x] = +1;
			}
			return fact[a][b] == -1;
			return a < b;
		}

		int[] arr;
		foreach(i; 0..N) arr ~= i;
		sort!(hack,SwapStrategy.stable)(arr);
		writeln(counter);
	}
	{
		int counter = 0;
		bool cnt(int a, int b)
		{
			++counter;
			return a < b;
		}

		int[] arr;
		foreach(i; 0..N) arr ~= i;
		partialShuffle(arr, arr.length);
		sort!(cnt)(arr);
		writeln(counter);
	}
}
