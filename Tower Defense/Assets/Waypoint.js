#pragma strict
var nextTarget : Transform;
var noBuildZone : Transform;

private var mainGoal : Transform;


function Start () {

	var zone = Instantiate(noBuildZone, Vector3((transform.position.x + nextTarget.position.x)/2,0,(transform.position.z + nextTarget.position.z)/2),Quaternion.identity);
	zone.transform.localScale.z = Vector3.Distance(transform.position,nextTarget.position);
	zone.transform.LookAt(nextTarget);
	zone.transform.rotation.eulerAngles.x = 0;
}

function Update () {

}

function OnTriggerEnter(other: Collider){
	
	if(other.gameObject.CompareTag("Enemy")){
		var enemyScript : EnemyCore = other.gameObject.GetComponent(EnemyCore) as EnemyCore;
		if(enemyScript.mainGoal == mainGoal){
			enemyScript.currentTarget = nextTarget;
			enemyScript.setDirection();
		}
	}

}

function setGoal(own : Transform){
	mainGoal = own;
	if(nextTarget.CompareTag("Waypoint")){
		nextTarget.gameObject.GetComponent(Waypoint).setGoal(own);
	}
}