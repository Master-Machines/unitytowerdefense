#pragma strict

function Start () {

}

function Update () {

}

function OnTriggerEnter (other: Collider){
	if(other.gameObject.CompareTag("Enemy"))
	{
		var enemyScript : EnemyCore = other.gameObject.GetComponent(EnemyCore) as EnemyCore;
		if(enemyScript.owner != transform.parent.gameObject.GetComponent(BasicTowerScript).owner){
			var towerScript : BasicTowerScript = transform.parent.gameObject.GetComponent(BasicTowerScript) as BasicTowerScript;
			towerScript.enemies.Add(other.transform);
		}
	}

}

function OnTriggerExit (other: Collider){
	if(other.gameObject.CompareTag("Enemy"))
	{
		
		var towerScript : BasicTowerScript = transform.parent.gameObject.GetComponent(BasicTowerScript) as BasicTowerScript;
		towerScript.enemies.Remove(other.transform);
	}

}