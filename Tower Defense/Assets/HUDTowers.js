#pragma strict
var tower1: Transform;


function Start () {
	Global.money = 30;
}

function Update () {

}

function OnGUI(){

	GUI.Label(Rect(Screen.width*.45,20,150,100), "Money: " + Global.money);
	if(GUI.Button(Rect(Screen.width-135, 30,132,40),"Generic Tower: $10")){
		if(Global.money >= 10){
			Global.money -= 10;
			var theTower: Transform = Instantiate(tower1, Vector3(0,0,0), Quaternion.identity);
			var towerScript : BasicTowerScript = theTower.gameObject.GetComponent(BasicTowerScript) as BasicTowerScript;
			towerScript.towerType = 1;
			towerScript.owner = 1;
		}
	}
	
	if(GUI.Button(Rect(Screen.width-135, 70,132,40),"Rocket Tower: $15")){
		if(Global.money >= 15){
			Global.money -= 15;
			theTower = Instantiate(tower1, Vector3(0,0,0), Quaternion.identity);
			towerScript = theTower.gameObject.GetComponent(BasicTowerScript) as BasicTowerScript;
			towerScript.towerType = 2;
			towerScript.owner = 1;
		}
	}
	
	if(GUI.Button(Rect(Screen.width-135, 110,132,40),"Electric Tower: $20")){
		if(Global.money >= 20){
			Global.money -= 20;
			theTower = Instantiate(tower1, Vector3(0,0,0), Quaternion.identity);
			towerScript = theTower.gameObject.GetComponent(BasicTowerScript) as BasicTowerScript;
			towerScript.towerType = 3;
			towerScript.owner = 1;
		}
	}
	if(GUI.Button(Rect(Screen.width-135, 150,132,40),"Poison Tower: $15")){
		if(Global.money >= 15){
			Global.money -= 15;
			theTower = Instantiate(tower1, Vector3(0,0,0), Quaternion.identity);
			towerScript = theTower.gameObject.GetComponent(BasicTowerScript) as BasicTowerScript;
			towerScript.towerType = 4;
			towerScript.owner = 1;
		}
	}

}