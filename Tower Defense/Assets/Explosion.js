#pragma strict
var damage : float;
function Start () {
	
}

function Update () {

}

function OnTriggerEnter(other : Collider){
	
	if(other.gameObject.CompareTag("Enemy")){
		var enemyScript : EnemyCore = other.gameObject.GetComponent(EnemyCore) as EnemyCore;
		enemyScript.hitPoints -= damage;
	
	}

}