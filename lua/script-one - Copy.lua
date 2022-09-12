local rs = redis.call('JSON.QGET','file','*');
return rs;

