#pragma strict
var currentTarget : Transform;
var mainGoal : Transform;
var speed : float;

var damage : int;
var defense : int;

var unitName : String;
var bounty : int;

var enemyType : int;
var hitPoints : float;
var aged : boolean = false;
var spawnDelay : float;
var currentPoisonID : int;
var owner : int;
var directionCounter : int;
var canGo : boolean = true;
var startingColor : Color;

function Start () {

	setDirection();
	yield WaitForSeconds(.05);
	checkType();
	renderer.material.color = startingColor;
	yield WaitForSeconds(4);
	aged = true;
}

function checkType(){
	
}

function Update () {
	if(canGo){
		transform.position += transform.forward*speed;
		if(hitPoints <= 0){
			Destroy(this.gameObject);
			Global.money += bounty;
		}
		directionCounter++;
		if(directionCounter == 20){
			directionCounter = 0;
			setDirection();
		}
	}
}

function setDirection(){

	iTween.LookTo(this.gameObject,iTween.Hash("looktarget", currentTarget,"time",.3));
}

function poison(damage : float,time : float){
	currentPoisonID++;
	var id = currentPoisonID;
	for(var i = 0;i < 100; i++){
		if(id == currentPoisonID){
			hitPoints -= damage/100.0;
			yield WaitForSeconds(time/100.0);
		}
	}	

}

function OnTriggerEnter(other : Collider){
	
	if(owner == 1){
		if(other.gameObject.CompareTag("Enemy")){
			var enemyScript : EnemyCore = other.gameObject.GetComponent(EnemyCore) as EnemyCore;
			if(enemyScript.owner == 2){
				var damage1 : int = damage;
				var damage2 : int = enemyScript.damage;
				hitPoints -= hitPoints*(damage2/defense);
				enemyScript.hitPoints -= enemyScript.hitPoints*(damage1/enemyScript.defense);
				if(hitPoints > 0){
					defense -= damage2;
				}
				if(enemyScript.hitPoints > 0){
					enemyScript.defense -= damage;
				}
			}
		}
	}

}