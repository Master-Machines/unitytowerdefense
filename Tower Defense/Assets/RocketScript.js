#pragma strict
var explosion : Transform;
var damage : float;
var radius : float;
function Start () {
	yield WaitForSeconds(.05);
	var exp : Transform = Instantiate(explosion, transform.position, Quaternion.identity);
	var explosionScript : Explosion = exp.gameObject.GetComponent(Explosion) as Explosion;
	explosionScript.damage = damage;
	exp.localScale.x = radius;
	exp.localScale.z = radius;
	gameObject.renderer.enabled = false;
	yield WaitForSeconds(.2);
	Destroy(exp.gameObject);
	Destroy(this);
}

function Update () {

}