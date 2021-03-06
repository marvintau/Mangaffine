var THREE = require('three');

TextLabelCloud = function(points, names){
	THREE.Object3D.call(this);
	var _this = this;


	this.canvas = document.createElement('canvas');
	this.canvas.width = 600;
	this.context = this.canvas.getContext('2d');

	points.forEach(function(e, i){
		_this.addLabel(names ? names[i] : i, e);
	})

}

TextLabelCloud.prototype = Object.create(THREE.Object3D.prototype);
TextLabelCloud.prototype.constructor = TextLabelCloud;

TextLabelCloud.prototype.addLabel = function(message, point){
	this.add(this.makeTextLabel(message, point));
}

TextLabelCloud.prototype.addIndexLabel = function(point){
	this.add(this.makeTextLabel(this.children.length, point));
}

TextLabelCloud.prototype.removeLabel = function(){
	var len = this.children.length;
	this.remove(this.children[len - 1]);
}

TextLabelCloud.prototype.add3Labels = function(point){
	this.add(this.makeTextLabel(this.children.length, point));
	this.add(this.makeTextLabel(this.children.length, point));
	this.add(this.makeTextLabel(this.children.length, point));
}

TextLabelCloud.prototype.remove3Labels = function(index){
	this.removeLabelAt(index);
	this.removeLabelAt(index);
	this.removeLabelAt(index);
}


TextLabelCloud.prototype.setLabelPositionAt = function(point, index){
	this.children[index].position.copy(point);
}

TextLabelCloud.prototype.update = function(points, index){
	if (index){
		this.children[index].position.copy(points[index]);
	} else {	
		points.forEach(function(p, i){
			this.children[i].position.copy(p);
		}.bind(this))
	}
}

TextLabelCloud.prototype.makeTextLabel = function( message, point ) {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

	var metrics = this.context.measureText( message );
	var textWidth = metrics.width;

	this.canvas.width = (textWidth+320)*2;
	this.context.fillStyle = "rgba(0, 0, 0, 1.0)";
	this.context.font = "lighter 40px Helvetica Neue"
	this.context.fillText( message, textWidth+320, 40*1.4);

	var image = new Image();
	image.src = this.canvas.toDataURL();
	
	var texture = new THREE.Texture();
	texture.image = image;
	texture.needsUpdate = true;
	texture.minFilter = THREE.LinearFilter;
	var spriteMaterial = new THREE.SpriteMaterial( { map: texture} );

	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set((textWidth+320)*2/300*10, 5, 1.5);
	sprite.position.copy(point);
	return sprite;	
}

module.exports = TextLabelCloud;