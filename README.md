angelsort
=========

Running demo is at: http://www.kmonos.net/wlog/sub/angelsort/viewer.html

Have you ever read "A Killer Adversary for Quicksort"
 http://www.cs.dartmouth.edu/~doug/mdmspe.pdf ?
In this fantastic paper, a malicious "compare" function that finds
the worst case input for typical quicksort implementations.
Here's my challenge to implement the generalization of the approach.

The repository contains
* A Devil: comparator that exhibits the worst case behavior of _any_ given comparison based sort.
* An Angel: comparator that exhibits the best case for given comaprison based sort.
* Collection of standard sort algorithms.
* Viewer for the act of Devil and Angel against the sort algorithms.


Notes on my apporach:
if a devil (an angel) is asked whether (x < y), then she answers in a way that
determines the least (the most) number of orderings of pairs.

For example, suppose a devil already has a<b and c<d, and asked if b<c or c<b.
If she answered b<c, then at the same time, a<c, a<d, and b<d must follow, so 4 pairs in
total are fixed. On the other hand, if she answered c<b, only the single pair is the must.
So she as a malicious devil answers c<b, which reveals the least fact.

Proof is omitted but this coincides the preference based on the possible number
or orderings satisfying the known facts (= number of topological orderings), at
least for a comparison between disconnected components, so the criteria should not be so bad.

To be fully optimal, the adversery and the sort algorithm must be considered to be playing
a two player game, and find the optimal strategy, which is too tough.

-- 
@kinaba
www.kmonos.net
