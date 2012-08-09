#pragma strict

function Start () {

}

function Update () {

}

function OnMouseDown(){

	Camera.main.GetComponent(CurrentGameStuff).deselectTowers();
}