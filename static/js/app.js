BigNumber.config({ EXPONENTIAL_AT: 50 });
BigNumber.config({ ERRORS: false });

function init(usd, eur){
	calculateEther("ether", new BigNumber(1));	
	calculateUSD(usd);
	calculateEUR(eur);
}

function calculateUSD(usd){
	var total = parseFloat(usd);
	document.getElementById("usd").value = (parseFloat(document.getElementById("ether").value)*total).toFixed(3);
}

function calculateEUR(eur){
	var total = parseFloat(eur);
	document.getElementById("eur").value = (parseFloat(document.getElementById("ether").value)*total).toFixed(3);
}

function calculate(el, usd, eur){
	
	//if(parseFloat(el.value) != NaN){
		calculateEther(el.id, convertToEther(el));	
		calculateUSD(usd);
		calculateEUR(eur);
		return true;
	//}
	
	//return false;
		
	
}

function calculateEther(id,v){
	
	if(id != "wei" ) document.getElementById("wei").value = v.times(new BigNumber(1000000000000000000)).toString();
	if(id != "kwei" ) document.getElementById("kwei").value = v.times(new BigNumber(1000000000000000)).toString();
	if(id != "mwei" ) document.getElementById("mwei").value = v.times(new BigNumber(1000000000000)).toString();
	if(id != "gwei" ) document.getElementById("gwei").value = v.times(new BigNumber(1000000000)).toString();
	if(id != "szabo" ) document.getElementById("szabo").value = v.times(new BigNumber(1000000)).toString();
	if(id != "finney" ) document.getElementById("finney").value = v.times(new BigNumber(1000)).toString();
	if(id != "ether" ) document.getElementById("ether").value = v.times(new BigNumber(1)).toString();
	if(id != "kether" ) document.getElementById("kether").value = v.times(new BigNumber(0.001)).toString();
	if(id != "mether" ) document.getElementById("mether").value = v.times(new BigNumber(0.000001)).toString();
	if(id != "gether" ) document.getElementById("gether").value = v.times(new BigNumber(0.000000001)).toString();
	if(id != "tether" ) document.getElementById("tether").value = v.times(new BigNumber(0.000000000001)).toString();
}

function convertToEther(el){
	var id = el.id;
	var value = new BigNumber(el.value);
	switch(id) {
		case "wei":
			value = value.times(new BigNumber(0.000000000000000001));
			break;
		case "kwei":
			value = value.times(new BigNumber(0.000000000000001));
			break;
		case "mwei":
			value = value.times(new BigNumber(0.000000000001));	
			break;
		case "gwei":
			value = value.times(new BigNumber(0.000000001));	
			break;
		case "szabo":
			value = value.times(new BigNumber(0.000001));	
			break;
		case "finney":
			value = value.times(new BigNumber(0.001));	
			break;
		case "ether":
			value = value.times(new BigNumber(1));	
			break;
		case "kether":
			value = value.times(new BigNumber(1000));	
			break;
		case "mether":
			value = value.times(new BigNumber(1000000));	
			break;
		case "gether":
			value = value.times(new BigNumber(1000000000));	
			break;
		case "tether":
			value = value.times(new BigNumber(1000000000000));	
			break;		
		default:
			break;
	}
	return value;
}<script>
(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';        
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();
</script>