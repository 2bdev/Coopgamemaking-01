/* Creating global Vars */

// Stats 
var max_health = 100;
var cur_health = max_health;
var strength = 1;
var defense = 1;
var intellect = 1;
var dexterity = 1;

// Level control
var level = 1;
var experience = 0;
var experience_tnl = 50;
var stat_points = 0;
var max_stat_points = 0;
var can_level_stats = false;

// Time
var game_time = 250;
var prev_time = new Date();
var passed_time = 0;

// Game Area
var game_width;
var game_height = 600;

// Characters
var char_width = 100;
var char_height = 100;

// Enemies
var enemies = new Array();

/* Updating variables on page when the document loads */
$(document).ready(function(e) {
	
	// Initiate stats on screen
	update_stats();

	// Set game area size
	init_game_area();
	
	// Game Loop
	var game_tick = setInterval(function(){
		
			// Ensures that the game still functions when the tab is closed
			var current_time = new Date();
			var time_difference = (current_time.getTime() - prev_time.getTime());
			
			// Calculates the difference in time and returns multiplier
			if(time_difference > game_time){
				if(Math.floor(time_difference/game_time > 1)){
					passed_time = Math.floor(time_difference/game_time)
				}else{
					passed_time = 1;	
				}
			}else{
				passed_time = 1;	
			}
			prev_time = new Date();
			update_game(passed_time);
			
		}, game_time);
	
});

var update_stats = function(){
	
	// Updating stats
	$("#level").html(level);
	$(".max_health").html(max_health);
	$(".cur_health").html(cur_health);
	$("#strength").html(strength);
	$("#defense").html(defense);
	$("#intellect").html(intellect);
	$("#dexterity").html(dexterity);
	$("#avail_stat_points").html(stat_points);
	$("#exp").html(experience);
	$("#exp_tnl").html(experience_tnl);
	
};

var update_game = function(passed_time){
		
	var enem_length = enemies.length;

	// only add experience if health is full and no enemies
	// otherwise heal player until full health
	if(enem_length == 0) {
		if(cur_health < max_health) {
			cur_health++;
		} else {
			// Adds exp each game tick
			experience += 10*passed_time;
		}
	}

	if(experience > experience_tnl){
		experience -= experience_tnl;
		experience_tnl = get_experience_tnl();
		level += 1;
		stat_points += 2;
		max_stat_points += 2;
		displayMessage("Level up!");
	}

	
	for(i=0; i<enem_length; i++) {
		playerGotAttacked(1);		// TODO: change to use enemy attack power

		// determine attack power based on dexterity and strength
		var roll = getRandomInt(0, 101);
		var attack = 1;
		if(roll < dexterity) {
			attack = strength;
			displayMessage("Power Attack!");
		}
		health = enemies[i].gotAttacked(attack); // TODO: change to use player attack power
		enemies[i].update();
		if(health <= 0) {
			experience += 500;
			enemies.splice(i, 1);
		}
	}

	// Updates stats on the screen
	update_stats();
	
	// Checks if stats can be upgraded
	check_stat_points();
	
};

// Gets the exp until next level based on advanced algorithm
var get_experience_tnl = function(){
	
	//Random algorithm that doesn't make sense at all
	return (Math.pow((level*10), 2));
	
};


// Checks if stats can be upgraded and shows + symbols
var check_stat_points = function(){
	
	if(stat_points > 0 && stat_points <= max_stat_points){
		can_level_stats = true;
		$(".add_stat").show();
	}else if(stat_points == 0 || stat_points > max_stat_points){
		can_level_stats = false	
		$(".add_stat").hide();
	}
	
}

var init_game_area = function() {
	// get and set game width
	game_width = $("#game_area").width();
	// set game area height
	$("#game_area").height(game_height + "px");

	$("#game_area").append('<div id="player"><span class="cur_health">'+cur_health+'</span>/<span class="max_health">'+max_health+'</span></div>');
	$("#player").css("bottom", 20);
	$("#player").css("left", (game_width / 2) - (char_width / 2));
	$("#player").css("height", char_height);
	$("#player").css("width", char_width);
	
}

var spawn_enemy = function() {
	// randomly generate position
	var top = getRandomInt(0, game_height - char_height);
	var left = getRandomInt(0, game_height - char_width);

	var enemy = new Enemy();
	var elem = $('<div class="enemy"><span class="enem_cur_health">'+enemy.curHealth+'</span>/<span class="enem_max_health">'+enemy.maxHealth+'</span></div>');
	elem.css("height", char_height);
	elem.css("width", char_width);
	elem.css("top", top);
	elem.css("left", left);
	$("#game_area").append(elem);
	enemy.setElement(elem);
	enemies.push(enemy);
}

var playerGotAttacked = function(attackPower) {
	// arbitrary use of defense to determine if attack was successful
	var success = 100 - Math.abs(attackPower - defense);	// get a percent of attack success (i.e. 5)
	var roll = getRandomInt(0, 101);							// get a random roll between 0 and 100
	if(roll < success) {
		cur_health -= attackPower;
	} else {
		displayMessage("Defended!");
	}
}

var displayMessage = function(message) {
	$("#messages p").text(message).show().fadeOut(1000);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// trigger enemy every x seconds
setInterval(spawn_enemy, 20000);

/* Checks for clicks on stat upgrades */

// Max Health
$("#health_add").click(function(){
	if(can_level_stats){
		max_health += 10;
		stat_points -= 1;
		check_stat_points();
	}
});

$("#defense_add").click(function(){
	if(can_level_stats){
		defense += 1;
		stat_points -= 1;
		check_stat_points();
	}
});


// Strength
$("#strength_add").click(function(){
	if(can_level_stats){
		strength += 1;
		stat_points -= 1;
		check_stat_points();
	}
});


//Intellect
$("#intellect_add").click(function(){
	if(can_level_stats){
		intellect += 1;
		stat_points -= 1;
		check_stat_points();
	}
});


//Dexterity
$("#dexterity_add").click(function(){
	if(can_level_stats){
		dexterity += 1;
		stat_points -= 1;
		check_stat_points();
	}
});
