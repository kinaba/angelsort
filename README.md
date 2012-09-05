angelsort
=========

Have you ever read "A Killer Adversary for Quicksort"
 http://www.cs.dartmouth.edu/~doug/mdmspe.pdf ?
In this fantastic paper, a malicious "compare" function that finds
the worst case input for typical quicksort implementations.
Here's my challenge to implement the generalization of the approach.

The repository contains
* Devil: comparator that exhibits the worst case behavior of _any_ given comparison based sort.
* Angel: comparator that exhibits the best case for given comaprison based sort.
* Collection of standard sort algorithms.
* Viewer for the act of Devil and Angel against the sort algorithms.

-- 
@kinaba
www.kmonos.net