
N = ARGV[0].to_i || 50

fact = (0...N).map{(0...N).map{0}}
cnt = 0
# fact[x][y] == -1 <==> x<y
tick = 0
arr = [*0...N]
arr.sort! do |a,b|
	cnt += 1

	if a == b
		0
	elsif fact[a][b] != 0
		fact[a][b]
	else
		# ab = {(x,y) | a<b implies x<y}, ab_x = {x | (x,b) in ab}, ab_y = {y | (a,y) in ab}
		ab, ab_x, ab_y = [[a,b]], [], []
		# similarly for b<a
		ba, ba_x, ba_y = [[b,a]], [], []
		for z in 0...N
			tick += 1
			if z!=a && z!=b
				(ab_x<<z; ab<<[z,b]) if fact[z][a]==-1
				(ab_y<<z; ab<<[a,z]) if fact[b][z]==-1
				(ba_x<<z; ba<<[z,a]) if fact[z][b]==-1
				(ba_y<<z; ba<<[b,z]) if fact[a][z]==-1
			end
		end

		# Compute the elements of (ab - ab_x - ab_y) and (ba - ba_x - ba_y) incrementally.
		ab_i = ba_i = 0
		loop do
			tick += 1
			ab_alive = ab_i < ab_x.size*ab_y.size
			ba_alive = ba_i < ba_x.size*ba_y.size
			break if !ab_alive && !ba_alive
			# What we want to know is whether |ab| < |ba| or not.
			# If it is determined, break immediately.
			#break if ab.size<ba.size && !ab_alive
			#break if ba.size<ab.size && !ba_alive

			do_ab = (ab_alive && (!ba_alive || ab.size<ba.size))
			if do_ab
				x, y = ab_x[ab_i/ab_y.size], ab_y[ab_i%ab_y.size]
				ab.push [x,y] if fact[x][y]==0
				ab_i += 1
			else
				x, y = ba_x[ba_i/ba_y.size], ba_y[ba_i%ba_y.size]
				ba.push [x,y] if fact[x][y]==0
				ba_i += 1
			end
		end

		# Commit the comparison result set that has less information.
		(ab.size < ba.size ? ab : ba).each do |x,y|
			tick += 1
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
p tick

cnt = 0;
worst.sort{|a,b| cnt+=1; a<=>b}
puts cnt

cnt = 0;
srand(0)
[*0...N].shuffle.sort{|a,b| cnt+=1; a<=>b}
puts cnt
