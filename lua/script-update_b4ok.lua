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

local update_values = cjson.decode(ARGV[1]);
local search_result = redis.call('FT.SEARCH',unpack(KEYS));

for i=2,#search_result,2 do -- 1st
  for up_main_key, up_main_val in pairs(update_values) do -- 2nd
    local up_key, field_type = string.match(up_main_key, "(.*)%@@(.*)")
    
    if(field_type == "map") then 
      if(up_main_val['$add'] ~= nil) then
        for j=1,#search_result[i+1], 2 do -- iterate current row's column by 2
          if up_key == search_result[i+1][j] then -- matched update_values column key to current column key
            search_result[i+1][j+1] = decode_value(search_result[i+1][j+1])
            
            for map_key, map_val in pairs(up_main_val['$add']) do
              search_result[i+1][j+1][map_key] = map_val
            end
            redis.call('hmset', search_result[i], up_key, cjson.encode(search_result[i+1][j+1])) 
            break
          end
        end
      
      elseif(up_main_val['$remove'] ~= nil) then
        for j=1,#search_result[i+1], 2 do -- iterate current row's column by 2
          if up_key == search_result[i+1][j] then -- matched update_values column key to current column key
            search_result[i+1][j+1] = decode_value(search_result[i+1][j+1])
            
            for map_key, map_val in pairs(up_main_val['$remove']) do
              search_result[i+1][j+1][map_key] = ''
            end
            redis.call('hmset', search_result[i], up_key, cjson.encode(search_result[i+1][j+1])) 
            
            break
          end
        end
      
      else
        for j=1,#search_result[i+1], 2 do -- iterate current row's column by 2
          if up_key == search_result[i+1][j] then -- matched update_values column key to current column key
            search_result[i+1][j+1] = decode_value(search_result[i+1][j+1])
            
            for map_key, map_val in pairs(up_main_val) do
              search_result[i+1][j+1][map_key] = map_val
            end
            redis.call('hmset', search_result[i], up_key, cjson.encode(search_result[i+1][j+1])) 
            
            break
          end
        end
      end
      
    elseif(field_type == "set") then 
      if(up_main_val['$add'] ~= nil) then
        for j=1,#search_result[i+1], 2 do -- iterate current row's column by 2
          if up_key == search_result[i+1][j] then -- matched update_values column key to current column key
            search_result[i+1][j+1] = decode_value(search_result[i+1][j+1])
            
            for set_idx = 1, #up_main_val['$add'] do
              local indexof = has_value(search_result[i+1][j+1], up_main_val['$add'][set_idx])
              if indexof == 0 then
                table.insert(search_result[i+1][j+1], up_main_val['$add'][set_idx])
              end
            end
            redis.call('hmset', search_result[i], up_key, cjson.encode(search_result[i+1][j+1])) 
            break
          end
        end
      elseif(up_main_val['$remove'] ~= nil) then
        for j=1,#search_result[i+1], 2 do -- iterate current row's column by 2
          if up_key == search_result[i+1][j] then -- matched update_values column key to current column key
            search_result[i+1][j+1] = decode_value(search_result[i+1][j+1])
            for set_idx = 1, #up_main_val['$remove'] do
              local indexof = has_value(search_result[i+1][j+1], up_main_val['$remove'][set_idx])
              if indexof > 0 then
                table.remove(search_result[i+1][j+1], indexof)
              end
            end
            if(#search_result[i+1][j+1] == 0) then
              redis.call('hmset', search_result[i], up_key, 'null')
            else
              redis.call('hmset', search_result[i], up_key, cjson.encode(search_result[i+1][j+1]))
            end
            
            break
          end
        end
      else
        for j=1,#search_result[i+1], 2 do -- iterate current row's column by 2
          if up_key == search_result[i+1][j] then -- matched update_values column key to current column key
            search_result[i+1][j+1] = decode_value(search_result[i+1][j+1])
            
            for set_idx = 1, #up_main_val do
              local indexof = has_value(search_result[i+1][j+1], up_main_val[set_idx])
              if indexof == 0 then
                table.insert(search_result[i+1][j+1], up_main_val[set_idx])
              end
            end
            redis.call('hmset', search_result[i], up_key, cjson.encode(search_result[i+1][j+1])) 
            break
          end
        end
      end
      
    else
      redis.call('hmset', search_result[i], up_key, up_main_val)
    end
  end
end
return #search_result-1;


