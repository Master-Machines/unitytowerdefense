#pragma strict
var on : boolean;


function Start () {
	renderer.material.color = new Color(0,1,0,.25);
}

function Update () {

}

function turnOn(){
	on = true;
	renderer.enabled = true;

}

function turnOff(){
	on = false;
	renderer.enabled = false;

}