function hex2num(hex) {
    if(hex.charAt(0) == "#") { hex = hex.slice(1); }//Remove the '#' char - if there is one.
    hex = hex.toUpperCase();
    var hex_alphabets = "0123456789ABCDEF";
    var value = new Array(4);
    var k = 0;
    var int1,int2;
    for(var i=0;i<8;i+=2) {
        int1 = hex_alphabets.indexOf(hex.charAt(i));
        int2 = hex_alphabets.indexOf(hex.charAt(i+1)); 
        value[k] = (int1 * 16) + int2;
        value[k] = value[k]/255.0;
        k++;
    }
    return(value);
}