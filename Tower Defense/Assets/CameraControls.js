#pragma strict
var cameraScrollSpeed : float = 1;


function Start () {

}

function Update () {

	if(Input.GetKey(KeyCode.W)){
		transform.position.z += cameraScrollSpeed;	
	}
	if(Input.GetKey(KeyCode.S)){
		transform.position.z -= cameraScrollSpeed;	
	}
	if(Input.GetKey(KeyCode.A)){
		transform.position.x -= cameraScrollSpeed;	
	}
	if(Input.GetKey(KeyCode.D)){
		transform.position.x += cameraScrollSpeed;	
	}
	transform.position.y -= Input.GetAxisRaw("Mouse ScrollWheel")*12;

}

