package controllers

import play.api.libs.json._
import play.api.libs.functional.syntax._
import play.api.mvc._

class Application extends Controller {
  var history = List[Event](
    ExpenditureEvent("Rent", 700, 1465),
    ExpenditureEvent("Phone bill", 35, 2165),
    IncomeEvent("Salary", 2200, 2200)
  )

  def index = Action { implicit request =>
    Ok(views.html.index.render(request))
  }

  def version = Action {
    Ok("""{ "version": "1.0.0" }""").as("application/json")
  }

  def overview = Action {
    Ok(Json.toJson(history.reverse))
  }

  def income = Action(parse.json[IncomeRequest]) { request =>
    history match {
      case head :: tail => history = request.body.toEvent(head.balance) +: history
      case _ => history = List(request.body.toEvent(0))
    }

    Created
  }

  def expenditure = Action(parse.json[ExpenditureRequest]) { request =>
    history match {
      case head :: tail =>
        if (head.balance >= request.body.amount) {
          history = request.body.toEvent(head.balance) +: history
          Created
        } else {
          BadRequest("Insufficient funds")
        }
      case _ =>
        history = List(request.body.toEvent(0))
        Created
    }
  }
}

trait Request {
  val description: String
  val amount: Double

  def toEvent(balance: Double): Event
}

case class ExpenditureRequest(description: String, amount: Double) extends Request {
  override def toEvent(balance: Double): Event = ExpenditureEvent(description, amount, balance - amount)
}
object ExpenditureRequest {
  implicit val expenditureRequestFormat: Format[ExpenditureRequest] = Json.format[ExpenditureRequest]
}

case class IncomeRequest(description: String, amount: Double) extends Request {
  def toEvent(balance: Double): Event = IncomeEvent(description, amount, balance + amount)
}
object IncomeRequest {
  implicit val incomeRequestFormat: Format[IncomeRequest] = Json.format[IncomeRequest]
}

trait Event {
  val `type`: String
  val description: String
  val amount: Double
  val balance: Double
}
object Event {
  implicit val eventWrites: Writes[Event] = (
    (JsPath \ "type").write[String] and
    (JsPath \ "description").write[String] and
    (JsPath \ "amount").write[Double] and
    (JsPath \ "balance").write[Double]
  )(e => Event.unapply(e))

  def apply(`type`: String, description: String, amount: Double, balance: Double): Event = `type` match {
    case "expense" => ExpenditureEvent(description, amount, balance)
    case "income" => IncomeEvent(description, amount, balance)
  }

  def unapply(event: Event): (String, String, Double, Double) =
    (event.`type`, event.description, event.amount, event.balance)
}

case class ExpenditureEvent(description: String, amount: Double, balance: Double) extends Event {
  val `type` = "expense"
}

case class IncomeEvent(description: String, amount: Double, balance: Double) extends Event {
  val `type` = "income"
}
