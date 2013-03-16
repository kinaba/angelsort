#include <iostream>
#include <vector>
#include <algorithm>
#include <utility>
using namespace std;

static const int N = 1000;

template<typename T>
struct Ref
{
	Ref(T& t) : t(t) {}
	bool operator()(int a, int b) { return t(a,b); }
	T& t;
};

struct Counter
{
	int cnt;
	Counter() : cnt(0) {}
	bool operator()(int a, int b) { ++cnt; return a<b; }
};

struct Hacker
{
	// fact[x][y] == -1 <==> x<y
	explicit Hacker(int N)
		: N(N), fact(N, vector<int>(N)), cnt(0) {}

	bool operator()(int a, int b)
	{
		++cnt;
		if(a == b)
			return false;
		if(fact[a][b] != 0)
			return fact[a][b] == -1;

		// ab = {(x,y) | a<b implies x<y}, ab_x = {x | (x,b) in ab}, ab_y = {y | (a,y) in ab}
		vector<pair<int,int>> ab(1, make_pair(a,b));
		vector<pair<int,int>> ba(1, make_pair(b,a));
		vector<int> ab_x, ab_y, ba_x, ba_y;
		for(int z=0; z<N; ++z) if(z!=a && z!=b) {
			if(fact[z][a]==-1) ab_x.push_back(z), ab.emplace_back(z,b);
			if(fact[b][z]==-1) ab_y.push_back(z), ab.emplace_back(a,z);
			if(fact[z][b]==-1) ba_x.push_back(z), ba.emplace_back(z,a);
			if(fact[a][z]==-1) ba_y.push_back(z), ba.emplace_back(b,z);
		}

		// Compute the elements of (ab - ab_x - ab_y) and (ba - ba_x - ba_y) incrementally.
		int ab_i=0, ba_i=0;
		for(;;) {
			bool ab_alive = ab_i < ab_x.size()*ab_y.size();
			bool ba_alive = ba_i < ba_x.size()*ba_y.size();
			if(!ab_alive && !ba_alive) break;
			// What we want to know is whether |ab| < |ba| or not.
			// If it is determined, break immediately.
			if(ab.size()<ba.size() && !ab_alive) break;
			if(ba.size()<ab.size() && !ba_alive) break;

			bool do_ab = (ab_alive && (!ba_alive || ab.size()<ba.size()));
			if(do_ab) {
				int x = ab_x[ab_i/ab_y.size()];
				int y = ab_y[ab_i%ab_y.size()];
				if(fact[x][y]==0) ab.emplace_back(x,y);
				ab_i += 1;
			} else {
				int x = ba_x[ba_i/ba_y.size()];
				int y = ba_y[ba_i%ba_y.size()];
				if(fact[x][y]==0) ba.emplace_back(x,y);
				ba_i += 1;
			}
		}

		// Commit the comparison result set that has less information.
		for(auto xy : (ab.size() < ba.size() ? ab : ba)) {
			int x=xy.first, y=xy.second;
			fact[x][y] = -1;
			fact[y][x] = +1;
		}
		return fact[a][b]==-1;
	}

	int cnt;
private:
	const int N;
	vector<vector<int>> fact;
};

int main()
{
	vector<int> worst;
	for(int i=0; i<N; ++i) worst.push_back(i);
	Hacker hack(N);
	sort(worst.begin(), worst.end(), Ref<Hacker>(hack));
	cout << hack.cnt << endl;

	Counter cnt;
	random_shuffle(worst.begin(), worst.end());
	sort(worst.begin(), worst.end(), Ref<Counter>(cnt));
	cout << cnt.cnt << endl;
}
