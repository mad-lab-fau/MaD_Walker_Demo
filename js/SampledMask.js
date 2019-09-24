function SampledMask(ndots, walker, width, height) {
  this.walker = w;
  this.ndots = ndots;
  this.width = width;
  this.height = height;
  this.t = 0;
  
  this.walker_mask_samples = new Array(this.walker.nummarkers*3);
  this.walker_mask_pos = new Array();
  this.walker_mask_phases = new Array();
  this.walker_mask_markers = new Array();
  
  //sample walker to make mask
  var m,n;
  var walkertime;
  
  for(n=0;n<this.walker.nummarkers*3;n++)
  {
    this.walker_mask_samples[n] = new Array();
    for(m=0;m<90;m++){
      walkertime = m*Math.PI/45.0;
      this.walker_mask_samples[n][m] = this.walker.sample(n,walkertime,false);
    }
  }

  for(n=0;n<this.ndots;n++)
  {
    var maskleft =   (this.walker.left - this.width/2) - 0.5; // Using an approximation of the walker width as half the height (hence dividing by 4). Then add an extra 0.5 degrees of buffer.
    var masktop =  (this.walker.top - this.height/2) - 0.5; 
    var maskright =  (this.walker.right + this.width/2) + 0.5; 
    var maskbottom = (this.walker.bottom + this.height/2) + 0.5; 
    
    walker_mask_pos.push( new Array((Math.random()*((maskright-maskleft)*1000)/1000+maskleft)*this.walker.pixelsperdegree, (Math.random()*((maskbottom-masktop)*1000)/1000+masktop)*this.walker.pixelsperdegree));
    walker_mask_markers.push(Math.floor(Math.random()*this.walker.nummarkers));
    walker_mask_phases.push(Math.random()*90);
  }
}

SampledMask.prototype.draw = function(dt)
  {
    if(dt <= 0)
      return;
    //mask drawing
    var maskdotx;
    var maskdoty;
    var maskdotz;
    var factor = (1/this.walker.walkersizefactor)*this.walker.walker_size*this.walker.pixelsperdegree;
    var i;
    
    this.t += (dt);
    var curtime = this.walker.calcTime(this.t);

    for (i = 0; i<this.ndots;i++) {
      maskdotz = this.walker_mask_samples[this.walker_mask_markers[i]+0][Math.floor(45*(this.walker_mask_phases[i] +curtime)/Math.PI) % 90];
      maskdotx = this.walker_mask_samples[this.walker_mask_markers[i]+(this.walker.nummarkers*1)][Math.floor(45*(this.walker_mask_phases[i] + curtime)/Math.PI) % 90];
      maskdoty = this.walker_mask_samples[this.walker_mask_markers[i]+(this.walker.nummarkers*2)][Math.floor(45*(this.walker_mask_phases[i] + curtime)/Math.PI) % 90];
      
      var booga = Math.sin(this.walker.camera_azimuth*Math.PI/180)*maskdotz + Math.cos(this.walker.camera_azimuth*Math.PI/180)*maskdotx;
      this.walker.drawDot(this.walker.offsetx + this.walker_mask_pos[i][0]+booga*factor,this.walker.offsety + this.walker_mask_pos[i][1]-maskdoty*factor);
    }

  }