
N = (ARGV[0] || 100).to_i

fact = (0...N).map{(0...N).map{0}}
cnt = 0

# fact[x][y] == -1 <==> x<y

arr = [*0...N]
arr.sort! do |a,b|
	cnt += 1

	if a == b
		0
	elsif fact[a][b] != 0
		fact[a][b]
	else
		abq, ab = [[a,b,:phase0,a,b]], []
		baq, ba = [[b,a,:phase0,b,a]], []
		while abq.size>0 || baq.size>0
			break if ab.size<ba.size && abq.size==0
			break if ba.size<ab.size && baq.size==0
			do_ab  = (abq.size!=0 && (baq.size==0 || ab.size<ba.size))
			theq   = (do_ab ? abq : baq)
			thec   = (do_ab ? ab : ba)
			x,y,ph,aa,bb = theq.shift
			case ph # [p-a-b-q]
				when :phase0 # [a-b] ==> [a-q] [p-b]
					thec.push [x,y]
					theq.push [x,0,:phase1,aa,bb]
					theq.push [0,y,:phase2,aa,bb]
				when :phase1 # [a-q]
					if fact[bb][y]==-1 && fact[x][y]==0 && y!=bb
						thec.push [x,y]
						theq.push [0,y,:phase2,aa,bb] 
					end
					theq.push [x,y+1,:phase1,aa,bb] if y+1<N
				when :phase2 # [p-b] or [p-q]
					if fact[x][aa]==-1 && fact[x][y]==0 && x!=aa
						thec.push [x,y]
					end
					theq.push [x+1,y,:phase2,aa,bb] if x+1<N
			end
		end

		(ab.size < ba.size ? ab : ba).each do |x,y|
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
