#pragma strict
import System.Collections.Generic;
var towers : List.<Transform> = new List.<Transform>();
var lives : int = 20;

function deselectTowers(){
	
	for(var i = 0; i < towers.Count; i++){
		if(towers[i] != null){
			towers[i].gameObject.GetComponent(BasicTowerScript).deselect();
		}else{
			towers.RemoveAt(i);
		}
	}
	Camera.main.gameObject.GetComponent(playerInfo).deselctNodes();
}

function Start () {

}

function getUnitName(type : int){
	if(type == 0){
		return "Basic Attacker";
	}
}

function Update () {

}