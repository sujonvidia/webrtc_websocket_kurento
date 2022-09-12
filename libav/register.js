module.exports = class Register {
	constructor() {
		this.usersByName = {};
		this.userSessionIds = {};
		// this.userConvIds = {};
	}
	//@param {object} user 
	register(user) {
		this.usersByName[user.name] = user;
		this.userSessionIds[user.id] = user;
		// this.userConvIds[user.conversation_id] = user;
		console.log('call_register',user.name);
	}
	getById(id) {
		return this.userSessionIds[id];
	}
	//@param {string} name 
	getByName(name) {
		return this.usersByName[name];
	}
	// getByConvId(convid) {
	// 	return this.userConvIds[convid];
	// }
	// @param {*} name
	removeByName(name) {
		let user = this.getByName(name);
		if (user) {
			delete this.usersByName[user.name];
			delete this.userSessionIds[user.id];
			// delete this.userConvIds[user.conversation_id];
		}
	}
	// @param {string} name
	unregister(name) {
		let user = this.getByName(name);
		if (user) {
			delete this.usersByName[user.name];
			delete this.userSessionIds[user.id];
			// delete this.userConvIds[user.conversation_id];
		}
	}

}
