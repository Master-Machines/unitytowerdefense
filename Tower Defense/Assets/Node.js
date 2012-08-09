#pragma strict
import System.Collections.Generic;
var nearbyNodes : List.<Transform> = new List.<Transform>();
var nearbyPaths : List.<Transform> = new List.<Transform>();
var attackingUnits : List.<Transform> = new List.<Transform>();
var reinforcements : List.<Transform> = new List.<Transform>();
var towers : List.<Transform> = new List.<Transform>();

var owner : int;
var unitProduced : Transform;
var numUnits : float;
var productionSpeed : float;
var spawn : boolean = true;
var startingOwner : int;
var unitType : int;
var totalDefense : int;
var selected : boolean;
var lookingToAttack : boolean;
var attacking : boolean;

function Start () {
	changeOwner(startingOwner);
	spawnUnits();
	basicAI();
	yield WaitForSeconds(.01);
	deselect();
}

function basicAI(){
	while(true){
	yield WaitForSeconds(Random.Range(5,40));
	if(owner == 2){
		var counter : int = 0;
		var nearby : boolean = true;
		while(nearby){
			var r : int = Random.Range(0,nearbyNodes.Count);
			counter++;
			if(nearbyNodes[r].gameObject.GetComponent(Node).owner == 1){
				nearby = false;
				attack(r);
			}
			if(counter == 10){
				attack(r);
				nearby = false;
			}
		}
	}
	}
}
function spawnUnits(){

	while(spawn){
		yield WaitForSeconds(productionSpeed);
		totalDefense += unitProduced.gameObject.GetComponent(EnemyCore).defense;
		numUnits++;
	}
}

function Update () {
	if(totalDefense < 0){
		var o : int = 1;
		if(owner == 1)
			o = 2;
		changeOwner(o);
	}

}

function changeOwner(num : int){
	for(var i = 0; i < attackingUnits.Count; i++){
		if(attackingUnits[0] != null){
			Destroy(attackingUnits[0].gameObject);
		}
	}
	for( i = 0; i < towers.Count; i++){
		if(towers[0] != null){
			Destroy(towers[0].gameObject);
		}
	}
	towers.Clear();
	attackingUnits.Clear();
	if(owner == 1){
		Camera.main.gameObject.GetComponent(playerInfo).nodes.Remove(this.transform);
	}else{
		Camera.main.gameObject.GetComponent(cpuInfo).nodes.Remove(this.transform);
	}
	
	owner = num;
	if(owner == 1){
		Camera.main.gameObject.GetComponent(playerInfo).nodes.Add(this.transform);
		renderer.material.color = Color.blue;
	}else{
		Camera.main.gameObject.GetComponent(cpuInfo).nodes.Add(this.transform);
		renderer.material.color = Color.red;
	}
	totalDefense = 0;
	numUnits = 0;
	setWaypointsOwner();
}

function OnMouseDown(){
	if(Camera.main.gameObject.GetComponent(playerInfo).lookingToAttack){
		if(owner >= 1){
			var nodeScript : Node = Camera.main.gameObject.GetComponent(playerInfo).nodeToAttack;
			for(var i = 0; i < nodeScript.nearbyNodes.Count; i++){
				if(nodeScript.nearbyNodes[i] == this.transform){
					nodeScript.attack(i);
				}
			}
			Camera.main.gameObject.GetComponent(playerInfo).lookingToAttack = false;
			iTween.MoveTo(Camera.main.gameObject, Vector3(nodeScript.transform.position.x,Camera.main.transform.position.y ,nodeScript.transform.position.z), .5);
		}
	
	
	}else{
		if(owner == 1){
			Camera.main.gameObject.GetComponent(CurrentGameStuff).deselectTowers();
			select();
		}
	}
	
	
}

function attack(target : int){
	attacking = true;
	attackingUnits.Clear();
	var g = numUnits;
	for(var i = 0; i < g; i++){
		if(attacking){
			var createdUnit = Instantiate(unitProduced, Vector3(transform.position.x, 2, transform.position.z), Quaternion.identity);
			var enemyScript : EnemyCore = createdUnit.gameObject.GetComponent(EnemyCore) as EnemyCore;
			attackingUnits.Add(createdUnit);
			enemyScript.currentTarget = nearbyPaths[target];
			enemyScript.owner = owner;
			enemyScript.mainGoal = nearbyNodes[target];
			numUnits -= 1;
			totalDefense -= unitProduced.gameObject.GetComponent(EnemyCore).defense;
			yield WaitForSeconds(enemyScript.spawnDelay);
		}
	}
	g = reinforcements.Count;
	for( i = 0; i < g; i++){
		if(attacking){
			if(reinforcements[0] != null){
				createdUnit = reinforcements[0];
				enemyScript = createdUnit.gameObject.GetComponent(EnemyCore);
				attackingUnits.Add(createdUnit);
				enemyScript.currentTarget = nearbyPaths[target];
				enemyScript.owner = owner;
				enemyScript.mainGoal = nearbyNodes[target];
				totalDefense -= createdUnit.gameObject.GetComponent(EnemyCore).defense;
				enemyScript.canGo = true;
			}
			reinforcements.RemoveAt(0);
			yield WaitForSeconds(enemyScript.spawnDelay);
		}
	}
	attacking = false;
}

function setWaypointsOwner(){
	for(var i = 0; i < nearbyPaths.Count; i++){
		nearbyPaths[i].gameObject.GetComponent(Waypoint).setGoal(nearbyNodes[i]);
	}
}

function deselect(){
	selected = false;
	transform.GetChild(0).gameObject.GetComponent(BuildRadius).gameObject.renderer.enabled = false;
}

function select(){
	selected = true;
	transform.GetChild(0).gameObject.GetComponent(BuildRadius).gameObject.renderer.enabled = true;
	iTween.MoveTo(Camera.main.gameObject, Vector3(transform.position.x,Camera.main.transform.position.y ,transform.position.z), .5);
}

function OnTriggerEnter(other : Collider){
	
	if(other.gameObject.CompareTag("Enemy")){
		if(other.gameObject.GetComponent(EnemyCore).aged){
			if(other.gameObject.GetComponent(EnemyCore).owner != owner){
				var d : int = other.gameObject.GetComponent(EnemyCore).damage;
				while(d > 0){
					if(numUnits > 0){
						numUnits -= 1.0/unitProduced.gameObject.GetComponent(EnemyCore).defense;
						totalDefense -= 1;
					}else{
						totalDefense -= 1;
					}
					d--;
					Destroy(other.gameObject);
				}
			}else{
				reinforcements.Add(other.transform);
				totalDefense += other.gameObject.GetComponent(EnemyCore).defense;
				yield WaitForSeconds(.2);
				other.gameObject.GetComponent(EnemyCore).canGo = false;
			}
			
		}
		
	}

}



function OnGUI(){
	if(selected){
		if(GUI.Button(Rect(10,Screen.height-80,120,70), "Attack")){
			var canAttack = false;
			for(var i = 0; i < nearbyNodes.Count; i++){
				if(nearbyNodes[i].gameObject.GetComponent(Node).owner == 2)
					canAttack = true;
			}
			if(canAttack){
				var posX : float;
				var posZ : float;
				var counter : int = 0;
				for(i = 0; i < nearbyNodes.Count; i++){
					var nodeScript : Node = nearbyNodes[i].gameObject.GetComponent(Node) as Node;
					if(nodeScript.owner == 2){
						counter ++;
						posX += nearbyNodes[i].position.x;
						posZ += nearbyNodes[i].position.z;
					}
				}
				posX /= counter;
				posZ /= counter;
				iTween.MoveTo(Camera.main.gameObject, Vector3(posX,100 ,posZ), .75);
				Camera.main.gameObject.GetComponent(playerInfo).lookingToAttack = true;
				Camera.main.gameObject.GetComponent(playerInfo).nodeToAttack = gameObject.GetComponent(Node);
			}
		}
		
		if(GUI.Button(Rect(140,Screen.height-80,120,70), "Reinforce")){
			 canAttack = false;
			for(i = 0; i < nearbyNodes.Count; i++){
				if(nearbyNodes[i].gameObject.GetComponent(Node).owner == 1)
					canAttack = true;
			}
			if(canAttack){
				 posX = 0;
				 posZ = 0;
				 counter  = 0;
				for(i = 0; i < nearbyNodes.Count; i++){
					 nodeScript = nearbyNodes[i].gameObject.GetComponent(Node) as Node;
					if(nodeScript.owner == 1){
						counter ++;
						posX += nearbyNodes[i].position.x;
						posZ += nearbyNodes[i].position.z;
					}
				}
				posX /= counter;
				posZ /= counter;
				iTween.MoveTo(Camera.main.gameObject, Vector3(posX,100 ,posZ), .75);
				Camera.main.gameObject.GetComponent(playerInfo).lookingToAttack = true;
				Camera.main.gameObject.GetComponent(playerInfo).nodeToAttack = gameObject.GetComponent(Node);
			}
		}
		
		GUI.Box(Rect(10,10,150,300),"");
		GUI.Label(Rect(20,20,150,100), "Unit Produced: " + unitProduced.gameObject.GetComponent(EnemyCore).unitName);
		GUI.Label(Rect(20,60,150,100), "Main units: " + numUnits);
		GUI.Label(Rect(20,100,150,100), "Reinforcements: " + reinforcements.Count);
		GUI.Label(Rect(20,140,150,100), "Total Defense: " + totalDefense);
	}
}

