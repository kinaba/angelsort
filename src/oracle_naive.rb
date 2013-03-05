
N = 100

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
		ab, ba = 0, 0
		N.times{|x| if (x==a || fact[x][a]==-1)
		N.times{|y| if (y==b || fact[b][y]==-1)
			ab += 1 if x!=y && fact[x][y]==0
		end}end}
		N.times{|x| if (x==b || fact[x][b]==-1)
		N.times{|y| if (y==a || fact[a][y]==-1)
			ba += 1 if x!=y && fact[x][y]==0
		end}end}

		if ab < ba
			N.times{|x| if (x==a || fact[x][a]==-1)
			N.times{|y| if (y==b || fact[b][y]==-1)
				if x!=y && fact[x][y]==0
					fact[x][y] = -1
					fact[y][x] = +1
				end
			end}end}
		else
			N.times{|x| if (x==b || fact[x][b]==-1)
			N.times{|y| if (y==a || fact[a][y]==-1)
				if x!=y && fact[x][y]==0
					fact[x][y] = -1
					fact[y][x] = +1
				end
			end}end}
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
