
N = (ARGV[0] || 100).to_i
arr = [*0...N]

cnt = 0

# Fact table: fact[x][y] == -1 <==> x<y
#             fact[x][y] ==  0 <==> unknown
#             fact[x][y] == +1 <==> x>y
fact = (0...N).map{(0...N).map{0}}

# |fact| is the current knowledge. What can we infer if we knew a<b?
def enumerate_determined_pairs(a,b,fact)
	yield [a,b]
	for x in 0...N
		if x!=a && x!=b
			# x<a ==> x<b
			if fact[x][a]==-1 && fact[x][b]==0
				yield [x,b]
			end
			# b<x ==> a<x
			if fact[b][x]==-1 && fact[a][x]==0
				yield [a,x]
				for y in 0...N
					# b<x & y<a => y<x
					if y!=a && y!=b && fact[y][a]==-1 && fact[y][x]==0
						yield [y,x]
					end
				end
			end
		end
	end
end

arr.sort! do |a,b|
	cnt += 1

	if a == b
		0
	elsif fact[a][b] != 0
		fact[a][b]
	else
		ab,abq = [], to_enum(:enumerate_determined_pairs,a,b,fact)
		ba,baq = [], to_enum(:enumerate_determined_pairs,b,a,fact)
		# Choose the shorter of {|ab|, |ba|}, without fully enumerating the longer one.
		use_ab = nil
		loop do
			ba << baq.next rescue (use_ab = false; break)
			ab << abq.next rescue (use_ab = true; break)
		end
		(use_ab ? ab : ba).each do |x,y|
			fact[x][y] = -1
			fact[y][x] = +1
		end
		fact[a][b]
	end
end

puts cnt
worst = [nil]*N;
(0...N).each{|i| worst[arr[i]] = i }
p worst

cnt = 0;
worst.sort{|a,b| cnt+=1; a<=>b}
puts cnt

cnt = 0;
srand(0)
[*0...N].shuffle.sort{|a,b| cnt+=1; a<=>b}
puts cnt
