var init=function () {
  window.zoomIn=(function () {
    var x, y, scale=1,transX=400, transY=200, phi=1.681,
        cliprect=document.getElementById ('cliprect');

    return function (zoomIn) {
      scale = (zoomIn ? scale * phi : scale / phi);
      x = transX - (transX * scale);
      y = transY - (transY * scale);

      cliprect.setAttributeNS (null, 'transform',
        'translate (' + x + ' ' + y + ')  scale (' + scale + ')');
   };
  })();
}


var inflateAll=function (evt) {
    var
    i, svgrect,
    newtiles=[],
    
    svgns="http://www.w3.org/2000/svg",
    xlinkns='http://www.w3.org/1999/xlink',
   
    phi=0.6180339887498948482,
    phiHundred=phi*100,
    angle18 = 18 * (Math.PI / 180),
    angle54 = 54 * (Math.PI / 180),
    cos18phi=(Math.cos(angle18) * phiHundred),
    sin18phi=(Math.sin(angle18) * phiHundred),
    cos18Hundred=(Math.cos(angle18) * 100.0),
    sin18Hundred=(Math.sin(angle18) * 100.0),
    cos54Hundred=(Math.cos(angle54) * 100.0),
    sin54Hundred=(Math.sin(angle54) * 100.0),

    usenodes=document.getElementsByTagNameNS (svgns, 'use'),
    cliprect=document.getElementById ('cliprect'),

    inflateTile = function (usenode) {
	var 
	origTransform=usenode.getAttributeNS (null, 'transform'),

	tile = function (xtran, ytran, scale, rotate, shapeId){

	    this.setAttributeNS (null, 'transform', origTransform + ' ' +
				 'translate(' + xtran + ' ' + ytran + ') ' +
				 'scale(' + scale + ') ' +
				 'rotate(' + rotate + ')');

	    if (shapeId) { 
		this.setAttributeNS (null, 'id', shapeId);
		this.setAttributeNS (xlinkns, 'xlink:href',
				     (shapeId === 'rhk' ? '#rightHalfKite' :
				      (shapeId === 'lhk' ? '#leftHalfKite' :
				       (shapeId === 'rhd' ? '#rightHalfDart' : '#leftHalfDart' ))));
		newtiles.push (this);
	    }
	};
	
	switch (usenode.id) {
	case 'rhk' : 
	    tile.apply (usenode, [cos18phi, sin18phi, phi, 108]);
	    tile.apply (document.createElementNS (svgns, 'use'), [cos18phi, sin18phi, phi, 108, 'lhk']);
	    tile.apply (document.createElementNS (svgns, 'use'), [cos54Hundred, -sin54Hundred, phi, -36, 'lhd']);
	    break;
	case 'lhk' : 
	    tile.apply (usenode, [-cos18phi, sin18phi, phi, -108]);
	    tile.apply (document.createElementNS (svgns, 'use'), [-cos18phi, sin18phi, phi, -108, 'rhk']);
	    tile.apply (document.createElementNS (svgns, 'use'), [-cos54Hundred, -sin54Hundred, phi, 36, 'rhd']);
	    break;
	case 'rhd' : 
	    tile.apply (usenode, [cos18Hundred, -sin18Hundred, phi, 144]);
	    tile.apply (document.createElementNS (svgns, 'use'), [0, -phiHundred, phi, 0, 'rhk']);
	    break;
	case 'lhd' : 
	    tile.apply (usenode, [-cos18Hundred, -sin18Hundred, phi, -144]);
	    tile.apply (document.createElementNS (svgns, 'use'), [0, -phiHundred, phi, 0, 'lhk']);
	    break;
	default : ;
	}
    };

    for (i=0; i<usenodes.length; i++){
	inflateTile (usenodes.item (i));
    }
    
    for (i=0; i<newtiles.length; i++){
	cliprect.appendChild (newtiles [i]);
    }    
}



