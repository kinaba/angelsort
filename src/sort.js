//----------------------------------------------------------------------------
// Collection of generic sorting functions with the following signature
//
//   void foo(Array arr, Function less_more);
//
// where less_more(x, y) is used as a predicate that returns true iff x<y.
//----------------------------------------------------------------------------

function swap(a, i, k)
{
	var t = a[i];
	a[i] = a[k];
	a[k] = t;
}

var SortAlgorithm =
{
	///
	/// .sort() method of JavaScript Arrays.
	///
	".sort()": function(arr, less_more)
	{
		arr.sort(function(a,b) {
			return (a==b ? 0 : less_more(a,b) ? -1 : +1);
		});
	},

	///
	/// Quick Sort, with no attempt for clever pivoting.
	///
	"Quick": function(arr, less_more)
	{
		function impl(s, e) {
			if(e-s <= 1)
				return;
			var p=arr[s], i=s+1, j=e;
			while(i<j) {
				while(i<j && !less_more(p, arr[i]))  ++i;
				while(i<j && less_more(p, arr[j-1])) --j;
				if(i<j) {swap(arr, i, j-1); ++i; --j;}
			}
			if(i==e) {
				swap(arr, s, e-1);
				impl(s, e-1);
			} else {
				impl(s, i);
				impl(i, e);
			}
		};
		impl(0, arr.length);
	},

	///
	/// Merge Sort, implemented by a top-down recursion.
	///
	"Merge (t)": function(arr, less_more)
	{
		function merge(s, m, e)
		{
			var merged = [];
			var i=s, k=m;
			while(i<m && k<e)
				merged.push(less_more(arr[i], arr[k]) ? arr[i++] : arr[k++]);
			while(i<m)
				merged.push(arr[i++]);
			while(k<e)
				merged.push(arr[k++]);
			for(var i=s; i<e; ++i)
				arr[i] = merged[i-s];
		}

		function impl(s, e) {
			if(e-s<=1)
				return;
			var m = (e+s)>>1;
			impl(s, m);
			impl(m, e);
			merge(s, m, e);
		}
		impl(0, arr.length);
	},

	///
	/// Merge Sort, implemented by bottom-up building.
	///
	"Merge (b)": function(arr, less_more)
	{
		function merge(s, m, e)
		{
			var merged = [];
			var i=s, k=m;
			while(i<m && k<e)
				merged.push(less_more(arr[i], arr[k]) ? arr[i++] : arr[k++]);
			while(i<m)
				merged.push(arr[i++]);
			while(k<e)
				merged.push(arr[k++]);
			for(var i=s; i<e; ++i)
				arr[i] = merged[i-s];
		}

		for(var w=2; w/2<arr.length; w*=2)
			for(var s=0; s+w/2<arr.length; s+=w)
				merge(s, s+w/2, Math.min(s+w, arr.length));
	},

	///
	/// Heap Sort, O(n log n) construction and O(n log n) extraction.
	///
	"Heap (t)": function(arr, less_more)
	{
		for(var i=1; i<arr.length; ++i) {
			var p=i;
			while(p>0) {
				var pp = (p-1)>>1;
				if( less_more(arr[pp], arr[p]) ) {
					swap(arr, p, pp);
					p = pp;
				} else {
					break;
				}
			}
		}
		for(var i=arr.length-1; i>0; --i) {
			swap(arr, 0, i);
			var p=0;
			while(p*2+1<i) {
				var pc = (p*2+2>=i || less_more(arr[p*2+2], arr[p*2+1])) ? p*2+1 : p*2+2;
				if( less_more(arr[p], arr[pc]) ) {
					swap(arr, p, pc);
					p = pc;
				} else {
					break;
				}
			}
		}
	},

	///
	/// Heap Sort, O(n) construction and O(n log n) extraction.
	///
	"Heap (b)": function(arr, less_more)
	{
		for(var i=arr.length-1; i>=0; --i) {
			var p=i;
			while(p*2+1<arr.length) {
				var pc = (p*2+2>=arr.length || less_more(arr[p*2+2], arr[p*2+1])) ? p*2+1 : p*2+2;
				if( less_more(arr[p], arr[pc]) ) {
					swap(arr, p, pc);
					p = pc;
				} else {
					break;
				}
			}
		}
		for(var i=arr.length-1; i>0; --i) {
			swap(arr, 0, i);
			var p=0;
			while(p*2+1<i) {
				var pc = (p*2+2>=i || less_more(arr[p*2+2], arr[p*2+1])) ? p*2+1 : p*2+2;
				if( less_more(arr[p], arr[pc]) ) {
					swap(arr, p, pc);
					p = pc;
				} else {
					break;
				}
			}
		}
	},

	///
	/// Shell sort with 1,4,13,40,... steps.
	///
	"Shell": function(arr, less_more)
	{
		var h = 1;
		while((3*h+1)*2 < arr.length)
			h = 3*h + 1;

		for(; h>0; h=(h-1)/3)
			for(var s=0; s<h; ++s)
				for(var i=s+h; i<arr.length; i+=h)
					for(var k=i-h; k>=0; k-=h)
						if(less_more(arr[k], arr[k+h]))
							break;
						else
							swap(arr, k, k+h);
	},

	///
	/// Insertion sort with linear search.
	///
	"Insertion": function(arr, less_more)
	{
		for(var i=1; i<arr.length; ++i)
			for(var k=i-1; k>=0; --k)
				if(less_more(arr[k], arr[k+1]))
					break;
				else
					swap(arr, k, k+1);
	},

	///
	/// Bubble Sort, bubbles up the bigger to the right.
	///
	"Bubble": function(arr, less_more) {
		for(var i=0; i<arr.length; ++i)
		for(var k=0; k+1<arr.length-i; ++k)
			if(less_more(arr[k+1], arr[k]))
				swap(arr, k, k+1);
	},
};
