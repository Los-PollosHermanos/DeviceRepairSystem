const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

module.exports = {
  formatTime
}

Date.prototype.format=function(format){
  var date = {
          "M+":this.getMonth()+1,
          "d+":this.getDate(),
          "h+":this.getHours(),
          "m+":this.getMinutes(),
          "s+":this.getSeconds(),
          "q+":Math.floor((this.getMonth()+3)/3),
          "S+":this.getMilliseconds()
  };
  if(/(y+)/i.test(format)){
    format=format.replace(RegExp.$1,(this.getFullYear()+'').substr(4-RegExp.$1.length));
  }
  for(var k in date){
    if (new RegExp("("+k+")").test(format)){
      format=format.replace(RegExp.$1,RegExp.$1.length==1
        ? date[k]:("00"+date[k]).substr((""+date[k].length)));
    }
  }
  return format;
}
