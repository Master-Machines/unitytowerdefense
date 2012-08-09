#pragma strict
import System.Collections.Generic;
var nodes : List.<Transform> = new List.<Transform>();
var lookingToAttack : boolean;
var nodeToAttack : Node;


function Start () {

}

function turnOnBuildRadius(on : boolean){
	if(on){
		for(var i = 0; i < nodes.Count; i++){
			nodes[i].transform.GetChild(0).gameObject.GetComponent(BuildRadius).turnOn();
		}
	}else{
		for(i = 0; i < nodes.Count; i++){
			nodes[i].transform.GetChild(0).gameObject.GetComponent(BuildRadius).turnOff();
		}
	}

}

function deselctNodes(){
	for(var i = 0; i < nodes.Count; i++){
		nodes[i].gameObject.GetComponent(Node).deselect();
	}
	Camera.main.gameObject.GetComponent(cpuInfo).deselctNodes();
}

function Update () {

}