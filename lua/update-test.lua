local function has_value (tab, val)
  if #tab == 0 then return 0
  else
    for index, value in ipairs(tab) do
      if value == val then return index end
    end
  end
  return 0
end
local function decode_value (val)
  if(val == "null") then 
    return {} -- set table if null of current row's column value
  else 
    return cjson.decode(val)
  end 
end

--local search_result = redis.call('FT.SEARCH',unpack(KEYS));


local search_result = cjson.decode('["messages:a5989b2b-f61f-4844-9b62-cd96717dcd38:a64a4540-691f-11eb-aa34-461d7c2dd82e","messages:a5989b2b-f61f-4844-9b62-cd96717dcd38:5b37ac50-691f-11eb-89bf-467a4dfe3b7a","messages:a5989b2b-f61f-4844-9b62-cd96717dcd38:1620c490-5f0a-11eb-a4fe-cd76ec2ed3b1","messages:a5989b2b-f61f-4844-9b62-cd96717dcd38:14dd6f20-5f0a-11eb-b817-1bef43bd937d","messages:a5989b2b-f61f-4844-9b62-cd96717dcd38:13b14b30-5f0a-11eb-963f-c95196276adb"]');
local update_values = cjson.decode('{"msg_status@@set":{"$remove":["38393663326663342d646562392d346463662d623634662d396235396333343965633534"]},"has_delivered@@int":1}');

for i=1,#search_result do -- 1st
  local new_values = {}
  for up_main_key, up_main_val in pairs(update_values) do -- 2nd
    local up_key, field_type = string.match(up_main_key, "(.*)%@@(.*)")
    -------------------- MAP ------------------------------------
    if(field_type == "map") then 
      if(up_main_val['$add'] ~= nil) then
        -- add operation ----------------
        local search_row = redis.call('HGET',search_result[i],up_key);
        search_row = decode_value(search_row)
        
        for map_key, map_val in pairs(up_main_val['$add']) do
          search_row[map_key] = map_val
        end
        --redis.call('HSET', search_result[i], up_key, cjson.encode(search_row)) 
        table.insert(new_values, up_key)
        table.insert(new_values, cjson.encode(search_row))
        break
      
      elseif(up_main_val['$remove'] ~= nil) then
        -- remove operation ----------------
        local search_row = redis.call('HGET',search_result[i],up_key);
        search_row = decode_value(search_row)
        
        for map_key, map_val in pairs(up_main_val['$remove']) do -- not needed
          search_row[map_key] = map_val
        end
        --redis.call('HSET', search_result[i], up_key, cjson.encode(search_row)) 
        table.insert(new_values, up_key)
        table.insert(new_values, cjson.encode(search_row))
        
        break
            
      else
        -- direct operation ----------------
        local search_row = redis.call('HGET',search_result[i],up_key);
        search_row = decode_value(search_row)
        
        for map_key, map_val in pairs(up_main_val) do
          search_row[map_key] = map_val
        end
        --redis.call('HSET', search_result[i], up_key, cjson.encode(search_row)) 
        table.insert(new_values, up_key)
        table.insert(new_values, cjson.encode(search_row))
        
        break
      end
    --------------------- SET ------------------------------------------  
    elseif(field_type == "set") then 
      -- add operation ----------------
      if(up_main_val['$add'] ~= nil) then
        local search_row = decode_value(redis.call('HGET',search_result[i],up_key));
        
        for set_idx = 1, #up_main_val['$add'] do
          local indexof = has_value(search_row, up_main_val['$add'][set_idx])
          if indexof == 0 then
            table.insert(search_row, up_main_val['$add'][set_idx])
          end
        end
        --redis.call('HSET', search_result[i], up_key, cjson.encode(search_row)) 
        table.insert(new_values, up_key)
        table.insert(new_values, cjson.encode(search_row))
        
        break
      -- remove operation ----------------    
      elseif(up_main_val['$remove'] ~= nil) then
        local search_row = decode_value(redis.call('HGET',search_result[i],up_key));
        
        for set_idx = 1, #up_main_val['$remove'] do
          local indexof = has_value(search_row, up_main_val['$remove'][set_idx])
          if indexof > 0 then
            table.remove(search_row, indexof)
          end
        end
        
        if(#search_row == 0) then
          --redis.call('HSET', search_result[i], up_key, 'null') 
          table.insert(new_values, up_key)
          table.insert(new_values, 'null')
        else
          --redis.call('HSET', search_result[i], up_key, cjson.encode(search_row)) 
          table.insert(new_values, up_key)
          table.insert(new_values, cjson.encode(search_row))
        end
        
        break
      -- direct operation ----------------     
      else
        local search_row = decode_value(redis.call('HGET',search_result[i],up_key));
        
        for set_idx = 1, #up_main_val do
          local indexof = has_value(search_row, up_main_val[set_idx])
          if indexof == 0 then
            table.insert(search_row, up_main_val[set_idx])
          end
        end
        --redis.call('HSET', search_result[i], up_key, cjson.encode(search_row)) 
        table.insert(new_values, up_key)
        table.insert(new_values, cjson.encode(search_row))
        break
      end
      
    else
      --redis.call('HSET', search_result[i], up_key, up_main_val)
      table.insert(new_values, up_key)
      table.insert(new_values, up_main_val)
      
    end
  end
  redis.call('HMSET', search_result[i], unpack(new_values))
end
return #search_result-1;