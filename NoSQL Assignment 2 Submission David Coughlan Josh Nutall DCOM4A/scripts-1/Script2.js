var myName = "DESKTOP-1TJJLHJ";
db=connect(myName+".local:27000/test");
res=rs.initiate({
	"_id":"dublin",
	"members":[
		{_id:0,host:myName+".local:27000"},
		{_id:1,host:myName+".local:27001"},
		{_id:2,host:myName+".local:27002"}
	]
});
rs.status();