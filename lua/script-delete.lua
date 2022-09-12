local search_result = redis.call('FT.SEARCH',KEYS[1],ARGV[1],"NOCONTENT");
for i=2,#search_result do
  redis.call('del', search_result[i]);
end
return #search_result-1;
