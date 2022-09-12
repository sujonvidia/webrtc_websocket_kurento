for set_idx = 1, 1000 do
  redis.call('HMSET', 'test:lua:1',set_idx, set_idx)
end