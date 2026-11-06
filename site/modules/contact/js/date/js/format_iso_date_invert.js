// Formats date and time as "01-01-2010"
Date.prototype.toFormattedString = function(include_time)
{
   str = Date.padded2(this.getDate()) + "-" + Date.padded2(this.getMonth() + 1) + "-" + this.getFullYear();
   if (include_time) { str += " " + this.getHours() + ":" + this.getPaddedMinutes() }
   return str;
}

Date.parseFormattedString = function (string) {

    var regexp = "([0-9]{2})(-([0-9]{2})(-([0-9]{4})" + "?)?)?"; 

    var d = string.match(new RegExp(regexp, "i"));
    if (d === null) {
        return Date.parse(string); // at least give javascript a crack at it.
    }
    var offset = 0; 
    var date = new Date(d[5], d[3]-1, d[1]); 
    return date; 
};