
import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._
import json._


	
class JSServerSimulation extends Simulation {
	println("Hello, JSServerSimulation!")
	/*
	var capital = Map("US"->"Washington", "France" -> "Paris") 
	capital += ("Japan" -> "Tokyo") 
	println(capital("France"))
	
	val msg3: String = "Hello yet again, world!"
	
	val big = new java.math.BigInteger("12345")
	println(big)
	
	var jetSet = Set("Boeing", "Airbus") 
	jetSet += "Lear" 
	println(jetSet.contains("Cessna"))
	*/
	
	class Msg {
		var m_aryCmd = List[Map[Any,Any]]();

		def addCmd( cmd:Map[Any,Any] ) : List[Map[Any,Any]]={ 
			m_aryCmd = cmd :: m_aryCmd;
			return m_aryCmd
		}

		def getCmds( ) : String = {
			var cmds = Map("cmds"->m_aryCmd);		  	
			return Json.build(cmds).toString
		}
	}

	object Login {	
		def msg( ) : String = {
			var msg = new Msg;
			var cmd = Map[Any,Any]();
			cmd += ("flowid" -> 88888888);
			cmd += ("msg_id"->3);
			msg.addCmd(cmd);
			return msg.getCmds();
		}
	}	
	
	object get_time {	
		def msg( ) : String = {
			var cmd = Map[Any,Any]();
			cmd += ("msg_id"->3);
			cmd += ("flowid" -> 88888888);
			return Json.build(cmd).toString;
		}
	}	
	object get_activity {	
		def msg( ) : String = {
			var cmd = Map[Any,Any]();
			cmd += ("msg_id"->5);
			cmd += ("flowid" -> 88888888);
			cmd += ("activity_type" -> 1);
			cmd += ("channel" -> "000023");
			cmd += ("version" -> "1.2.4");
			return Json.build(cmd).toString;
		}
	}
	
	val httpProtocol = http
		.baseURL("http://192.168.22.61:20000")
		.inferHtmlResources()
		
		val scn = scenario("Scenario name")
            .exec(
                http("get_time")
                    .post("/")
                    .formParam("token", "1234567788")
                    .formParam("msg",get_time.msg())
                    .check(status.is(200))
				)
			.pause(1)
			.exec(
                http("get_activity")
                    .post("/")
                    .formParam("token", "1234567788")
                    .formParam("msg",get_activity.msg())
                    .check(status.is(200))
				)
			.pause(1)

	setUp(scn.inject(atOnceUsers(100))).protocols(httpProtocol)
}