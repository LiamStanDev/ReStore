namespace API.RequestHelpers;

// like DTO to send page information to client.
public class MetaData {
    public int CurrentPage { get; set; }

    public int PageSize { get; set; }

    public int TotalPages { get; set; }

    public int TotalCount { get; set; } // the total number of items in response
}
