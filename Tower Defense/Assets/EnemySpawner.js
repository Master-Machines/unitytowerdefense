#pragma strict
var initialWaypoint : Transform;
var unitToSpawn : Transform;
var spawnRate : float;
var reloading : boolean;
var noBuildZone : Transform;



function Start () {

	var zone = Instantiate(noBuildZone, Vector3((transform.position.x + initialWaypoint.position.x)/2,0,(transform.position.z + initialWaypoint.position.z)/2),Quaternion.identity);
	zone.transform.localScale.z = Vector3.Distance(transform.position,initialWaypoint.position);
	zone.transform.LookAt(initialWaypoint);
	zone.transform.rotation.eulerAngles.x = 0;
	reloading = true;
	yield WaitForSeconds(10);
	reloading = false;
}

function Update () {

	if(!reloading)
		spawnUnit();
}

function spawnUnit(){
	reloading = true;
	spawnRate *= .95;
	var spawnedUnit : Transform = Instantiate(unitToSpawn, transform.position, Quaternion.identity);
	var enemyCore : EnemyCore = spawnedUnit.gameObject.GetComponent(EnemyCore) as EnemyCore;
	enemyCore.currentTarget = initialWaypoint;
	enemyCore.setDirection();
	yield WaitForSeconds(Random.Range(0,spawnRate));
	reloading = false;
}