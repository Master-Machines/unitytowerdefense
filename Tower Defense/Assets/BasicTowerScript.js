#pragma strict
import System.Collections.Generic;
var attackRadius : Transform;
var placed : boolean = false;
var canBePlaced : int = -1;
var selected : boolean = false;

var reloadTime : float;
var reloading : boolean;
var towerType : int;
var damage : float;

var rocket : Transform;

var mainColor : Color;
var owner : int;
var level : int;
var upgradeCost: int = 15;

var enemies : List.<Transform> = new List.<Transform>();

var poisonDamage : float;
var poisonTime : float;

function Start () {
	
	gameObject.renderer.material.color = Color.red;
	transform.GetChild(0).gameObject.GetComponent(TowerRadius).gameObject.renderer.material.color = new Color(0,1,0,.25);
	transform.GetChild(0).gameObject.GetComponent(TowerRadius).gameObject.renderer.enabled = true;
	Camera.main.GetComponent(CurrentGameStuff).towers.Add(this.transform);
	Camera.main.gameObject.GetComponent(playerInfo).turnOnBuildRadius(true);
	if(owner == 2){
		placed = true;
		deselect();
	}
	yield WaitForSeconds(.05);
	setType();
}

function setType(){
	if(towerType == 1){
		mainColor = Color.gray;
	}
	if(towerType == 2){
		transform.GetChild(0).localScale.x = 4;
		transform.GetChild(0).localScale.z = 4;
		damage *= .4;
		mainColor = Color.magenta;
	}
	if(towerType == 3){
		mainColor = Color.blue;
		transform.GetChild(0).localScale.x = 4;
		transform.GetChild(0).localScale.z = 4;
		damage *= .8;
		light.color = Color.blue;
	}
	if(towerType == 4){
		poisonDamage = damage*2;
		poisonTime = 15;
		damage *= .2;
		mainColor = Color.green;
		light.color = Color.green;
	}
}

function Update () {
	if(light.enabled){
		light.range *= .85;
		if(light.range < 10){
			light.enabled = false;
		}
	}
	if(!placed){
		var playerPlane = new Plane(Vector3.up, transform.position);
	
  	
    	
    	var hitdist = 0.0;
    
    	var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	    if (playerPlane.Raycast (ray, hitdist)) {
	    
	        var targetPoint = ray.GetPoint(hitdist);
	        
			transform.position = targetPoint;
			transform.position.y = 3;
	        //var targetRotation = Quaternion.LookRotation(targetPoint - transform.position);
	
	        //transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, speed * Time.deltaTime);
	       // transform.rotation = targetRotation;
	       //var differencePos = (transform.position - targetPoint);
	        //laser.SetPosition(0, transform.position);
			//laser.SetPosition(1, transform.position + (Vector3(35*(Mathf.Sin((transform.rotation.eulerAngles.y)*Mathf.PI/180)),0,(35*Mathf.Cos((transform.rotation.eulerAngles.y*Mathf.PI/180))))));
		
		}
	}else if(enemies.Count > 0 && !reloading){
		attack();
	}

}

function deselect(){
	selected = false;
	transform.GetChild(0).gameObject.GetComponent(TowerRadius).gameObject.renderer.enabled = false;
}

function select(){
	selected = true;
	transform.GetChild(0).gameObject.GetComponent(TowerRadius).gameObject.renderer.enabled = true;
}

function checkEnemiesAlive(){
	var theyDead = new Array(enemies.Count);
	for(var i = 0; i < enemies.Count; i++){
		if(enemies[i] == null){
			theyDead[i] = 1;
		}else{
			theyDead[i] = 0;
		}
	}
	for(i = 0; i < enemies.Count; i++){
		if(theyDead[i] == 1){
			enemies.Remove(enemies[i]);
		}	
	}
}

function OnMouseDown(){
	if(owner == 1){
		if(placed == true){
			Camera.main.gameObject.GetComponent(CurrentGameStuff).deselectTowers();
			select();
		}
		
		if(canBePlaced == 0 && !placed){
			placed = true;
			gameObject.renderer.material.color = mainColor;
			transform.GetChild(0).gameObject.GetComponent(TowerRadius).gameObject.renderer.enabled = false;
			Camera.main.gameObject.GetComponent(playerInfo).turnOnBuildRadius(false);
		}
	}
	
}



function OnTriggerEnter(other : Collider){
	if(!placed){
		if(other.gameObject.CompareTag("noBuildZone") || other.gameObject.CompareTag("node") ||other.gameObject.CompareTag("Tower")){
			canBePlaced++;
			gameObject.renderer.material.color = Color.red;
		}
		if(other.gameObject.CompareTag("buildRadius")){
			if(other.transform.parent.gameObject.GetComponent(Node).owner == owner){
				canBePlaced-= 1;
				other.transform.parent.gameObject.GetComponent(Node).towers.Add(this.transform);
			}
		}
		if(canBePlaced == 0)
				gameObject.renderer.material.color = Color.green;
	}
}

function OnTriggerExit(other : Collider){
	if(!placed){
		if(other.gameObject.CompareTag("buildRadius")){
			if(other.transform.parent.gameObject.GetComponent(Node).owner == owner){
				canBePlaced++;
				other.transform.parent.gameObject.GetComponent(Node).towers.Remove(this.transform);
				gameObject.renderer.material.color = Color.red;
			}
		}
		if(other.gameObject.CompareTag("noBuildZone") || other.gameObject.CompareTag("node") || other.gameObject.CompareTag("Tower")){
			canBePlaced -= 1;
			
			
		}
		if(canBePlaced == 0)
				gameObject.renderer.material.color = Color.green;
		
		if(placed)
			gameObject.renderer.material.color = mainColor;
	}
}

function attack(){
	checkEnemiesAlive();
	if(!reloading){
		if(enemies.Count > 0){
			if(towerType == 1){
				basicHit();
			}
			if(towerType == 2){
				rocketHit();
			}
			if(towerType == 3){
				electricHit();
			}
			if(towerType == 4){
				poisonHit();
			}
		
		}
	}

}

function basicHit(){
	
	if(enemies[0] == null){
		enemies.RemoveAt(0);
	}else{
		reloading = true;
		var enemyCore : EnemyCore = enemies[0].gameObject.GetComponent(EnemyCore) as EnemyCore;
		enemyCore.hitPoints -= damage;
		light.enabled = true;
		light.range = 25 + level*5;
		yield WaitForSeconds(reloadTime);
		reloading = false;
	}

}

function rocketHit(){

	if(enemies[0] == null){
		enemies.RemoveAt(0);
	}else{
		reloading = true;
		var rocket = Instantiate(rocket, transform.position, Quaternion.identity);
		var rocketScript : RocketScript = rocket.gameObject.GetComponent(RocketScript) as RocketScript;
		rocketScript.radius = 4;
		rocketScript.damage = damage;
		iTween.MoveTo(rocket.gameObject, enemies[0].position, .1);
		yield WaitForSeconds(reloadTime);
		reloading = false;
	}

}

function poisonHit(){

	if(enemies[0] == null){
		enemies.RemoveAt(0);
	}else{
		reloading = true;
		var enemyCore : EnemyCore = enemies[0].gameObject.GetComponent(EnemyCore) as EnemyCore;
		enemyCore.hitPoints -= damage;
		enemyCore.poison(poisonDamage, poisonTime);
		light.enabled = true;
		light.range = 25 + level*5;
		yield WaitForSeconds(reloadTime);
		reloading = false;
	}


}


function electricHit(){
	reloading = true;
	for(var i = 0; i < enemies.Count; i++){
		if(enemies[i] != null){
			var enemyCore : EnemyCore = enemies[i].gameObject.GetComponent(EnemyCore) as EnemyCore;
			enemyCore.hitPoints -= damage;
		}else{
			enemies.RemoveAt(i);
		}
	}
	
	light.enabled = true;
	light.range = 25 + level*5;
	yield WaitForSeconds(reloadTime);
	reloading = false;

}

function upgrade(){
	upgradeCost *= 1.5;
	
	if(towerType == 1){
		transform.GetChild(0).localScale.x += 2;
		transform.GetChild(0).localScale.z += 2;
		reloadTime *= .8;
	}
	
	if(towerType == 2){
		transform.GetChild(0).localScale.x += 2;
		transform.GetChild(0).localScale.z += 2;
		reloadTime *= .8;
	}
	
	if(towerType == 3){
		transform.GetChild(0).localScale.x += .5;
		transform.GetChild(0).localScale.z += .5;
		reloadTime *= .8;
	}
	
	if(towerType == 4){
		transform.GetChild(0).localScale.x += 2;
		transform.GetChild(0).localScale.z += 2;
		reloadTime *= .8;
	}
	
	
}

function OnGUI(){

	if(selected){
		if(GUI.Button(Rect(10,Screen.height-80,120,70), "Upgrade: $" + upgradeCost)){
			if(Global.money >= upgradeCost){
				Global.money -= upgradeCost;
				upgrade();
			}
		}
		
		GUI.Box(Rect(10,10,200,300),"");
		GUI.Label(Rect(20,20,150,100), "Attack Cooldown: " + reloadTime);
		GUI.Label(Rect(20,60,150,100), "Range: " + transform.GetChild(0).localScale.x);
	}

}