
import io.gatling.core.Predef._
import io.gatling.core.session.Expression
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._
import io.gatling.http.Headers.Names._
import io.gatling.http.Headers.Values._
import scala.concurrent.duration._
import bootstrap._
import assertions._

class RecordedSimulation extends Simulation {

	val httpProtocol = http
		.baseURL("http://127.0.0.1:3000/")	
		.acceptHeader("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
		.acceptEncodingHeader("gzip, deflate")
		.acceptLanguageHeader("en-us,en;q=0.5")
		.userAgentHeader("Mozilla/5.0 (X11; Linux x86_64; rv:10.0.12) Gecko/20130109 Firefox/10.0.12")



	val scn = scenario("Scenario Name")
		.exec(http("request_1")
			.post("test"))

	setUp(scn.inject(atOnce(1000 user))).protocols(httpProtocol)
}