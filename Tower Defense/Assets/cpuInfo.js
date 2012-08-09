#pragma strict
import System.Collections.Generic;
var nodes : List.<Transform> = new List.<Transform>();

function deselctNodes(){
	for(var i = 0; i < nodes.Count; i++){
		nodes[i].gameObject.GetComponent(Node).deselect();
	}

}

function Start () {

}

function Update () {

}