var cassandraDriver = require('cassandra-driver');
var models = require('express-cassandra');
var path = require('path');
let _redis = require('./../../utils/redis_scripts');


models.setDirectory(path.join(__dirname, './../../models')).bind(
    {
        clientOptions: {
            contactPoints: JSON.parse(process.env.CASSANDRA_URL),
            localDataCenter: 'Cassandra',
            protocolOptions: { port: process.env.CASSANDRA_PORT },
            keyspace: process.env.DB,
            queryOptions: {consistency: models.consistencies.quorum}
        },
        ormOptions: {
            defaultReplicationStrategy : {
                class: 'SimpleStrategy',
                replication_factor: 1
            },
            migration: 'safe'
        }
    },
    function(err) {
        if(err) throw err;

        var params = [10];
		models.instance.Users.execute_query('select * from system.local limit ?', params, function (error, info) {
			if (error) throw error;
			console.log(`Conneted DB Host name: ${info.rows[0].broadcast_address}`);
			console.log(`Conneted DB name: ${process.env.DB}`);
		});
    }
);

module.exports = { models };
