using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController {
    [HttpGet("not-found")]
    public ActionResult GetNotFound() {
        return NotFound();
    }

    [HttpGet("bad-request")]
    public ActionResult GetBadRequest() {
        // return BadRequest("this is a base request");
        /*
         * ProblemDetails is format for specifying errors in HTTP API responses
         * has following properties:
         * 1. Title
         * 2. Status
         * 3. Type
         * ...
         */
        return BadRequest(new ProblemDetails { Title = "This is a bad request" });
    }

    [HttpGet("unauthorized")]
    public ActionResult GetUnauthorized() {
        return Unauthorized();
    }

    [HttpGet("validation-error")]
    public ActionResult GetValidationError() {
        // the ApiController Attribute will return Validation
        // Error, so we can use ModelState to return Validation 
        // Error.
        ModelState.AddModelError("Problem1", "this is the fisrt problem");
        ModelState.AddModelError("Problem2", "this is the second problem");
        // The ValidationProblem will return 400 BadObjectRequest with array
        // of errors.
        return ValidationProblem();
    }

    [HttpGet("server-error")]
    public ActionResult GetServerError() {
        throw new Exception("This is a server error");
    }
}
