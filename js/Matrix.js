//matrix functions
function newMatrix()
{
  var m = [ [4], [4],[4],[4]];
  return m;
}

function newIdentMatrix()
{
  var m = [ [1,0,0,0], [0,1,0,0], [0,0,1,0], [0,0,0,1]];
  return m;
}

function rotateY(angle)
{
  var m = [ [Math.cos(angle),0,Math.sin(angle),0],
      [0,1,0,0],
      [-Math.sin(angle),0,Math.cos(angle),0],
      [0,0,0,1]];
  return m;
}

function rotateX(angle)
{
  var m = [[1,0,0,0],
      [0,Math.cos(angle),-Math.sin(angle),0],
      [0,Math.sin(angle),Math.cos(angle),0],
      [0,0,0,1]];
  return m;
}

function perspective(zfar)
{
  var znear=1;
  var f = zfar;
  var m = [[f, 0, 0, 0],
      [0, f, 0, 0],
      [0, 0, (zfar+znear)/(znear-zfar), (2*zfar*znear)/(znear-zfar)],
      [0, 0, -1, 0]];
  return m;
}

function translate(tx,ty,tz)
{
  var m = [[1, 0, 0, tx],
      [0, 1, 0, ty],
      [0, 0, 1, tz],
      [0, 0, 0, 1]];
  return m; 
}

function rotateaxis(angle,rx,ry,rz)
{
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  
  var len = Math.sqrt(rx*rx + ry*ry + rz*rz);
  rx = rx / len;
  ry = ry / len;
  rz = rz / len;
  var m = [[rx*rx*(1-c)+c, rx*ry*(1-c)-rz*s, rx*rz*(1-c)+ry*s, 0],
      [ry*rx*(1-c)+rz*s, ry*ry*(1-c)+c, ry*rz*(1-c)-rx*s, 0],
      [rz*rx*(1-c)-ry*s, rz*ry*(1-c)+rx*s, rz*rz*(1-c)+c, 0],
      [0,0,0,1]];
  return m;
}

function multmatrix(m1, m2)
{
  var m3 = newMatrix();
  for(var r=0;r<4;r++)
    for(var c=0;c<4;c++)
      m3[r][c] = 0;

  for(r=0;r<4;r++)
  {
    for(c=0;c<4;c++)
    {
      for(var i=0;i<4;i++)
      {
        m3[r][c] += m1[r][i] * m2[i][c];
      }
    }
  }
  return m3;
}

function multmatrixvector(m, v)
{
  var v2 = [4];
  
  for(var i=0;i<4;i++)
  {
    v2[i]=0;
  }

  for(var r=0;r<4;r++)
  {
    for(i=0;i<4;i++)
    {
      v2[r] += m[r][i] * v[i];
    }
  }
  return v2;
}

function multvectormatrix(v, m)
{
  var v2 = [4];
  
  for(var i=0;i<4;i++)
  {
    v2[i]=0;
  }

  for(var r=0;r<4;r++)
  {
    for(i=0;i<4;i++)
    {
      v2[r] += m[i][r] * v[i];
    }
  }
  return v2;
}

function randn()
{
  //originally from
  //http://www.taygeta.com/random/gaussian.html
  var rx1 = 0;
  var rx2 = 0;
  var rw = 0;
  var ry1 = 0;
  var ry2 = 0;
  
  do{
        rx1 = 2.0 * Math.random() - 1.0;
        rx2 = 2.0 * Math.random() - 1.0;
        rw = rx1 * rx1 + rx2 * rx2;
  }while( rw >= 1.0);
  
    rw = Math.sqrt( (-2.0 * Math.log( rw ) ) / rw );
    ry1 = rx1 * rw;
    ry2 = rx2 * rw;
//  if(Math.round(Math.random())==1){
    return ry1;
//  }else{
//    return ry2;
//  }
}


function dotProd(x1,y1,z1,x2,y2,z2)
{
  return (x1 * x2 + y1 * y2 + z1 * z2);
}

function angleBetween(x1,y1,z1,x2,y2,z2)
{
  var axislen = Math.sqrt(x1*x1 + y1*y1 + z1*z1);
  x1 = x1/axislen;
  y1 = y1/axislen;
  z1 = z1/axislen;

  axislen = Math.sqrt(x2*x2 + y2*y2 + z2*z2);
  x2 = x2/axislen;
  y2 = y2/axislen;
  z2 = z2/axislen;

  var angle = Math.acos( dotProd(x1,y1,z1,x2,y2,z2) );
  if(Math.abs(angle) < 0.0001) return [0,0,1,0];
  if(angle > 180)
  {
    angle = -(360 - angle);
  }

  //cross product
  var x3 = (y1 * z2 - z1 * y2);
  var y3 = (z1 * x2 - x1 * z2);
  var z3 = (x1 * y2 - y1 * x2);

  return [x3,y3,z3,angle];
}
