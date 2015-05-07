var Enemy = function() {
	this.maxHealth = 50;
	this.curHealth = 50;
	this.elem;
}

Enemy.prototype.setElement = function(elem) {
	this.elem = elem;
}

Enemy.prototype.gotAttacked = function(attackPower) {
	this.curHealth -= attackPower;
	if(this.curHealth <= 0) {
		$(this.elem).remove();
	}
	return this.curHealth;
}

Enemy.prototype.update = function() {
	$(this.elem).find(".enem_cur_health").html(this.curHealth);
}